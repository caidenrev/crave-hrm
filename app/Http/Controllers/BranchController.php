<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $branches = Branch::withCount('employees')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get();

        $stats = [
            'total' => $branches->count(),
            'active' => $branches->where('is_active', true)->count(),
            'inactive' => $branches->where('is_active', false)->count(),
            'with_geofence' => $branches->whereNotNull('latitude')->whereNotNull('longitude')->count(),
        ];

        return Inertia::render('Organization/Branches', [
            'branches' => $branches,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:1000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius_meters' => 'required|integer|min:10|max:5000',
            'office_ips' => 'nullable|array',
            'office_ips.*' => 'nullable|string|max:45',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        
        // Clean empty IPs
        if (!empty($validated['office_ips'])) {
            $validated['office_ips'] = array_values(array_filter(array_map('trim', $validated['office_ips'])));
        }

        Branch::create($validated);

        return back()->with('success', 'Kantor cabang dan parameter geofence berhasil ditambahkan.');
    }

    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:1000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius_meters' => 'required|integer|min:10|max:5000',
            'office_ips' => 'nullable|array',
            'office_ips.*' => 'nullable|string|max:45',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active');

        // Clean empty IPs
        if (isset($validated['office_ips'])) {
            $validated['office_ips'] = array_values(array_filter(array_map('trim', $validated['office_ips'])));
        }

        $branch->update($validated);

        return back()->with('success', 'Data cabang dan konfigurasi geofence berhasil diperbarui.');
    }

    public function toggleActive(Branch $branch)
    {
        $branch->update([
            'is_active' => !$branch->is_active,
        ]);

        $status = $branch->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Status cabang berhasil {$status}.");
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();

        return back()->with('success', 'Kantor cabang berhasil dihapus.');
    }
}
