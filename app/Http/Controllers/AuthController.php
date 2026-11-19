<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard');
        }

        $isLocal = app()->environment('local', 'testing') || in_array(request()->getHost(), ['localhost', '127.0.0.1']);

        return Inertia::render('Auth/Login', [
            'status' => session('status'),
            'turnstileSiteKey' => $isLocal ? 'disabled' : env('TURNSTILE_SITE_KEY', '0x4AAAAAAGE_beCSvLpqhbkp'),
            'demoAccounts' => [
                [
                    'name' => 'Eka Revandi',
                    'role' => 'Super Admin (CEO)',
                    'email' => 'founder@craveservices.my.id',
                    'password' => '@Mukbsca22',
                    'badge' => 'Holding',
                ],
                [
                    'name' => 'Egi Witra Aditya',
                    'role' => 'Holding Admin (CPO)',
                    'email' => 'egi@craveservices.my.id',
                    'password' => 'password123',
                    'badge' => 'Product',
                ],
                [
                    'name' => 'Aufa',
                    'role' => 'Company Admin (VP Dev)',
                    'email' => 'aufa@craveservices.my.id',
                    'password' => 'password123',
                    'badge' => 'Engineering',
                ],
            ],
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'cf_turnstile_response' => ['nullable', 'string'],
        ]);

        // Verifikasi Cloudflare Turnstile hanya di environment produksi publik
        $isLocal = app()->environment('local', 'testing') || in_array($request->getHost(), ['localhost', '127.0.0.1']);
        $turnstileSecret = env('TURNSTILE_SECRET_KEY', '0x4AAAAAAGE_bfNXRoOw_fB7_MW9wsyXlRs');
        $turnstileToken = $request->input('cf_turnstile_response');

        if (!$isLocal && $turnstileSecret) {
            if (!$turnstileToken) {
                return back()->withErrors([
                    'cf_turnstile_response' => 'Silakan centang verifikasi Cloudflare Turnstile terlebih dahulu.',
                ]);
            }

            try {
                $response = \Illuminate\Support\Facades\Http::asForm()->timeout(5)->post(
                    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                    [
                        'secret' => $turnstileSecret,
                        'response' => $turnstileToken,
                        'remoteip' => $request->ip(),
                    ]
                );

                $result = $response->json();

                if (!($result['success'] ?? false)) {
                    \Illuminate\Support\Facades\Log::warning('[Turnstile] Bot verification failed', ['result' => $result]);
                    return back()->withErrors([
                        'cf_turnstile_response' => 'Verifikasi keamanan bot gagal. Silakan coba lagi.',
                    ]);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('[Turnstile] Verification error: ' . $e->getMessage());
            }
        }

        $authCredentials = [
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ];

        $throttleKey = Str::transliterate(Str::lower($request->input('email')) . '|' . $request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'email' => "Terlalu banyak percobaan gagal. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        if (Auth::attempt($authCredentials, $request->boolean('remember'))) {
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();
            $primaryCompany = $user->companies()->first();

            if ($primaryCompany) {
                session(['active_company_id' => $primaryCompany->id]);
            }

            return redirect()->intended('/dashboard')->with('success', "Selamat datang kembali, {$user->name}!");
        }

        RateLimiter::hit($throttleKey, 60);

        return back()->withErrors([
            'email' => 'Kombinasi email atau kata sandi tidak sesuai dengan catatan kami.',
        ]);
    }

    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard');
        }

        $isLocal = app()->environment('local', 'testing') || in_array(request()->getHost(), ['localhost', '127.0.0.1']);

        return Inertia::render('Auth/Register', [
            'turnstileSiteKey' => $isLocal ? 'disabled' : env('TURNSTILE_SITE_KEY', '0x4AAAAAAGE_beCSvLpqhbkp'),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'company_name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'cf_turnstile_response' => ['nullable', 'string'],
        ]);

        // Verifikasi Cloudflare Turnstile hanya di environment produksi publik
        $isLocal = app()->environment('local', 'testing') || in_array($request->getHost(), ['localhost', '127.0.0.1']);
        $turnstileSecret = env('TURNSTILE_SECRET_KEY', '0x4AAAAAAGE_bfNXRoOw_fB7_MW9wsyXlRs');
        $turnstileToken = $request->input('cf_turnstile_response');

        if (!$isLocal && $turnstileSecret) {
            if (!$turnstileToken) {
                return back()->withErrors([
                    'cf_turnstile_response' => 'Silakan centang verifikasi Cloudflare Turnstile terlebih dahulu.',
                ]);
            }

            try {
                $response = \Illuminate\Support\Facades\Http::asForm()->timeout(5)->post(
                    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                    [
                        'secret' => $turnstileSecret,
                        'response' => $turnstileToken,
                        'remoteip' => $request->ip(),
                    ]
                );

                $result = $response->json();

                if (!($result['success'] ?? false)) {
                    \Illuminate\Support\Facades\Log::warning('[Turnstile] Bot verification failed on register', ['result' => $result]);
                    return back()->withErrors([
                        'cf_turnstile_response' => 'Verifikasi keamanan bot gagal. Silakan coba lagi.',
                    ]);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('[Turnstile] Verification error on register: ' . $e->getMessage());
            }
        }

        $user = DB::transaction(function () use ($request) {
            $companySlug = Str::slug($request->company_name) . '-' . Str::lower(Str::random(4));

            $company = Company::create([
                'name' => $request->company_name,
                'slug' => $companySlug,
                'is_holding' => false,
                'email' => $request->email,
                'is_active' => true,
            ]);

            $branch = Branch::create([
                'company_id' => $company->id,
                'name' => 'Kantor Pusat (HQ)',
                'code' => 'HQ-' . strtoupper(Str::random(3)),
                'is_active' => true,
            ]);

            $dept = Department::create([
                'company_id' => $company->id,
                'name' => 'Executive Management',
                'code' => 'EXEC',
                'is_active' => true,
            ]);

            $designation = Designation::create([
                'company_id' => $company->id,
                'department_id' => $dept->id,
                'title' => 'Managing Director / Founder',
                'level' => 'Director',
            ]);

            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(),
            ]);

            $newUser->companies()->attach($company->id, [
                'role' => 'company_admin',
                'branch_id' => $branch->id,
                'is_primary' => true,
            ]);

            Employee::create([
                'company_id' => $company->id,
                'branch_id' => $branch->id,
                'department_id' => $dept->id,
                'designation_id' => $designation->id,
                'user_id' => $newUser->id,
                'nik' => 'EMP-001',
                'nama_lengkap' => $newUser->name,
                'email' => $newUser->email,
                'tanggal_masuk' => now()->toDateString(),
                'status_kerja' => 'PKWTT',
                'ptkp_status' => 'TK/0',
                'gaji_pokok' => 20000000,
                'is_active' => true,
            ]);

            return $newUser;
        });

        Auth::login($user);
        $request->session()->regenerate();

        $primaryCompany = $user->companies()->first();
        if ($primaryCompany) {
            session(['active_company_id' => $primaryCompany->id]);
        }

        return redirect('/dashboard')->with('success', "Akun perusahaan {$request->company_name} berhasil dibuat!");
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success', 'Anda telah berhasil keluar dari sistem Crave HRM.');
    }
}

