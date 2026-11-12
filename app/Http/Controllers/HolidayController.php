<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    public function index(Request $request)
    {
        $selectedYear = (int) ($request->input('year', 2026));

        $holidays = Holiday::forActiveCompany()
            ->whereYear('date', $selectedYear)
            ->orderBy('date')
            ->get();

        $stats = [
            'total' => $holidays->count(),
            'national' => $holidays->where('type', 'national')->count(),
            'collective' => $holidays->where('type', 'collective_leave')->count(),
            'company' => $holidays->where('type', 'company_holiday')->count(),
        ];

        return Inertia::render('Calendar/HolidayCalendar', [
            'holidays' => $holidays,
            'selectedYear' => $selectedYear,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:national,collective_leave,company_holiday',
            'description' => 'nullable|string|max:500',
        ]);

        // Internal holidays are scoped to active company
        $validated['company_id'] = session('active_company_id');

        Holiday::create($validated);

        return back()->with('success', 'Hari libur berhasil ditambahkan ke kalender.');
    }

    public function destroy(Holiday $holiday)
    {
        // Only allow deleting company-specific holidays or if tenant owns it
        if ($holiday->company_id !== null && $holiday->company_id !== session('active_company_id')) {
            abort(403, 'Anda tidak memiliki hak akses untuk menghapus jadwal libur ini.');
        }

        $holiday->delete();

        return back()->with('success', 'Hari libur berhasil dihapus.');
    }
}
