<?php

namespace App\Models;

use App\Enums\FinePaymentStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $guarded  = [];

    protected $casts = [
        'payment_status' => FinePaymentStatus::class,
        'fine_date' => 'date',

    ];

    public static function totalFines()
    {
        return [
            'days' => self::whereDate('created_at', Carbon::now()->toDateString())->count(),
            'weeks' => self::whereBetWeen('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
            'months' => self::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)->count(),
            'years' => self::whereYear('created_at', Carbon::now()->year)->count(),
        ];
    }


    public function returnBook()
    {
        return $this->belongsTo(ReturnBook::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
