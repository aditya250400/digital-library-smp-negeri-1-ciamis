<?php

namespace App\Http\Controllers;

use App\Http\Resources\FineFrontResource;
use App\Models\Fine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FineFrontController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $authUser = Auth::user();
        $fines = Fine::query()
            ->select(['id', 'return_book_id', 'user_id', 'late_fee', 'other_fee', 'fine_date', 'payment_status', 'created_at', 'total_fee'])
            ->where('user_id', $authUser->id)
            ->with(['user', 'returnBook'])
            ->paginate(10)
            ->withQueryString();

        return inertia('Front/Fines/Index', [
            'page_setting' => [
                'title' => 'Laporan Denda',
                'subtitle' => 'Menampilkan laporan denda anda yang tersedia pada platform ini',
            ],
            'fines' => FineFrontResource::collection($fines)->additional([
                'meta' => [
                    'has_pages' => $fines->hasPages()
                ]
            ]),
        ]);
    }
}
