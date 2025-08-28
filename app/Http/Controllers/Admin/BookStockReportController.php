<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StockRequest;
use App\Http\Resources\Admin\StockResource;
use App\Models\Stock;
use Illuminate\Http\Request;
use Throwable;

class BookStockReportController extends Controller
{
    public function index()
    {
        $stocks = Stock::query()
            ->select(['stocks.id', 'book_id', 'total', 'available', 'loan', 'lost', 'damage', 'stocks.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Admin/BookStockReports/Index', [
            'page_setting' => [
                'title' => 'Laporan Stok Buku',
                'subtitle' => 'Menampilkan laporan stock buku yang tersedia pada platform ini'
            ],
            'stocks' => StockResource::collection($stocks)->additional([
                'meta' => [
                    'has_pages' => $stocks->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ]
        ]);
    }

    public function edit(Stock $stock)
    {

        return inertia('Admin/BookStockReports/Edit', [
            'page_setting' => [
                'title' => 'Edit Stock',
                'subtitle' => 'Edit stok disini. klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.book-stock-reports.update', $stock),

            ],
            'stock' => $stock,
        ]);
    }

    public function update(Stock $stock, StockRequest $request)
    {
        try {
            $minimum_total = $request->available + $request->loan + $request->lost + $request->damage;

            if ($request->total < $minimum_total) {
                flashMessage('Total tidak boleh lebih kecil dari peminjaman yang tersedia, dipinjam, hilang, dan rusak', 'error');

                return back();
            }

            $stock->update([
                'total' => $request->total,
                'available' => $request->available,
            ]);
            flashMessage(MessageType::UPDATED->message('stock buku'));
            return to_route('admin.book-stock-reports.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.book-stock-reports.index');
        }
    }
}
