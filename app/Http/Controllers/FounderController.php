<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Employee;
use App\Models\SalesLead;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FounderController extends Controller
{
    /**
     * Founder Dashboard Overview (Ringkasan SaaS).
     */
    public function index(Request $request): Response
    {
        $days = (int) $request->query('days', 30);
        $days = max(7, min($days, 365));
        $fromDate = now()->subDays($days)->startOfDay();

        $companies = Company::where('is_holding', false)->get();

        $kpi = [
            'total_companies' => $companies->count(),
            'active' => $companies->filter(fn ($c) => $c->subscriptionState() === 'active')->count(),
            'trial' => $companies->filter(fn ($c) => $c->subscriptionState() === 'trial')->count(),
            'grace' => $companies->filter(fn ($c) => $c->subscriptionState() === 'grace')->count(),
            'expired' => $companies->filter(fn ($c) => $c->subscriptionState() === 'expired')->count(),
            'suspended' => $companies->filter(fn ($c) => $c->subscriptionState() === 'suspended')->count(),
            'total_employees' => Employee::count(),
            'total_users' => User::count(),
            'signups_period' => Company::where('is_holding', false)->where('created_at', '>=', $fromDate)->count(),
            'new_leads' => SalesLead::where('status', 'new')->count(),
            'total_leads' => SalesLead::count(),
        ];

        // Revenue calculations
        $paidInvoices = SubscriptionInvoice::where('status', 'paid')->get();
        $revenueTotal = (int) $paidInvoices->sum('amount');
        $revenuePeriod = (int) $paidInvoices->where('paid_at', '>=', $fromDate)->sum('amount');

        $previousFromDate = now()->subDays($days * 2)->startOfDay();
        $revenuePrevious = (int) $paidInvoices
            ->where('paid_at', '>=', $previousFromDate)
            ->where('paid_at', '<', $fromDate)
            ->sum('amount');

        $payingCompaniesCount = Company::where('is_holding', false)
            ->whereHas('subscriptionInvoices', fn ($q) => $q->where('status', 'paid'))
            ->count();

        $conversionRate = $companies->count() > 0
            ? round(($payingCompaniesCount / $companies->count()) * 100, 1)
            : 0;

        $attendanceToday = Attendance::whereDate('date', today())->count();
        $activitiesToday = $companies->where('created_at', '>=', today()->startOfDay())->count()
            + $paidInvoices->where('paid_at', '>=', today()->startOfDay())->count()
            + $attendanceToday;

        $subscriptionDistribution = [
            [
                'name' => 'Tidak aktif',
                'value' => max(0, $companies->filter(fn ($c) => in_array($c->subscriptionState(), ['expired', 'suspended']))->count()),
                'color' => '#e11d48',
            ],
            [
                'name' => 'Berbayar',
                'value' => $companies->filter(fn ($c) => $c->subscriptionState() === 'active')->count(),
                'color' => '#10b981',
            ],
            [
                'name' => 'Trial',
                'value' => $companies->filter(fn ($c) => $c->subscriptionState() === 'trial')->count(),
                'color' => '#3b82f6',
            ],
        ];

        // Estimate MRR (Monthly Recurring Revenue)
        $mrr = 0;
        foreach ($companies as $c) {
            if (in_array($c->subscriptionState(), ['active', 'grace'])) {
                $lastPaid = $c->subscriptionInvoices()->where('status', 'paid')->latest('paid_at')->first();
                if ($lastPaid && $lastPaid->months > 0) {
                    $mrr += (int) round($lastPaid->amount / $lastPaid->months);
                } else {
                    $mrr += 299000; // Standard base plan estimate
                }
            }
        }

        // Daily Signups trend (last 30 days)
        $daily = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $daily[] = [
                'date' => $date,
                'signups' => Company::where('is_holding', false)
                    ->whereDate('created_at', $date)
                    ->count(),
                'revenue' => (int) SubscriptionInvoice::where('status', 'paid')
                    ->whereDate('paid_at', $date)
                    ->sum('amount'),
            ];
        }

        // Companies expiring within 7 days (trial or paid)
        $expiring = $companies->filter(function ($c) {
            $state = $c->subscriptionState();
            if (!in_array($state, ['trial', 'active', 'grace'])) {
                return false;
            }
            $endsAt = $c->current_period_end ?? $c->trial_ends_at;
            if (!$endsAt) {
                return false;
            }
            return $endsAt->isFuture() && $endsAt->diffInDays(now()) <= 7;
        })->map(function ($c) {
            $hrUser = $c->users()->wherePivotIn('role', ['company_admin', 'hr_admin'])->first();
            return [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email ?? $hrUser?->email,
                'hr_name' => $hrUser?->name ?? 'Admin HR',
                'state' => $c->subscriptionState(),
                'days_left' => $c->daysLeft(),
                'ends_at' => ($c->current_period_end ?? $c->trial_ends_at)?->format('d M Y'),
                'total_employees' => $c->employees()->count(),
            ];
        })->values()->take(10);

        // Recent live activities feed
        $feed = [];
        $recentSignups = Company::where('is_holding', false)->latest()->take(6)->get();
        foreach ($recentSignups as $rs) {
            $feed[] = [
                'type' => 'signup',
                'at' => $rs->created_at?->toIso8601String(),
                'who' => $rs->name,
                'detail' => 'Pendaftaran perusahaan baru',
                'amount' => null,
            ];
        }
        $recentPayments = SubscriptionInvoice::where('status', 'paid')->latest('paid_at')->take(6)->get();
        foreach ($recentPayments as $rp) {
            $feed[] = [
                'type' => 'payment',
                'at' => $rp->paid_at?->toIso8601String(),
                'who' => $rp->company?->name ?? 'Perusahaan',
                'detail' => "Paket {$rp->months} Bulan ({$rp->source})",
                'amount' => $rp->amount,
            ];
        }

        $recentLeads = SalesLead::latest()->take(6)->get();
        foreach ($recentLeads as $rl) {
            $feed[] = [
                'type' => 'lead',
                'at' => $rl->created_at?->toIso8601String(),
                'who' => "{$rl->name} ({$rl->company_name})",
                'detail' => "Permintaan Sales ({$rl->employee_count} Staf)",
                'amount' => null,
            ];
        }

        usort($feed, fn ($a, $b) => strcmp($b['at'], $a['at']));

        return Inertia::render('Founder/Index', [
            'days' => $days,
            'kpi' => [
                ...$kpi,
                'mrr' => $mrr,
                'annual_mrr' => $mrr * 12,
                'revenue_total' => $revenueTotal,
                'revenue_period' => $revenuePeriod,
                'revenue_previous' => $revenuePrevious,
                'paying_companies_count' => $payingCompaniesCount,
                'conversion_rate' => $conversionRate,
                'attendance_today' => $attendanceToday,
                'activities_today' => $activitiesToday,
                'server_time' => now()->format('H:i:s'),
                'subscription_distribution' => $subscriptionDistribution,
            ],
            'daily' => $daily,
            'expiring' => $expiring,
            'feed' => array_slice($feed, 0, 15),
        ]);
    }

    /**
     * Companies & HR Admins Management (Daftar Perusahaan & Kontrol Langganan).
     */
    public function companies(Request $request): Response
    {
        $search = $request->query('q');
        $filter = $request->query('filter', 'all'); // all, active, trial, inactive

        $query = Company::where('is_holding', false)
            ->with(['users', 'employees', 'subscriptionInvoices'])
            ->withCount('employees');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('users', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $allCompanies = $query->latest()->get();

        $rows = $allCompanies->map(function ($c) {
            $hrAdmin = $c->users->first(fn ($u) => in_array($u->pivot->role, ['company_admin', 'hr_admin']))
                ?? $c->users->first();

            $state = $c->subscriptionState();
            $endsAt = $c->current_period_end ?? $c->trial_ends_at;

            return [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'email' => $c->email ?? $hrAdmin?->email ?? '-',
                'phone' => $c->phone ?? '-',
                'hr_name' => $hrAdmin?->name ?? 'Admin HR',
                'hr_email' => $hrAdmin?->email ?? $c->email,
                'state' => $state,
                'days_left' => $c->daysLeft(),
                'trial_ends_at' => $c->trial_ends_at?->format('d M Y'),
                'current_period_end' => $c->current_period_end?->format('d M Y'),
                'ends_at' => $endsAt?->format('d M Y'),
                'plan_name' => $c->plan_name ?? 'Pro HR',
                'employees_count' => $c->employees_count,
                'max_employees' => $c->max_employees ?? 50,
                'registered_at' => $c->created_at?->format('d M Y'),
                'founder_note' => $c->founder_note,
                'suspended_at' => $c->suspended_at?->format('d M Y H:i'),
                'suspended_reason' => $c->suspended_reason,
                'total_paid' => (int) $c->subscriptionInvoices->where('status', 'paid')->sum('amount'),
            ];
        });

        // Filter status matching
        if ($filter === 'active') {
            $rows = $rows->filter(fn ($r) => in_array($r['state'], ['active', 'grace']))->values();
        } elseif ($filter === 'trial') {
            $rows = $rows->filter(fn ($r) => $r['state'] === 'trial')->values();
        } elseif ($filter === 'inactive') {
            $rows = $rows->filter(fn ($r) => in_array($r['state'], ['suspended', 'expired']))->values();
        }

        $counts = [
            'all' => $allCompanies->count(),
            'active' => $allCompanies->filter(fn ($c) => in_array($c->subscriptionState(), ['active', 'grace']))->count(),
            'trial' => $allCompanies->filter(fn ($c) => $c->subscriptionState() === 'trial')->count(),
            'inactive' => $allCompanies->filter(fn ($c) => in_array($c->subscriptionState(), ['suspended', 'expired']))->count(),
        ];

        return Inertia::render('Founder/Companies', [
            'companies' => $rows,
            'counts' => $counts,
            'filters' => [
                'q' => $search ?? '',
                'filter' => $filter,
            ],
        ]);
    }

    /**
     * Update Subscription State (Suspend, Unsuspend, Extend Trial, Add Months, Note).
     */
    public function updateSubscription(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'in:suspend,unsuspend,extend_trial,add_months,set_note'],
            'value' => ['nullable', 'numeric'],
            'note' => ['nullable', 'string', 'max:1000'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $action = $validated['action'];
        $user = $request->user();

        if ($action === 'suspend') {
            $reason = $validated['reason'] ?? 'Ditangguhkan oleh Founder.';
            $company->update([
                'subscription_status' => 'suspended',
                'suspended_at' => now(),
                'suspended_reason' => $reason,
            ]);
            $message = "Perusahaan {$company->name} berhasil ditangguhkan (SUSPENDED). Akses ke modul HRM dinonaktifkan.";
        } elseif ($action === 'unsuspend') {
            $newStatus = ($company->current_period_end && $company->current_period_end->isFuture()) ? 'active' : 'trial';
            $company->update([
                'subscription_status' => $newStatus,
                'suspended_at' => null,
                'suspended_reason' => null,
            ]);
            $message = "Akun perusahaan {$company->name} berhasil diaktifkan kembali.";
        } elseif ($action === 'extend_trial') {
            $days = (int) ($validated['value'] ?? 7);
            $base = ($company->trial_ends_at && $company->trial_ends_at->isFuture())
                ? $company->trial_ends_at
                : now();
            $newTrialEnd = $base->copy()->addDays($days);

            $company->update([
                'trial_ends_at' => $newTrialEnd,
                'subscription_status' => 'trial',
                'suspended_at' => null,
            ]);
            $message = "Masa trial {$company->name} berhasil diperpanjang +{$days} hari (sampai {$newTrialEnd->format('d M Y')}).";
        } elseif ($action === 'add_months') {
            $months = (int) ($validated['value'] ?? 1);
            $plan = SubscriptionPlan::where('months', $months)->first();
            $price = $plan ? $plan->price : ($months * 299000);

            $start = ($company->current_period_end && $company->current_period_end->isFuture())
                ? $company->current_period_end
                : now();
            $end = $start->copy()->addMonths($months);

            // Record manual invoice
            $invoice = SubscriptionInvoice::create([
                'company_id' => $company->id,
                'user_id' => $user->id,
                'order_id' => 'CRV-MANUAL-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -6)),
                'plan_name' => $plan ? $plan->label : "Paket {$months} Bulan",
                'months' => $months,
                'amount' => $price,
                'status' => 'paid',
                'source' => 'manual',
                'payment_type' => 'manual',
                'period_start' => $start,
                'period_end' => $end,
                'paid_at' => now(),
                'notes' => 'Aktivasi manual oleh Founder: ' . ($validated['note'] ?? 'Voucher / Promosi Khusus'),
            ]);

            $company->update([
                'subscription_status' => 'active',
                'current_period_end' => $end,
                'plan_name' => $plan ? $plan->label : "Pro {$months} Bulan",
                'suspended_at' => null,
            ]);

            $message = "Masa aktif {$company->name} berhasil ditambah +{$months} bulan (aktif sampai {$end->format('d M Y')}).";
        }

        if (isset($validated['note'])) {
            $company->update(['founder_note' => $validated['note']]);
            if ($action === 'set_note') {
                $message = "Catatan khusus founder untuk {$company->name} berhasil disimpan.";
            }
        }

        return back()->with('success', $message ?? 'Perubahan langganan berhasil disimpan.');
    }

    /**
     * Invoices & Payment Logs (Tagihan Midtrans & Manual).
     */
    public function invoices(Request $request): Response
    {
        $search = $request->query('q');
        $status = $request->query('status', 'all');

        $query = SubscriptionInvoice::with(['company', 'user'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                    ->orWhereHas('company', fn ($cq) => $cq->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($uq) => $uq->where('email', 'like', "%{$search}%"));
            });
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $invoices = $query->paginate(20)->withQueryString();

        $allInvoices = SubscriptionInvoice::all();
        $stats = [
            'total_paid' => (int) $allInvoices->where('status', 'paid')->sum('amount'),
            'paid_count' => $allInvoices->where('status', 'paid')->count(),
            'midtrans_total' => (int) $allInvoices->where('status', 'paid')->where('source', 'midtrans')->sum('amount'),
            'midtrans_count' => $allInvoices->where('status', 'paid')->where('source', 'midtrans')->count(),
            'manual_total' => (int) $allInvoices->where('status', 'paid')->where('source', 'manual')->sum('amount'),
            'manual_count' => $allInvoices->where('status', 'paid')->where('source', 'manual')->count(),
            'pending_total' => (int) $allInvoices->where('status', 'pending')->sum('amount'),
            'pending_count' => $allInvoices->where('status', 'pending')->count(),
        ];

        return Inertia::render('Founder/Invoices', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => [
                'q' => $search ?? '',
                'status' => $status,
            ],
        ]);
    }

    /**
     * Sales Leads & Demo Requests Management.
     */
    public function leads(Request $request): Response
    {
        $search = $request->query('q');
        $status = $request->query('status', 'all');

        $query = SalesLead::latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('work_email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $leads = $query->paginate(20)->withQueryString();

        $leads->through(function ($lead) {
            return [
                'id' => $lead->id,
                'name' => $lead->name,
                'company_name' => $lead->company_name,
                'work_email' => $lead->work_email,
                'phone' => $lead->phone,
                'clean_phone' => $lead->cleanPhone(),
                'whatsapp_url' => $lead->whatsappUrl(),
                'employee_count' => $lead->employee_count,
                'notes' => $lead->notes,
                'status' => $lead->status,
                'status_label' => $lead->statusLabel(),
                'founder_notes' => $lead->founder_notes,
                'contacted_at' => $lead->contacted_at?->format('d M Y H:i'),
                'created_at' => $lead->created_at?->format('d M Y H:i'),
            ];
        });

        $allLeads = SalesLead::all();
        $stats = [
            'total' => $allLeads->count(),
            'new' => $allLeads->where('status', 'new')->count(),
            'contacted' => $allLeads->where('status', 'contacted')->count(),
            'demo_scheduled' => $allLeads->where('status', 'demo_scheduled')->count(),
            'converted' => $allLeads->where('status', 'converted')->count(),
        ];

        return Inertia::render('Founder/Leads', [
            'leads' => $leads,
            'stats' => $stats,
            'filters' => [
                'q' => $search ?? '',
                'status' => $status,
            ],
        ]);
    }

    /**
     * Update Sales Lead Status & Notes.
     */
    public function updateLead(Request $request, SalesLead $lead)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,contacted,demo_scheduled,converted,archived'],
            'founder_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $updates = [
            'status' => $validated['status'],
            'founder_notes' => $validated['founder_notes'] ?? $lead->founder_notes,
        ];

        if ($validated['status'] === 'contacted' && !$lead->contacted_at) {
            $updates['contacted_at'] = now();
        }

        $lead->update($updates);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Status prospek {$lead->name} ({$lead->company_name}) berhasil diperbarui.",
                'lead' => $lead->fresh(),
            ]);
        }

        return back()->with('success', "Status prospek {$lead->name} ({$lead->company_name}) berhasil diperbarui.");
    }

    /**
     * Delete / Archive Sales Lead.
     */
    public function destroyLead(SalesLead $lead)
    {
        $name = $lead->name;
        $lead->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Data prospek {$name} berhasil dihapus.",
            ]);
        }

        return back()->with('success', "Data prospek {$name} berhasil dihapus.");
    }

    /**
     * Settings (Paket Langganan & Midtrans Gateway Config).
     */
    public function settings(): Response
    {
        $plans = SubscriptionPlan::orderBy('months')->get();
        $midtransConfig = [
            'is_configured' => !empty(config('midtrans.server_key')) && !str_contains(config('midtrans.server_key'), 'demo-key'),
            'is_production' => (bool) config('midtrans.is_production'),
            'client_key' => config('midtrans.client_key'),
            'webhook_url' => url('/midtrans/webhook'),
        ];

        return Inertia::render('Founder/Settings', [
            'plans' => $plans,
            'midtrans' => $midtransConfig,
        ]);
    }

    /**
     * Update Subscription Plan Pricing.
     */
    public function updatePlan(Request $request, SubscriptionPlan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:1000'],
            'discount_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $plan->update($validated);

        return back()->with('success', "Harga paket {$plan->label} berhasil diperbarui.");
    }

    /**
     * Export Companies CSV.
     */
    public function exportCompanies(): StreamedResponse
    {
        $companies = Company::where('is_holding', false)
            ->with(['users', 'employees'])
            ->withCount('employees')
            ->latest()
            ->get();

        $filename = 'crave-companies-' . date('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($companies) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID',
                'Nama Perusahaan',
                'Nama HR Admin',
                'Email',
                'No Telepon',
                'Status Langganan',
                'Sisa Hari',
                'Trial Berakhir',
                'Masa Aktif Sampai',
                'Jumlah Karyawan',
                'Tanggal Daftar',
                'Catatan Founder',
            ]);

            foreach ($companies as $c) {
                $hrAdmin = $c->users->first(fn ($u) => in_array($u->pivot->role, ['company_admin', 'hr_admin']))
                    ?? $c->users->first();
                $endsAt = $c->current_period_end ?? $c->trial_ends_at;

                fputcsv($handle, [
                    $c->id,
                    $c->name,
                    $hrAdmin?->name ?? 'Admin HR',
                    $c->email ?? $hrAdmin?->email ?? '-',
                    $c->phone ?? '-',
                    strtoupper($c->subscriptionState()),
                    $c->daysLeft(),
                    $c->trial_ends_at?->format('Y-m-d') ?? '-',
                    $endsAt?->format('Y-m-d') ?? '-',
                    $c->employees_count,
                    $c->created_at?->format('Y-m-d') ?? '-',
                    $c->founder_note ?? '',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
