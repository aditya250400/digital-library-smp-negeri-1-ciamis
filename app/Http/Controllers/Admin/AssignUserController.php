<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignUserRequest;
use App\Http\Resources\Admin\AssignUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Throwable;

class AssignUserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'username'])
            ->when(request()->search, function ($query, $search) {
                $query->whereAny(['name', 'email'], 'REGEXP', $search);
            })
            ->when(request()->field && request()->direction, fn($query) => $query->orderBy(request()->field, request()->direction))
            ->with('roles')
            ->paginate(request()->load ?? 10)
            ->withQueryString();

        return inertia('Admin/AssignUsers/Index', [
            'page_setting' => [
                'title' => 'Tetapkan Peran',
                'subtitle' => 'Menampilkan semua data tetapkan peran yang tersedia pada platform ini',
            ],
            'users' => AssignUserResource::collection($users)->additional([
                'meta' => [
                    'has_pages' => $users->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ]
        ]);
    }

    public function edit(User $user)
    {

        return inertia('Admin/AssignUsers/Edit', [
            'page_setting' => [
                'title' => 'Sinkronisasi Peran',
                'subtitle' => 'Sinkronisasi peran di sini. Kik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.assign-users.update', $user),
            ],
            'user' => $user->load('roles'),
            'roles' => Role::query()->select(['id', 'name'])->where('guard_name', 'web')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function update(User $user, AssignUserRequest $request)
    {
        try {
            $user->syncRoles($request->roles);

            flashMessage("Berhasil menyinkronkan peran ke pengguna {$user->name}");
            return to_route('admin.assign-users.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.roles.index');
        }
    }
}
