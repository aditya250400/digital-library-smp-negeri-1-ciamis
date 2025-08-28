<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ReturnFineSingleResource;
use App\Models\ReturnBook;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function create(ReturnBook $returnBook)
    {

        return inertia('Admin/Fines/Create', [
            'page_setting' => [
                'title' => 'Denda',
                'subtitle' => 'Selesaikan pembayaran denda terlebih dahulu',
            ],
            'return_book' => new ReturnFineSingleResource($returnBook->load([
                'book',
                'fine',
                'loan',
                'user',
                'returnBookCheck',
            ]))
        ]);
    }
}
