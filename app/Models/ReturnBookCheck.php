<?php

namespace App\Models;

use App\Enums\ReturnBookCondition;
use Illuminate\Database\Eloquent\Model;

class ReturnBookCheck extends Model
{
    protected $guarded = [];


    protected $casts = [
        'condition' => ReturnBookCondition::class,
    ];

    public function returnBook()
    {
        return $this->belongsTo(ReturnBook::class);
    }
}
