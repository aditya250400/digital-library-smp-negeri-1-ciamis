<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Enums\ReturnBookCondition;
use App\Enums\ReturnBookStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReturnBookRequest;
use App\Http\Resources\Admin\ReturnBookResource;
use App\Models\FineSetting;
use App\Models\Loan;
use App\Models\ReturnBook;
use App\Models\ReturnBookCheck;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ReturnBookController extends Controller
{
    public function index()
    {
        $return_books = ReturnBook::query()
            ->select(['id', 'return_book_code', 'status', 'loan_id', 'user_id', 'book_id', 'return_date', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['book', 'fine', 'loan', 'user', 'returnBookCheck'])
            ->latest()
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Admin/ReturnBooks/Index', [
            'page_setting' => [
                'title' => 'Pengembalian',
                'subtitle' => 'Menampilkan semua data pengembalian yang tersedia pada platform ini'
            ],
            'return_books' => ReturnBookResource::collection($return_books)->additional([
                'meta' => [
                    'has_pages' => $return_books->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
            'conditions' => ReturnBookCondition::options(),
        ]);
    }

    public function create(Loan $loan)
    {
        if ($loan->returnBook()->exists()) {
            return to_route('admin.loans.index');
        }

        if (!FineSetting::first()) {
            return to_route('admin.fine-settings.create');
        }

        return inertia('Admin/ReturnBooks/Create', [
            'page_setting' => [
                'title' => 'Pengembalian Buku',
                'subtitle' => 'Kembalikan buku yang dipinjam disini. Klik kembalikan setelah selesai.',
                'method' => 'POST',
                'action' => route('admin.return-books.store', $loan)
            ],
            'loan' =>  [
                'id' => $loan->id,
                'loan_code' => $loan->loan_code,
                'loan_date' => Carbon::parse($loan->loan_date)->toDateString(),
                'due_date' => Carbon::parse($loan->due_date)->toDateString(),
                'user' => $loan->user,
                'book' => $loan->book->load('publisher'),
            ],
            'date' => [
                'return_date' => Carbon::now()->toDateString(),
            ],
            'conditions' => ReturnBookCondition::options(),
        ]);
    }

    public function store(Loan $loan, ReturnBookRequest $request)
    { {
            try {

                DB::beginTransaction();

                $return_book = $loan->returnBook()->create([
                    'return_book_code' => str()->lower(str()->random(10)),
                    'book_id' => $loan->book_id,
                    'user_id' => $loan->user_id,
                    'return_date' => Carbon::today(),
                ]);

                $return_book_check = $return_book->returnBookCheck()->create([
                    'condition' => $request->condition,
                    'notes' => $request->notes,
                ]);

                match ($return_book_check->condition->value) {
                    ReturnBookCondition::GOOD->value => $return_book->book->stock_loan_return(),
                    ReturnBookCondition::LOST->value => $return_book->book->stock_lost(),
                    ReturnBookCondition::DAMAGE->value => $return_book->book->stock_damaged(),
                    default => flashMessage('Kondisi Buku Tidak sesuai', 'error'),
                };

                $isOnTime = $return_book->isOnTime();
                $daysLate = $return_book->getDaysLate();

                $fineData = $this->calculateFine($return_book, $return_book_check, FineSetting::first(), $daysLate);

                DB::commit();

                if ($isOnTime) {
                    if ($fineData) {
                        flashMessage($fineData['message'], 'error');
                        return to_route('admin.fines.create', $return_book->return_book_code);
                    }

                    flashMessage('Berhasil mengembalikan buku');

                    return to_route('admin.return-books.index');
                } else {
                    if ($fineData) {
                        flashMessage($fineData['message'], 'error');
                        return to_route('admin.fines.create', $return_book->return_book_code);
                    }
                }
                flashMessage('Berhasil mengembalikan buku');

                return to_route('admin.return-books.index');
            } catch (Throwable $e) {
                DB::rollBack();
                flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
                return to_route('admin.loans.index');
                // return to_route('admin.books.index');
            }
        }
    }

    private function createFine(ReturnBook $returnBook, $lateFee, $otherFee)
    {
        return $returnBook->fine()->create([
            'user_id' => $returnBook->user_id,
            'late_fee' => $lateFee,
            'other_fee' => $otherFee,
            'total_fee' => $lateFee + $otherFee,
            'fine_date' => Carbon::today(),
        ]);
    }

    private function calculateFine(ReturnBook $returnBook,  ReturnBookCheck $returnBookCheck, FineSetting $fineSetting, $dayslate)
    {
        $late_fee = $fineSetting->late_fee_per_day *  $dayslate;

        switch ($returnBookCheck->condition->value) {
            case ReturnBookCondition::DAMAGE->value:
                $other_fee = ($fineSetting->damage_fee_percentage / 100) * $returnBook->book->price;
                $returnBook->update([
                    'status' => ReturnBookStatus::FINE->value,
                ]);

                $this->createFine($returnBook, $late_fee, $other_fee);

                return [
                    'message' => 'Kondisi buku rusak, harus membayar denda kerusakan',
                ];
                break;
            case ReturnBookCondition::LOST->value:
                $other_fee = ($fineSetting->lost_fee_percentage / 100)  * 2 * $returnBook->book->price;
                $returnBook->update([
                    'status' => ReturnBookStatus::FINE->value,
                ]);

                $this->createFine($returnBook, $late_fee, $other_fee);

                return [
                    'message' => 'Kondisi buku hilang, harus membayar denda kehilangan buku',
                ];
                break;
            default:
                if ($dayslate > 0) {
                    $returnBook->update([
                        'status' => ReturnBookStatus::FINE->value
                    ]);
                    $this->createFine($returnBook, $late_fee, 0);


                    return [
                        'message' => 'Terlambat mengembalikan buku dan harus membayar denda keterlambatan',
                    ];
                } else {
                    $returnBook->update([
                        'status' => ReturnBookStatus::RETURNED->value,
                    ]);
                }

                break;
        }
    }

    public function approve(ReturnBook $returnBook, ReturnBookRequest $request)
    {
        try {
            DB::beginTransaction();

            $return_book_check = $returnBook->returnBookCheck()->create([
                'condition' => $request->condition,
                'notes' => $request->notes,
            ]);

            match ($return_book_check->condition->value) {
                ReturnBookCondition::GOOD->value => $returnBook->book->stock_loan_return(),
                ReturnBookCondition::LOST->value => $returnBook->book->stock_lost(),
                ReturnBookCondition::DAMAGE->value => $returnBook->book->stock_damaged(),
                default => flashMessage('Kondisi buku tidak sesuai', 'error'),
            };

            $isOnTime = $returnBook->isOnTime();
            $daysLate = $returnBook->getDaysLate();
            $fineData = $this->calculateFine($returnBook, $return_book_check, FineSetting::first(), $daysLate);

            DB::commit();

            if ($isOnTime) {
                if ($fineData) {
                    flashMessage($fineData['message'], 'error');
                    return to_route('admin.return-books.index');
                }

                flashMessage('Berhasil menyetujui pengembalian buku');
                return to_route('admin.return-books.index');
            } else {
                if ($fineData) {
                    flashMessage($fineData['message'], 'error');
                    return to_route('admin.return-books.index');
                }
                return to_route('admin.return-books.index');
            }
            return to_route('admin.return-books.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.loans.index');
        }
    }
}
