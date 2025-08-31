<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookFrontSingleResource;
use App\Http\Resources\BookRecommendationResource;
use App\Http\Resources\CategoryFrontResource;
use App\Models\Book;
use App\Models\BookRecommendation;
use App\Models\Category;
use Illuminate\Http\Request;

class BookFrontController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->select(['id', 'name', 'slug', 'cover', 'created_at'])
            ->whereHas('books')
            ->with([
                'books' => fn($query) => $query->limit(4)
            ])
            ->latest()->get();

        return inertia('Front/Books/Index', [
            'page_setting' => [
                'title' => 'Buku',
                'subtitle' => 'Menampilkan semua buku yang tesedia pada platform ini'
            ],
            'categories' => CategoryFrontResource::collection($categories)
        ]);
    }

    public function show(Book $book)
    {
        $recommendations = BookRecommendation::with('recommendedBook')
            ->where('book_id', $book->id)
            ->orderByDesc('lift')
            ->orderByDesc('confidence')
            ->take(5)
            ->get();

        return inertia('Front/Books/Show', [
            'page_setting' => [
                'title' => $book->title,
                'subtitle' => "Menampilkan detail informasi buku {$book->title}"
            ],
            'book' => new BookFrontSingleResource($book->load(['category', 'publisher', 'stock'])),
            'book_recommendations' => BookRecommendationResource::collection($recommendations),
        ]);
    }
}
