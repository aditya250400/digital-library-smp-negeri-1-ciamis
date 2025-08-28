<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementRequest;
use App\Http\Resources\Admin\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Throwable;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::query()
            ->select(['id', 'message', 'url', 'is_active', 'created_at'])
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Announcements/Index', [
            'page_setting' => [
                'title' => 'Pengumuman',
                'subtitle' => 'Menampilkan semua data penggumuman yang tersedia pada platform ini'
            ],
            'announcements' => AnnouncementResource::collection($announcements)->additional([
                'meta' => [
                    'has_pages' => $announcements->hasPages(),
                ]
            ]),
        ]);
    }

    public function create()
    {

        return inertia('Admin/Announcements/Create', [
            'page_setting' => [
                'title' => 'Tambah Pengumuman',
                'subtitle' => 'Buat pengumuman baru disini',
                'method' => 'POST',
                'action' => route('admin.announcements.store'),
            ]
        ]);
    }

    public function store(AnnouncementRequest $request)
    {
        try {
            if ($request->is_active) {
                Announcement::where('is_active', true)->update(['is_active' => false]);
            }

            Announcement::create([
                'message' => $request->message,
                'url' => $request->url,
                'is_active' => $request->is_active,
            ]);

            flashMessage(MessageType::CREATED->message('Pengumuman'));

            return to_route('admin.announcements.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.announcements.index');
        }
    }

    public function edit(Announcement $announcement)
    {

        return inertia('Admin/Announcements/Edit', [
            'page_setting' => [
                'title' => 'Edit Pengumuman',
                'subtitle' => 'Edit pengumuman baru disini',
                'method' => 'PUT',
                'action' => route('admin.announcements.update', $announcement),
            ],
            'announcement' => $announcement,
        ]);
    }

    public function update(Announcement $announcement, AnnouncementRequest $request)
    {
        try {
            if ($request->is_active) {
                Announcement::where('is_active', true)
                    ->where('id', '!=', $announcement->id)
                    ->update(['is_active' => false]);
            }

            $announcement->update([
                'message' => $request->message,
                'url' => $request->url,
                'is_active' => $request->is_active,
            ]);

            flashMessage(MessageType::UPDATED->message('Pengumuman'));

            return to_route('admin.announcements.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return back();
            // return to_route('admin.announcements.index');
        }
    }

    public function destroy(Announcement $announcement)
    {
        try {

            $announcement->delete();

            flashMessage(MessageType::DELETED->message('Pengumuman'));

            return to_route('admin.announcements.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.announcements.index');
        }
    }
}
