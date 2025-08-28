<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FineSettingRequest;
use App\Models\FineSetting;
use Illuminate\Http\Request;

class FineSettingController extends Controller
{
    public function create()
    {
        $fine_setting = FineSetting::first();

        return inertia('Admin/FineSettings/Create', [
            'page_setting' => [
                'title' => 'Pengaturan Denda',
                'subtitle' => 'Konfigurasi pengaturan denda di sini. klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.fine-settings.store')
            ],
            'fine_setting' => $fine_setting,
        ]);
    }

    public function store(FineSettingRequest $request)
    {
        $fine_setting = FineSetting::updateOrCreate(
            [],
            [
                'late_fee_per_day' => $request->late_fee_per_day,
                'damage_fee_percentage' => $request->damage_fee_percentage,
                'lost_fee_percentage' => $request->lost_fee_percentage,
            ]
        );

        flashMessage('Berhasil melakukan perubahan pengaturan denda');
        return to_route('admin.fine-settings.create');
    }
}
