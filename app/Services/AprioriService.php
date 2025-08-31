<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AprioriService
{
    /**
     * Generate aturan asosiasi & rekomendasi buku berdasarkan transaksi peminjaman.
     *
     * @param float $minSupport  Minimum support (contoh: 0.30 = 30%)
     * @param float $minConfidence Minimum confidence (contoh: 0.60 = 60%)
     * @param int $topN Jumlah rekomendasi per buku yang disimpan
     */
    public function updateRulesAndRecommendations(float $minSupport = 0.30, float $minConfidence = 0.60, int $topN = 5): void
    {
        // === 1) Identifikasi & Preprocessing Data Transaksi ===
        // Ambil semua detail transaksi (group by transaction_id)
        $details = DB::table('book_transaction_details')
            ->select('transaction_id', 'book_id')
            ->orderBy('transaction_id')
            ->get();

        $grouped = [];
        foreach ($details as $d) {
            $grouped[$d->transaction_id][] = (int) $d->book_id;
        }

        // Buat transaksi unik (hapus duplikat buku dalam 1 transaksi)
        $transactions = [];
        foreach ($grouped as $books) {
            $books = array_values(array_unique($books));
            if (count($books) >= 2) {
                sort($books, SORT_NUMERIC);
                $transactions[] = $books;
            }
        }

        $totalTx = count($transactions);

        // Jika tidak ada transaksi multi-buku, kosongkan aturan & rekomendasi
        if ($totalTx === 0) {
            DB::transaction(function () {
                DB::table('book_rules')->delete();
                DB::table('book_recommendations')->delete();
            });
            return;
        }

        // === 2) Hitung Frekuensi Item & Pasangan ===
        $itemCount = []; // [book_id => count]
        $pairCount = []; // [a => [b => count]]

        foreach ($transactions as $tx) {
            foreach ($tx as $bookId) {
                $itemCount[$bookId] = ($itemCount[$bookId] ?? 0) + 1;
            }
            $n = count($tx);
            for ($i = 0; $i < $n; $i++) {
                for ($j = $i + 1; $j < $n; $j++) {
                    $a = $tx[$i];
                    $b = $tx[$j];
                    $pairCount[$a][$b] = ($pairCount[$a][$b] ?? 0) + 1;
                }
            }
        }

        // === 3) Hitung Support, Confidence, Lift ===
        $candidateRules = [];
        foreach ($pairCount as $a => $arr) {
            foreach ($arr as $b => $cnt) {
                $supportPair = $cnt / $totalTx;
                $supportA = ($itemCount[$a] ?? 0) / $totalTx;
                $supportB = ($itemCount[$b] ?? 0) / $totalTx;

                // Aturan A => B
                if ($supportA > 0) {
                    $confAB = $supportPair / $supportA;
                    $liftAB = $supportPair / max($supportA * $supportB, 1e-9);
                    if ($supportPair >= $minSupport && $confAB >= $minConfidence) {
                        $candidateRules[] = [
                            'base_book_id'    => $a,
                            'related_book_id' => $b,
                            'support'         => round($supportPair, 4),
                            'confidence'      => round($confAB, 4),
                            'lift'            => round($liftAB, 4),
                            'created_at'      => now(),
                            'updated_at'      => now(),
                        ];
                    }
                }

                // Aturan B => A
                if ($supportB > 0) {
                    $confBA = $supportPair / $supportB;
                    $liftBA = $supportPair / max($supportA * $supportB, 1e-9);
                    if ($supportPair >= $minSupport && $confBA >= $minConfidence) {
                        $candidateRules[] = [
                            'base_book_id'    => $b,
                            'related_book_id' => $a,
                            'support'         => round($supportPair, 4),
                            'confidence'      => round($confBA, 4),
                            'lift'            => round($liftBA, 4),
                            'created_at'      => now(),
                            'updated_at'      => now(),
                        ];
                    }
                }
            }
        }

        // === 4) Simpan Aturan & Rekomendasi ===
        DB::transaction(function () use ($candidateRules, $topN) {
            // Hapus aturan lama
            DB::table('book_rules')->delete();
            DB::table('book_recommendations')->delete();

            if (empty($candidateRules)) return;

            // Hilangkan duplikat (ambil aturan dengan lift terbaik)
            $bestByPair = [];
            foreach ($candidateRules as $r) {
                $k = $r['base_book_id'] . '_' . $r['related_book_id'];
                if (!isset($bestByPair[$k]) || $r['lift'] > $bestByPair[$k]['lift']) {
                    $bestByPair[$k] = $r;
                }
            }
            $rulesToInsert = array_values($bestByPair);

            // Simpan aturan
            DB::table('book_rules')->insert($rulesToInsert);

            // Bangun rekomendasi top-N
            $grouped = [];
            foreach ($rulesToInsert as $r) {
                $grouped[$r['base_book_id']][] = $r;
            }

            $recs = [];
            foreach ($grouped as $baseId => $arr) {
                usort($arr, function ($x, $y) {
                    if ($x['lift'] === $y['lift']) {
                        return $y['confidence'] <=> $x['confidence'];
                    }
                    return $y['lift'] <=> $x['lift'];
                });
                $top = array_slice($arr, 0, $topN);
                foreach ($top as $t) {
                    $recs[] = [
                        'book_id'             => $t['base_book_id'],
                        'recommended_book_id' => $t['related_book_id'],
                        'support'             => $t['support'],
                        'confidence'          => $t['confidence'],
                        'lift'                => $t['lift'],
                        'created_at'          => now(),
                        'updated_at'          => now(),
                    ];
                }
            }

            if (!empty($recs)) {
                DB::table('book_recommendations')->insert($recs);
            }
        });
    }
}
