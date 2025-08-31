<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookRecommendation extends Model
{
    protected $guarded = [];

    public function baseBook()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function recommendedBook()
    {
        return $this->belongsTo(Book::class, 'recommended_book_id');
    }
}
