<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Enums\UserGender;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use App\Traits\HasFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;

class UserController extends Controller
{
    use HasFile;

    public function index()
    {
        $users = User::query()
            ->select(['id', 'name', 'phone', 'username', 'email', 'avatar', 'gender', 'date_of_birth', 'address', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->latest()
            ->paginate(request()->load ?? 10)->withQueryString();

        return inertia('Admin/Users/Index', [
            'page_setting' => [
                'title' => 'Pengguna',
                'subtitle' => 'Menampilkan semua data pengguna yang tersedia pada platform ini'
            ],
            'users' => UserResource::collection($users)->additional([
                'meta' => [
                    'has_pages' => $users->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10

            ]
        ]);
    }

    public function create()
    {

        return inertia('Admin/Users/Create', [
            'page_setting' => [
                'title' => 'Tambah Pengguna',
                'subtitle' => 'Buat pengguna baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.users.store'),
            ],
            'genders' => UserGender::options(),
        ]);
    }

    public function store(UserRequest $request)
    {
        try {
            User::create([
                'name' => $name = $request->name,
                'username' => usernameGenerator($name),
                'email' => $request->email,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
                'address' => $request->address,
            ]);

            flashMessage(MessageType::CREATED->message('Pengguna'));

            return to_route('admin.users.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.users.index');
        }
    }

    public function edit(User $user)
    {
        return inertia('Admin/Users/Edit', [
            'page_setting' => [
                'title' => 'Edit Pengguna',
                'subtitle' => 'Edit Pengguna di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.users.update', $user)
            ],
            'user' => $user,
            'genders' => UserGender::options(),

        ]);
    }

    public function update(User $user, UserRequest $request)
    {
        try {
            $user->update([
                'name' => $name = $request->name,
                'username' => usernameGenerator($name),
                'email' => $request->email,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'avatar' => $this->update_file($request, $user, 'avatar', 'users'),
                'address' => $request->address,

            ]);
            flashMessage(MessageType::UPDATED->message('Pengguna'));
            return to_route('admin.users.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.users.index');
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->delete_file($user, 'avatar');

            $user->delete();

            flashMessage(MessageType::DELETED->message('Pengguna'));

            return to_route('admin.users.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.users.index');
        }
    }
}
