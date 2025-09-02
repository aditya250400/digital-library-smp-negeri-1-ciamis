<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserGender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UserRequest extends FormRequest
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
            'name' => 'required|min:3|max:100|string',
            'email' => ['required', 'email', 'max:100', Rule::unique('users')->ignore($this->user)],
            'password' => Rule::when($this->routeIs('admin.users.store'), [
                'required',
                'min:8',
                'max:100',
                'confirmed'
            ]),
            Rule::when($this->routeIs('admin.users.update'), [
                'nullable',
                'min:8',
                'max:100',
                'confirmed'
            ]),
            'phone' => 'nullable|min:10|max:20',
            'avatar' => 'nullable|mimes:png,jpg|max:2048',
            'birth_of_birth' => 'nullable|date',
            'gender' =>  [
                'required',
                new Enum(UserGender::class),

            ],
            'address' => 'nullable|string|min:3|max:255'

        ];
    }

    public function attributes()
    {
        return [
            'name' => 'nama',
            'email' => 'email',
            'password' => 'password',
            'phone' => 'Nomor Handphone',
            'date_of_birth' => 'Tanggal Lahir',
            'address' => 'Alamat',
        ];
    }
}
