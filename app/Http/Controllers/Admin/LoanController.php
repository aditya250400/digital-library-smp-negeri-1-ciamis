<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoanRequest;
use App\Http\Resources\Admin\LoanResource;
use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::query()
            ->select(['id', 'loan_code', 'user_id', 'book_id', 'loan_date', 'due_date', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['book', 'user', 'returnBook'])
            ->latest()
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Admin/Loans/Index', [
            'page_setting' => [
                'title' => 'Peminjaman',
                'subtitle' => 'Menampilkan semua data peminjaman yang tersedia pada platform ini'
            ],
            'loans' => LoanResource::collection($loans)->additional([
                'meta' => [
                    'has_pages' => $loans->hasPages()
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10
            ],
        ]);
    }

    public function create()
    {

        return inertia('Admin/Loans/Create', [
            'page_setting' => [
                'title' => 'Tambah Peminjaman',
                'subtitle' => 'Buat Peminjaman Buku di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.loans.store'),
            ],
            'page_data' => [
                'date' => [
                    'loan_date' => Carbon::now()->toDateString(),
                    'due_date' => Carbon::now()->addMonths(6)->toDateString()
                ],
                'books' => Book::query()->select(['id', 'title'])
                    ->whereHas('stock', fn($query) => $query->where('available', '>', 0))->get()->map((fn($item) => [
                        'value' => $item->title,
                        'label' => $item->title
                    ])),
                'users' => User::query()
                    ->select(['id', 'name'])
                    ->whereHas('roles', fn($query) => $query->where('name', 'member'))
                    ->orderBy('name')
                    ->get()
                    ->map(fn($item) => [
                        'value' => $item->name,
                        'label' => $item->name
                    ])
            ],
        ]);
    }

    public function store(LoanRequest $request)
    {
        try {

            $book = Book::query()->where('title', $request->book)->firstOrFail();
            $user = User::query()->where('name', $request->user)->firstOrFail();

            if (Loan::checkLoanBook($user->id, $book->id)) {
                flashMessage('Pengguna sudah meminjam buku ini', 'error');
                return back();
            }

            if ($request->due_date < now()->toDateString()) {
                flashMessage('Tanggal pengembalian tidak boleh lebih awal dari tanggal hari ini', 'error');
                return back();
            }

            $book->stock->available > 0 ? tap(
                Loan::create([
                    'loan_code' => str()->lower(str()->random(10)),
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'loan_date' => Carbon::now()->toDateString(),
                    'due_date' => $request->due_date,

                ]),
                function ($loan) {
                    $loan->book->stock_loan();
                    flashMessage('Berhasil Menambahkan Peminjaman');
                }

            ) : flashMessage('Stock Buku tidak tersedia', 'error');


            return to_route('admin.loans.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.loans.index');

            // return to_route('admin.loans.index');
        }
    }

    public function edit(Loan $loan)
    {
        return inertia('Admin/Loans/Edit', [
            'page_setting' => [
                'title' => 'Edit Peminjaman',
                'subtitle' => 'Edit Peminjaman di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.loans.update', $loan)
            ],
            'page_data' => [
                'loan' => $loan->load(['user', 'book']),
                'date' => [
                    'loan_date' => Carbon::now()->toDateString(),
                    'due_date' =>  Carbon::parse($loan->due_date)->format('Y-m-d'),
                ],
                'books' => Book::query()->select(['id', 'title'])
                    ->whereHas('stock', fn($query) => $query->where('available', '>', 0))->get()->map((fn($item) => [
                        'value' => $item->title,
                        'label' => $item->title
                    ])),
                'users' => User::query()
                    ->select(['id', 'name'])
                    ->whereHas('roles', fn($query) => $query->where('name', 'member'))
                    ->orderBy('name')
                    ->get()
                    ->map(fn($item) => [
                        'value' => $item->id,
                        'label' => $item->name
                    ])
            ],
        ]);
    }

    public function update(Loan $loan, LoanRequest $request)
    {
        try {

            $isUserChanged = $loan->user->name != $request->user;
            $isBookChanged = $loan->book->title != $request->book;

            $book = Book::query()->where('title', $request->book)->firstOrFail();
            $user = User::query()->where('name', $request->user)->firstOrFail();

            if ($isBookChanged || $isUserChanged) {

                if (Loan::checkLoanBook($user->id, $book->id)) {
                    flashMessage('Pengguna sudah meminjam buku ini', 'error');
                    return back();
                }
            }

            if ($request->due_date < now()->toDateString()) {
                flashMessage('Tanggal pengembalian tidak boleh lebih awal dari tanggal hari ini', 'error');
                return back();
            }

            $loan->update([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'due_date' => $request->due_date

            ]);

            flashMessage(MessageType::UPDATED->message('Peminjaman'));

            return to_route('admin.loans.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
        }
    }


    public function destroy(Loan $loan)
    {
        try {

            $loan->delete();

            flashMessage(MessageType::DELETED->message('Peminjaman'));

            return to_route('admin.loans.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.loans.index');
        }
    }
}
