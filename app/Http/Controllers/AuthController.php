<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password as PasswordBroker;
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
                    'password' => 'password123',
                    'badge' => 'Holding',
                ],
                [
                    'name' => 'Siti Rahmawati',
                    'role' => 'HR Administrator',
                    'email' => 'siti.hr@craveservices.my.id',
                    'password' => 'password123',
                    'badge' => 'HR',
                ],
                [
                    'name' => 'Budi Prasetyo',
                    'role' => 'Finance & Payroll',
                    'email' => 'budi.finance@craveservices.my.id',
                    'password' => 'password123',
                    'badge' => 'Finance',
                ],
                [
                    'name' => 'Dewi Lestari',
                    'role' => 'Staff Karyawan (ESS)',
                    'email' => 'dewi.staff@craveservices.my.id',
                    'password' => 'password123',
                    'badge' => 'Employee',
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

    /**
     * Tampilkan halaman lupa kata sandi.
     */
    public function showForgotPassword()
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard');
        }

        $isLocal = app()->environment('local', 'testing') || in_array(request()->getHost(), ['localhost', '127.0.0.1']);

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'turnstileSiteKey' => $isLocal ? 'disabled' : env('TURNSTILE_SITE_KEY', '0x4AAAAAAGE_beCSvLpqhbkp'),
        ]);
    }

    /**
     * Kirim email berisi link token atur ulang kata sandi.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'cf_turnstile_response' => ['nullable', 'string'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        $turnstileError = $this->checkTurnstile($request);
        if ($turnstileError) {
            return $turnstileError;
        }

        // Rate limiter proteksi spam request
        $throttleKey = 'forgot-password:' . Str::lower($request->ip());
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'email' => "Terlalu banyak permintaan. Silakan tunggu {$seconds} detik sebelum mencoba kembali.",
            ]);
        }
        RateLimiter::hit($throttleKey, 60);

        $status = PasswordBroker::sendResetLink(
            $request->only('email')
        );

        if ($status === PasswordBroker::RESET_LINK_SENT) {
            return back()->with('status', 'Tautan atur ulang kata sandi telah dikirim ke alamat email Anda. Silakan periksa kotak masuk atau spam.');
        }

        if ($status === PasswordBroker::INVALID_USER) {
            return back()->withErrors(['email' => 'Alamat email tidak ditemukan dalam sistem Crave HRM.']);
        }

        return back()->withErrors(['email' => 'Gagal mengirimkan tautan atur ulang kata sandi. Silakan coba kembali beberapa saat lagi.']);
    }

    /**
     * Tampilkan form pembuatan kata sandi baru dari token email.
     */
    public function showResetPassword(Request $request, string $token)
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard');
        }

        $isLocal = app()->environment('local', 'testing') || in_array(request()->getHost(), ['localhost', '127.0.0.1']);

        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
            'turnstileSiteKey' => $isLocal ? 'disabled' : env('TURNSTILE_SITE_KEY', '0x4AAAAAAGE_beCSvLpqhbkp'),
        ]);
    }

    /**
     * Proses pembaruan kata sandi baru.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'cf_turnstile_response' => ['nullable', 'string'],
        ], [
            'token.required' => 'Token reset kata sandi tidak valid.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi minimal terdiri dari 8 karakter.',
        ]);

        $turnstileError = $this->checkTurnstile($request);
        if ($turnstileError) {
            return $turnstileError;
        }

        $status = PasswordBroker::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === PasswordBroker::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Kata sandi Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
        }

        if ($status === PasswordBroker::INVALID_TOKEN) {
            return back()->withErrors(['email' => 'Tautan atur ulang kata sandi tidak valid atau telah kedaluwarsa. Silakan ajukan permintaan baru.']);
        }

        return back()->withErrors(['email' => 'Gagal memperbarui kata sandi. Silakan periksa kembali data Anda.']);
    }

    /**
     * Validasi bot Cloudflare Turnstile pada environment produksi.
     */
    protected function checkTurnstile(Request $request): ?\Illuminate\Http\RedirectResponse
    {
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
                $response = Http::asForm()->timeout(5)->post(
                    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                    [
                        'secret' => $turnstileSecret,
                        'response' => $turnstileToken,
                        'remoteip' => $request->ip(),
                    ]
                );

                $result = $response->json();

                if (!($result['success'] ?? false)) {
                    Log::warning('[Turnstile] Bot verification failed', ['result' => $result]);
                    return back()->withErrors([
                        'cf_turnstile_response' => 'Verifikasi bot gagal. Silakan coba kembali.',
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('[Turnstile] Verification connection error: ' . $e->getMessage());
            }
        }

        return null;
    }
}

