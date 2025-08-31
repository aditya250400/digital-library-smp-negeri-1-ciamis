<?php

namespace App\Models;

use App\Enums\BookLanguage;
use App\Enums\BookStatus;
use App\Observers\BookObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(BookObserver::class)]

class Book extends Model
{
    protected $guarded = [];

    public function recommendations()
    {
        return $this->hasMany(BookRecommendation::class, 'book_id');
    }


    protected function casts()
    {
        return [
            'language' => BookLanguage::class,
            'status' => BookStatus::class,
        ];
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->whereAny([
                    'book_code',
                    'title',
                    'slug',
                    'author',
                    'publication_year',
                    'isbn',
                    'language',
                    'status'
                ], 'REGEXP', $search);
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts)
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            $query->orderBy($sorts['field'], $sorts['direction']);
        });
    }

    public function updateStock($columnToDecrement, $columnToIncrement)
    {
        if ($this->stock->$columnToDecrement > 0) {
            return $this->stock()->update([
                $columnToDecrement => $this->stock->$columnToDecrement - 1,
                $columnToIncrement => $this->stock->$columnToIncrement + 1,
            ]);
        }

        return false;
    }

    public static function leastLoanBook($limit = 5)
    {
        return self::query()->select(['id', 'title', 'author'])->withCount('loans')->orderBy('loans_count')->limit($limit)->get();
    }

    public static function mostLoanBook($limit = 5)
    {
        return self::query()->select(['id', 'title', 'author'])->withCount('loans')->orderBy('loans_count', 'desc')->limit($limit)->get();
    }



    public function stock_loan()
    {
        return $this->updateStock('available', 'loan');
    }

    public function stock_lost()
    {
        return $this->updateStock('loan', 'lost');
    }

    public function stock_damaged()
    {
        return $this->updateStock('loan', 'damage');
    }

    public function stock_loan_return()
    {
        return $this->updateStock('loan', 'available');
    }
}
