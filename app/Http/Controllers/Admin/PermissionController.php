<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PermissionRequest;
use App\Http\Resources\Admin\PermissionResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Throwable;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::query()
            ->select(['id', 'name', 'guard_name', 'created_at'])
            ->when(request()->search, function ($query, $search) {
                $query->whereAny([
                    'name',
                    'guard_name'
                ], 'REGEXP', $search);
            })
            ->when(request()->field && request()->direction, fn($query) => $query->orderBy(request()->field, request()->direction))
            ->paginate(request()->load ?? 10)
            ->withQueryString();

        return inertia('Admin/Permissions/Index', [
            'page_setting' => [
                'title' => 'Izin',
                'subtitle' => 'Menampilkan semua data izin yang tersedia pada platform ini',
            ],
            'permissions' => PermissionResource::collection($permissions)->additional([
                'meta' => [
                    'has_pages' => $permissions->hasPages()
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ]
        ]);
    }

    public function create()
    {
        return inertia('Admin/Permissions/Create', [
            'page_setting' => [
                'title' => 'Tambah Izin',
                'subtitle' => 'Buat izin baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.permissions.store'),
            ]
        ]);
    }

    public function store(PermissionRequest $request)
    {
        try {
            Permission::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);

            flashMessage(MessageType::CREATED->message('Izin'));
            return to_route('admin.permissions.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.permissions.index');
        }
    }

    public function edit(Permission $permission)
    {
        return inertia('Admin/Permissions/Edit', [
            'page_setting' => [
                'title' => 'Edit Permission',
                'subtitle' => 'Edit izin baru disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.permissions.update', $permission),
            ],
            'role' => $permission
        ]);
    }

    public function update(Permission $permission, PermissionRequest $request)
    {
        try {
            $permission->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);

            flashMessage(MessageType::UPDATED->message('izin'));
            return to_route('admin.permissions.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.permissions.index');
        }
    }

    public function destroy(Permission $permission)
    {
        try {

            $permission->delete();

            flashMessage(MessageType::DELETED->message('izin'));

            return to_route('admin.permissions.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.permissions.index');
        }
    }
}
