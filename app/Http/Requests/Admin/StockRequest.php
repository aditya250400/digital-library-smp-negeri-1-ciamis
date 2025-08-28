<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'total' => 'required|numeric|min:0',
            'available' => 'required|numeric|min:0',
            'lost' => 'required|numeric|min:0',
            'loan' => 'required|numeric|min:0',
            'damage' => 'required|numeric|min:0',
        ];
    }

    public function attributes()
    {
        return [
            'total' => 'Total',
            'available' => 'Tersedoa',
            'loan' => 'Dipinjam',
            'lost' => 'Hilang',
            'damage' => 'Rusak',
        ];
    }
}
