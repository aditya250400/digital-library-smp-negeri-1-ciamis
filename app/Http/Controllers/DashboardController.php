<?php

namespace App\Http\Controllers;

use App\Http\Resources\Admin\TransactionLoanResource;
use App\Http\Resources\Admin\TransactionReturnBookResource;
use App\Http\Resources\BookRecommendationResource;
use App\Models\Book;
use App\Models\BookRecommendation;
use App\Models\Fine;
use App\Models\Loan;
use App\Models\ReturnBook;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $personalizedRecs = collect();

        if ($user->hasRole('member')) {
            $lastLoans = Loan::where('user_id', $user->id)
                ->latest('loan_date')
                ->pluck('book_id');

            $uniqueids = BookRecommendation::selectRaw('MIN(id) as id')
                ->groupBy('recommended_book_id')
                ->pluck('id');

            $personalizedRecs = BookRecommendation::with('recommendedBook')
                ->whereIn('book_id', $lastLoans)
                ->whereIn('id', $uniqueids)
                ->distinct('recommended_book_id')
                ->orderByDesc('confidence')
                ->take(5)
                ->get();
        }

        $loans = Loan::query()
            ->select(['id', 'loan_code', 'book_id', 'user_id', 'created_at'])
            ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                return $query;
            }, function ($query) {
                return $query->where('user_id', auth()->user()->id);
            })->latest()->limit(5)->with(['user', 'book'])->get();

        $return_books = ReturnBook::query()
            ->select(['id', 'return_book_code', 'book_id', 'user_id', 'created_at'])
            ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                return $query;
            }, function ($query) {
                return $query->where('user_id', auth()->user()->id);
            })->latest()->limit(5)->with(['user', 'book'])->get();

        return inertia('Dashboard', [
            'page_setting' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini',
            ],
            'book_recommendations' => BookRecommendationResource::collection($personalizedRecs),
            'page_data' => [
                'transactionChart' => $this->chart(),
                'loans' => TransactionLoanResource::collection($loans),
                'return_books' => TransactionReturnBookResource::collection($return_books),
                'total_books' => auth()->user()->hasAnyRole(['admin', 'operator']) ? Book::count() : 0,
                'total_users' => auth()->user()->hasAnyRole(['admin', 'operator']) ? User::count() : 0,
                'total_loans' => Loan::query()
                    ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                        return $query;
                    }, function ($query) {
                        return $query->where('user_id', auth()->user()->id);
                    })->count(),
                'total_returns' => ReturnBook::query()
                    ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                        return $query;
                    }, function ($query) {
                        return $query->where('user_id', auth()->user()->id);
                    })->count(),
                'total_fines' => auth()->user()->hasRole('member') ? Fine::query()
                    ->where('user_id', auth()->user()->id)->sum('total_fee') : 0,
            ]
        ]);
    }

    public function chart()
    {
        $end_date = Carbon::now();

        $start_date = $end_date->copy()->subMonth()->startOfMonth();

        $loans = Loan::query()
            ->selectRaw('DATE(loan_date) as date, COUNT(*) as loan')
            ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                return $query;
            }, function ($query) {
                return $query->where('user_id', auth()->user()->id);
            })
            ->whereBetween('loan_date', [$start_date, $end_date])
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('loan', 'date');

        $return_books = ReturnBook::query()
            ->selectRaw('Date(return_date) as date, COUNT(*) as returns')
            ->when(auth()->user()->hasAnyRole(['admin', 'operator']), function ($query) {
                return $query;
            }, function ($query) {
                return $query->where('user_id', auth()->user()->id);
            })
            ->whereNotNull('return_date')
            ->whereBetween('return_date', [$start_date, $end_date])
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('returns', 'date');

        $charts = [];

        $period = Carbon::parse($start_date)->daysUntil($end_date);

        foreach ($period as $date) {
            # code...

            $date_string = $date->toDateString();

            $charts[] = [
                'date' => $date_string,
                'loan' => $loans->get($date_string, 0),
                'return_book' => $return_books->get($date_string, 0),
            ];
        }

        return $charts;
    }
}
