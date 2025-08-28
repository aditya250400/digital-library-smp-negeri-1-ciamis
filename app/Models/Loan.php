<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $guarded = [];


    protected $casts = [
        'loan_date' => 'date',
        'due_date' => 'date',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function returnBook()
    {
        return $this->hasOne(ReturnBook::class);
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->whereAny([
                    'loan_code',
                    'loan_date',
                    'due_date'
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

    public static function checkLoanBook($user_id, $book_id)
    {
        return self::query()
            ->where('user_id', $user_id)
            ->where('book_id', $book_id)
            ->whereDoesntHave('returnBook', fn($query) => $query->where('book_id', $book_id)->where('user_id', $user_id))->exists();
    }

    public static function totalLoanBooks()
    {
        return [
            'days' => self::whereDate('created_at', Carbon::now()->toDateString())->count(),
            'weeks' => self::whereBetWeen('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
            'months' => self::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)->count(),
            'years' => self::whereYear('created_at', Carbon::now()->year)->count(),
        ];
    }
}
