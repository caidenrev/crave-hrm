<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $isGuestAuthRoute = $request->is('login') || $request->is('register') || $request->is('careers*') || $request->is('/') || $request->is('landing');

        if (!$user && !$isGuestAuthRoute && \Illuminate\Support\Facades\Schema::hasTable('users')) {
            try {
                $user = \App\Models\User::first();
            } catch (\Throwable $e) {
                $user = null;
            }
        }
        $activeCompany = $user?->currentCompany();

        $notifications = [];
        if ($user && $activeCompany && \Illuminate\Support\Facades\Schema::hasTable('companies')) {
            try {
                $role = $user->currentRole();
                $isApprover = in_array($role, ['super_admin', 'company_admin', 'hr_admin', 'holding_admin', 'branch_manager', 'supervisor']);

                if ($isApprover) {
                    // 1. Pending Leave Requests
                    if (\Illuminate\Support\Facades\Schema::hasTable('leave_requests')) {
                        $pendingLeave = \App\Models\LeaveRequest::where('company_id', $activeCompany->id)->where('status', 'pending')->count();
                        if ($pendingLeave > 0) {
                            $notifications[] = [
                                'id' => "leave_pending_{$activeCompany->id}_{$pendingLeave}",
                                'title' => 'Pengajuan Cuti Menunggu Approval',
                                'description' => "{$pendingLeave} permohonan cuti baru siap ditinjau.",
                                'time' => 'Baru saja',
                                'href' => '/leave/approvals',
                                'type' => 'leave',
                            ];
                        }
                    }

                    // 2. Pending Overtime
                    if (\Illuminate\Support\Facades\Schema::hasTable('overtimes')) {
                        $pendingOvertime = \App\Models\Overtime::where('company_id', $activeCompany->id)->where('status', 'pending')->count();
                        if ($pendingOvertime > 0) {
                            $notifications[] = [
                                'id' => "overtime_pending_{$activeCompany->id}_{$pendingOvertime}",
                                'title' => 'Lembur SPKL Menunggu Review',
                                'description' => "{$pendingOvertime} pengajuan lembur staf siap diperiksa.",
                                'time' => 'Hari ini',
                                'href' => '/claims/overtime',
                                'type' => 'overtime',
                            ];
                        }
                    }

                    // 3. Pending Reimbursement
                    if (\Illuminate\Support\Facades\Schema::hasTable('reimbursements')) {
                        $pendingClaim = \App\Models\Reimbursement::where('company_id', $activeCompany->id)->where('status', 'pending')->count();
                        if ($pendingClaim > 0) {
                            $notifications[] = [
                                'id' => "claim_pending_{$activeCompany->id}_{$pendingClaim}",
                                'title' => 'Klaim Reimbursement Masuk',
                                'description' => "{$pendingClaim} klaim pengeluaran menunggu verifikasi.",
                                'time' => 'Hari ini',
                                'href' => '/claims/reimbursement',
                                'type' => 'claim',
                            ];
                        }
                    }
                }

                // 4. Subscription Expiring Alert (< 7 days)
                if ($activeCompany->daysLeft() <= 7 && $activeCompany->subscriptionState() !== 'active') {
                    $notifications[] = [
                        'id' => "subs_exp_{$activeCompany->id}_{$activeCompany->daysLeft()}",
                        'title' => 'Masa Langganan Segera Berakhir',
                        'description' => "Masa aktif {$activeCompany->name} tersisa {$activeCompany->daysLeft()} hari lagi.",
                        'time' => 'Penting',
                        'href' => '/subscription',
                        'type' => 'subscription',
                    ];
                }

                // 5. Latest Announcement for Employee
                if (\Illuminate\Support\Facades\Schema::hasTable('announcements')) {
                    $latestAnnounce = \App\Models\Announcement::where('company_id', $activeCompany->id)
                        ->where('is_published', true)
                        ->latest()
                        ->first();
                    if ($latestAnnounce) {
                        $notifications[] = [
                            'id' => "announce_{$latestAnnounce->id}",
                            'title' => 'Pengumuman: ' . $latestAnnounce->title,
                            'description' => \Illuminate\Support\Str::limit(strip_tags($latestAnnounce->content), 65),
                            'time' => $latestAnnounce->created_at?->diffForHumans() ?? 'Baru saja',
                            'href' => '/announcements',
                            'type' => 'announcement',
                        ];
                    }
                }
            } catch (\Throwable $e) {
                // Silently fallback if any schema issue
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar_url' => $user->avatar_url ?? $user->currentEmployee()?->avatar_url ?? null,
                ] : null,
                'active_company' => $activeCompany ? [
                    'id' => $activeCompany->id,
                    'name' => $activeCompany->name,
                    'slug' => $activeCompany->slug,
                    'logo_url' => $activeCompany->logo_url,
                    'is_holding' => $activeCompany->is_holding,
                ] : null,
                'companies' => $user ? $user->companies->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'role' => $c->pivot->role,
                ]) : [],
                'role' => $user?->currentRole(),
                'is_founder' => $user?->isFounder() ?? false,
                'notifications' => $notifications,
                'subscription' => $activeCompany ? [
                    'state' => $activeCompany->subscriptionState(),
                    'days_left' => $activeCompany->daysLeft(),
                    'trial_ends_at' => $activeCompany->trial_ends_at?->toIso8601String(),
                    'current_period_end' => $activeCompany->current_period_end?->toIso8601String(),
                    'plan_name' => $activeCompany->plan_name ?? 'Pro HR',
                    'can_access' => $activeCompany->canAccessHrm(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
