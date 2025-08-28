<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\LoanStatisticResource;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanStatisticController extends Controller
{
    public function index()
    {

        return inertia('Admin/LoanStatistics/Index', [
            'page_setting' => [
                'title' => 'Statistik Peminjaman',
                'subtitle' => 'Menampilkan statistik peminjaman yang tersedia pada platform ini'
            ],
            'page_data' => [
                'least_loan_books' => LoanStatisticResource::collection(Book::leastLoanBook(5)),
                'most_loan_books' => LoanStatisticResource::collection(Book::mostLoanBook(5)),
                'total_loans' => Loan::totalLoanBooks(),
            ]
        ]);
    }
}
