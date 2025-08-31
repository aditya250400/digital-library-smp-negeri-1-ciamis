<?php

namespace App\Http\Controllers;

use App\Http\Resources\LoanFrontResource;
use App\Http\Resources\LoanFrontSingleResource;
use App\Models\Book;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LoanFrontController extends Controller
{

    public function index()
    {
        $authUser = Auth::user();

        $loans = Loan::query()
            ->select(['id', 'loan_code', 'user_id', 'book_id', 'loan_date', 'due_date', 'created_at'])
            ->where('user_id', $authUser->id)
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['book', 'user'])
            ->latest()
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Front/Loans/Index', [
            'page_setting' => [
                'title' => 'Peminjaman',
                'subtitle' => 'Menampilkan semua data peminjaman anda yan tersedia pada platform ini'
            ],
            'loans' => LoanFrontResource::collection($loans)->additional([
                'meta' => [
                    'has_pages' => $loans->hasPages(),
                ]
            ]),
            'state' => [
                'search' => request()->search ?? '',
                'page' => request()->page ?? 1,
                'load' => 10
            ]
        ]);
    }

    // public function store(Book $book)
    // {
    //     $authUser = Auth::user();

    //     if (Loan::checkLoanBook($authUser->id, $book->id)) {
    //         flashMessage('Anda sudah meminjam buku ini, harap kembalikan bukunya terlebih dahulu', 'error');
    //         return to_route('front.books.show', $book->slug);
    //     }
    //     if ($book->stock->available <= 0) {
    //         flashMessage('Stock buku tidak tersedia', 'error');
    //         return to_route('front.books.show', $book->slug);
    //     }

    //     $loan = tap(Loan::create([
    //         'loan_code' => str()->lower(str()->random(10)),
    //         'user_id' => $authUser->id,
    //         'book_id' => $book->id,
    //         'loan_date' => Carbon::now()->toDateString(),
    //         'due_date' => Carbon::now()->addMonths(6)->toDateString(),
    //     ]), function ($loan) {
    //         $loan->book->stock_loan();
    //         flashMessage('Berhasil melakukan peminjaman buku');
    //     });

    //     return to_route('front.loans.index');
    // }

    public function store(Book $book)
    {
        $authUser = Auth::user();

        if (Loan::checkLoanBook($authUser->id, $book->id)) {
            flashMessage('Anda sudah meminjam buku ini, harap kembalikan bukunya terlebih dahulu', 'error');
            return to_route('front.books.show', $book->slug);
        }
        if ($book->stock->available <= 0) {
            flashMessage('Stock buku tidak tersedia', 'error');
            return to_route('front.books.show', $book->slug);
        }
        try {
            DB::beginTransaction();
            $loan = tap(Loan::create([
                'loan_code' => str()->lower(str()->random(10)),
                'user_id' => $authUser->id,
                'book_id' => $book->id,
                'loan_date' => Carbon::now()->toDateString(),
                'due_date' => Carbon::now()->addMonths(6)->toDateString(),
            ]), function ($loan) {
                $loan->book->stock_loan();
                flashMessage('Berhasil melakukan peminjaman buku');
            });

            // --- catat ke tabel transaksi Apriori (header + detail) ---

            $transaction = \App\Models\BookTransaction::firstOrCreate([
                'user_id' => $authUser->id,
                'transaction_date' => Carbon::now()->toDateString(),
            ]);

            \App\Models\BookTransactionDetail::create([
                'transaction_id' => $transaction->id,
                'book_id' => $book->id,
            ]);

            // jalankan Apriori .
            app(\App\Services\AprioriService::class)->updateRulesAndRecommendations(
                0.2, // minSupport
                0.5, // minConfidence
                5    // topN
            );

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            flashMessage('Terjadi kesalahan: ' . $e->getMessage(), 'error');
            return to_route('front.loans.index');
            // Log::error('AprioriService failed: ' . $e->getMessage());
        }

        return to_route('front.loans.index');
    }



    public function show(Loan $loan)
    {
        return inertia('Front/Loans/Show', [
            'page_setting' => [
                'title' => 'Detail Peminjaman Buku',
                'subtitle' => 'Informasi detail data buku yang anda pinjam '
            ],
            'loan' => new LoanFrontSingleResource($loan->load(['book', 'user', 'returnBook'])),
        ]);
    }
}
