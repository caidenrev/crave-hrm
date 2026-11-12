<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('author:id,name,email');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        $announcements = $query->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => Announcement::count(),
            'pinned' => Announcement::where('is_pinned', true)->count(),
            'urgent' => Announcement::where('priority', 'urgent')->count(),
            'policy' => Announcement::where('category', 'policy')->count(),
        ];

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'category', 'priority']),
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:general,policy,urgent,event',
            'priority' => 'required|in:normal,high,urgent',
            'is_pinned' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = $request->user()?->id;
        $validated['is_pinned'] = $request->boolean('is_pinned');

        Announcement::create($validated);

        return back()->with('success', 'Pengumuman baru berhasil diterbitkan.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:general,policy,urgent,event',
            'priority' => 'required|in:normal,high,urgent',
            'is_pinned' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['is_pinned'] = $request->boolean('is_pinned');

        $announcement->update($validated);

        return back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function togglePin(Announcement $announcement)
    {
        $announcement->update([
            'is_pinned' => !$announcement->is_pinned,
        ]);

        $status = $announcement->is_pinned ? 'disematkan ke atas' : 'dilepas dari sematan';
        return back()->with('success', "Pengumuman berhasil {$status}.");
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
