<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BookRecommendationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'recommended_book_id' => $this->recommended_book_id,
            'support' => $this->support,
            'confidence' => $this->confidence,
            'lift' => $this->lift,
            'recommendedBook' => $this->whenLoaded('recommendedBook', [
                'id' => $this->recommendedBook->id,
                'title' => $this->recommendedBook->title,
                'slug' => $this->recommendedBook->slug,
                'status' => $this->recommendedBook->status,
                'cover' => $this->recommendedBook->cover ? Storage::url($this->recommendedBook->cover) : null,
                'synopsis' => $this->recommendedBook->synopsis,
            ]),
        ];
    }
}
