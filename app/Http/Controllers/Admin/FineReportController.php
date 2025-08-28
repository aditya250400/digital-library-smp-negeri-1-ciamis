<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FinePaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\FineResource;
use App\Http\Resources\Admin\MostFineMemberResource;
use App\Models\Fine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FineReportController extends Controller
{
    //

    public function index()
    {
        $fines = Fine::query()
            ->select(['id', 'return_book_id', 'user_id', 'late_fee', 'other_fee', 'fine_date', 'payment_status', 'created_at', 'total_fee'])
            ->with(['user', 'returnBook'])
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/FineReports/Index', [
            'page_setting' => [
                'title' => 'Laporan Denda',
                'subtitle' => 'Menampilkan laporan denda yang tersedia pada platform ini',
            ],
            'page_data' => [
                'fines' => FineResource::collection($fines)->additional([
                    'meta' => [
                        'has_pages' => $fines->hasPages()
                    ]
                ]),
                'most_fine_members' => MostFineMemberResource::collection(
                    Fine::select('user_id', DB::raw('SUM(total_fee) as total_fee'))
                        ->groupBy('user_id')
                        ->with('user')
                        ->orderByDesc('total_fee')
                        ->get()
                ),
                'fine_paid' => Fine::query()->where('payment_status', FinePaymentStatus::SUCCESS->value)
                    ->sum('total_fee'),
                'fine_pending' => Fine::query()->whereNot('payment_status', FinePaymentStatus::SUCCESS->value)->sum('total_fee'),
                'total_fines' => Fine::totalFines(),
            ]
        ]);
    }
}
