<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReturnBookFrontResource;
use App\Http\Resources\ReturnBookFrontSingleResource;
use App\Models\Book;
use App\Models\Loan;
use App\Models\ReturnBook;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReturnBookFrontController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();

        $return_books = ReturnBook::query()
            ->select(['id', 'return_book_code', 'status', 'loan_id', 'user_id', 'book_id', 'return_date', 'created_at'])
            ->where('user_id', $authUser->id)
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['book', 'fine', 'loan', 'user', 'returnBookCheck'])
            ->latest()
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Front/ReturnBooks/Index', [
            'page_setting' => [
                'title' => 'Pengembalian',
                'subtitle' => 'Menampilkan semua data pengembalian anda'
            ],
            'return_books' => ReturnBookFrontResource::collection($return_books)->additional([
                'meta' => [
                    'has_pages' => $return_books->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
            'page_data' => [
                'returned' => ReturnBook::query()->member($authUser->id)->returned()->count(),
                'fine' => ReturnBook::query()->member($authUser->id)->fine()->count(),
                'checked' => ReturnBook::query()->member($authUser->id)->checked()->count(),
            ]
        ]);
    }

    public function store(Book $book, Loan $loan)
    {

        $authUser = Auth::user();

        $return_book = $loan->returnBook()->create([
            'return_book_code' => str()->lower(str()->random(10)),
            'book_id' => $book->id,
            'user_id' => $authUser->id,
            'return_date' => Carbon::today(),
        ]);

        flashMessage('Buku anda sedang dilakukan pengecekan oleh petugas kami');

        return to_route('front.return-books.show', [$return_book->return_book_code]);
        // return to_route('front.loans.show', [$loan->loan_code]);
    }

    public function show(ReturnBook $returnBook)
    {
        return inertia('Front/ReturnBooks/Show', [
            'page_setting' => [
                'title' => 'Detail Pengembalian Buku',
                'subtitle' => 'Informasi detail buku yang anda kembalikan',
            ],
            'return_book' => new ReturnBookFrontSingleResource($returnBook->load(
                'book',
                'user',
                'loan',
                'fine',
                'returnBookCheck'
            )),
        ]);
    }
}
