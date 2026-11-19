<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Tampilkan formulir pengaturan profil akun.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Resolusi perusahaan aktif
        $activeCompany = $user->currentCompany();
        $companyUserPivot = $activeCompany
            ? $user->companies()->where('companies.id', $activeCompany->id)->first()?->pivot
            : null;
        $userRole = $companyUserPivot?->role ?? 'holding_admin';

        // Resolusi data master karyawan terkait
        $employee = $user->currentEmployee() ?? $user->employees()->first();
        if ($employee) {
            $employee->loadMissing(['department', 'designation', 'branch', 'company']);
        }

        // Resolusi informasi sesi perangkat saat ini
        $userAgent = $request->userAgent() ?? 'Perangkat Browser';
        $clientIp = $request->ip() ?? '127.0.0.1';
        $browserName = 'Web Browser';
        if (str_contains($userAgent, 'Chrome') && !str_contains($userAgent, 'Edg')) {
            $browserName = 'Google Chrome';
        } elseif (str_contains($userAgent, 'Edg')) {
            $browserName = 'Microsoft Edge';
        } elseif (str_contains($userAgent, 'Firefox')) {
            $browserName = 'Mozilla Firefox';
        } elseif (str_contains($userAgent, 'Safari') && !str_contains($userAgent, 'Chrome')) {
            $browserName = 'Apple Safari';
        }

        $platformName = 'Desktop';
        if (str_contains($userAgent, 'Windows')) {
            $platformName = 'Windows Desktop';
        } elseif (str_contains($userAgent, 'Macintosh') || str_contains($userAgent, 'Mac OS')) {
            $platformName = 'Apple macOS';
        } elseif (str_contains($userAgent, 'Android')) {
            $platformName = 'Android Mobile';
        } elseif (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) {
            $platformName = 'Apple iOS';
        } elseif (str_contains($userAgent, 'Linux')) {
            $platformName = 'Linux Desktop';
        }

        $sessions = [
            [
                'id' => session()->getId(),
                'ip_address' => $clientIp,
                'browser' => $browserName,
                'platform' => $platformName,
                'is_current' => true,
                'last_active' => Carbon::now()->diffForHumans(),
            ],
        ];

        // Format role bahasa Indonesia
        $roleLabels = [
            'holding_admin' => 'Holding Executive Admin',
            'company_admin' => 'Company Admin',
            'hr_admin' => 'Human Resource Admin',
            'manager' => 'Operational Manager',
            'finance' => 'Finance & Payroll Admin',
            'employee' => 'Karyawan',
        ];

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url ?? $employee?->avatar_url,
                'role' => $userRole,
                'role_label' => $roleLabels[$userRole] ?? ucfirst(str_replace('_', ' ', $userRole)),
                'company_name' => $activeCompany?->name ?? 'Crave Global Group',
                'created_at' => $user->created_at ? $user->created_at->format('d M Y') : 'Nov 2026',
            ],
            'employee' => $employee ? [
                'id' => $employee->id,
                'nik' => $employee->nik,
                'nama_lengkap' => $employee->nama_lengkap,
                'email' => $employee->email,
                'nomor_telepon' => $employee->nomor_telepon,
                'avatar_url' => $employee->avatar_url ?? $user->avatar_url,
                'status_kerja' => $employee->status_kerja ?? 'PKWTT (Tetap)',
                'ptkp_status' => $employee->ptkp_status ?? 'TK/0',
                'bank_name' => $employee->bank_name ?? 'BCA',
                'bank_account_number' => $employee->bank_account_number,
                'tanggal_masuk' => $employee->tanggal_masuk ? Carbon::parse($employee->tanggal_masuk)->format('d M Y') : '-',
                'department_name' => $employee->department?->name ?? 'Headquarter Management',
                'designation_name' => $employee->designation?->name ?? 'Executive',
                'branch_name' => $employee->branch?->name ?? 'Kantor Pusat Crave Group',
            ] : null,
            'sessions' => $sessions,
        ]);
    }

    /**
     * Perbarui data profil pengguna dan karyawan terkait.
     */
    public function update(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nomor_telepon' => ['nullable', 'string', 'max:30'],
            'avatar_url' => ['nullable', 'string', 'max:255'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap tidak boleh melebihi 255 karakter.',
            'nomor_telepon.max' => 'Nomor telepon tidak boleh melebihi 30 karakter.',
        ]);

        $user->name = $validated['name'];
        if (isset($validated['avatar_url'])) {
            $user->avatar_url = $validated['avatar_url'];
        }
        $user->save();

        $employee = $user->currentEmployee() ?? $user->employees()->first();
        if ($employee) {
            $employee->nama_lengkap = $validated['name'];
            if (isset($validated['nomor_telepon'])) {
                $employee->nomor_telepon = $validated['nomor_telepon'];
            }
            if (isset($validated['avatar_url'])) {
                $employee->avatar_url = $validated['avatar_url'];
            }
            $employee->save();
        }

        return back()->with('success', 'Profil akun berhasil diperbarui dengan sukses.');
    }

    /**
     * Perbarui kata sandi akun pengguna.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
        ], [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok dengan data kami.',
            'new_password.required' => 'Kata sandi baru wajib diisi.',
            'new_password.min' => 'Kata sandi baru minimal 8 karakter.',
            'new_password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
            'new_password.different' => 'Kata sandi baru harus berbeda dari kata sandi saat ini.',
        ]);

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return back()->with('success', 'Kata sandi akun Anda berhasil diperbarui.');
    }

    /**
     * Putuskan sesi login di seluruh perangkat lain.
     */
    public function destroyOtherSessions(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.required' => 'Kata sandi konfirmasi wajib diisi.',
            'password.current_password' => 'Kata sandi konfirmasi salah.',
        ]);

        Auth::logoutOtherDevices($validated['password']);

        return back()->with('success', 'Seluruh sesi di perangkat lain telah berhasil dihentikan.');
    }
}
