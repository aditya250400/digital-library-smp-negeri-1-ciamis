<?php

namespace App\Models;

use App\Enums\ReturnBookStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ReturnBook extends Model
{
    protected $guarded = [];


    protected $cast = [
        'status' => ReturnBookStatus::class,
        'return_date' => 'date',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function returnBookCheck()
    {
        return $this->hasOne(ReturnBookCheck::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fine()
    {
        return $this->hasOne(Fine::class);
    }

    public function check()
    {
        return $this->hasOne(ReturnBookCheck::class);
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->whereAny([
                    'return_book_code',
                    'status',
                ], 'REGEXP', $search);
            })
                ->orWhereHas('loan', fn($query) => $query->where('loan_code', 'REGEXP', $search))
                ->orWhereHas('user', fn($query) => $query->where('name', 'REGEXP', $search))
                ->orWhereHas('book', fn($query) => $query->where('title', 'REGEXP', $search));
        });
    }

    public function scopeSorting(Builder $query, array $sorts)
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            // $query->orderBy($sorts['field'], $sorts['direction']);

            match ($sorts['field']) {
                'loan_code' => $query->whereHas('loan', fn($query) => $query->orderBy('loan_code', $sorts['direction'])),
                default => $query->orderBy($sorts['field'], $sorts['direction'])
            };
        });
    }

    public function scopeReturned(Builder $query)
    {
        return $query->where('status', ReturnBookStatus::RETURNED->value);
    }

    public function scopeFine(Builder $query)
    {
        return $query->where('status', ReturnBookStatus::FINE->value);
    }

    public function scopeChecked(Builder $query)
    {
        return $query->where('status', ReturnBookStatus::CHECKED->value);
    }

    public function scopeMember(Builder $query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function isOnTime()
    {
        return Carbon::today()->lessThanOrEqualTo(Carbon::parse($this->loan->due_date));
    }

    public function getDaysLate()
    {
        return max(0, Carbon::parse($this->loan->loan_date)->diffInDays(Carbon::parse($this->return_date)));
    }
}
