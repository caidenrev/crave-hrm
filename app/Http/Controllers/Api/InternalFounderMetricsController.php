<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Employee;
use App\Models\SalesLead;
use App\Models\SubscriptionInvoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InternalFounderMetricsController extends Controller
{
    /**
     * Provide comprehensive SaaS metrics for central Founder Console in Crave POS.
     */
    public function index(Request $request): JsonResponse
    {
        $days = (int) $request->query('days', 30);
        $days = max(7, min($days, 365));
        $fromDate = now()->subDays($days)->startOfDay();

        $companies = Company::where('is_holding', false)->with('subscriptionPlan')->get();

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

        // Revenue & Invoices
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

        // Calculate MRR
        $mrr = 0;
        foreach ($companies as $c) {
            if (in_array($c->subscriptionState(), ['active', 'grace'])) {
                $lastPaid = $c->subscriptionInvoices()->where('status', 'paid')->latest('paid_at')->first();
                if ($lastPaid && $lastPaid->months > 0) {
                    $mrr += (int) round($lastPaid->amount / $lastPaid->months);
                } else {
                    $mrr += 299000; // Standard starter plan monthly rate
                }
            }
        }

        // Daily series (for unified charts)
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
                'attendance' => Attendance::whereDate('date', $date)->count(),
            ];
        }

        // Expiring companies in next 7 days
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

        // Recent activity feed
        $feed = [];
        $recentSignups = Company::where('is_holding', false)->latest()->take(5)->get();
        foreach ($recentSignups as $rs) {
            $feed[] = [
                'type' => 'signup',
                'at' => $rs->created_at?->toIso8601String(),
                'who' => $rs->name,
                'detail' => 'Pendaftaran perusahaan baru',
                'amount' => null,
            ];
        }
        $recentPayments = SubscriptionInvoice::where('status', 'paid')->latest('paid_at')->take(5)->get();
        foreach ($recentPayments as $rp) {
            $feed[] = [
                'type' => 'payment',
                'at' => $rp->paid_at?->toIso8601String(),
                'who' => $rp->company?->name ?? 'Perusahaan',
                'detail' => "Paket {$rp->months} Bulan ({$rp->source})",
                'amount' => $rp->amount,
            ];
        }
        $recentLeads = SalesLead::latest()->take(5)->get();
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

        // Companies list (tenants)
        $companiesList = $companies->map(function ($c) {
            $hrUser = $c->users()->wherePivotIn('role', ['company_admin', 'hr_admin'])->first();
            $paidTotal = (int) $c->subscriptionInvoices()->where('status', 'paid')->sum('amount');
            $endsAt = $c->current_period_end ?? $c->trial_ends_at;

            return [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email ?? $hrUser?->email ?? '-',
                'plan_name' => $c->subscriptionPlan?->name ?? 'Free Trial',
                'state' => $c->subscriptionState(),
                'trial_ends_at' => $c->trial_ends_at?->toIso8601String(),
                'current_period_end' => $c->current_period_end?->toIso8601String(),
                'ends_at' => $endsAt?->toIso8601String(),
                'total_employees' => $c->employees()->count(),
                'paid_total' => $paidTotal,
                'registered_at' => $c->created_at?->toIso8601String(),
            ];
        })->values();

        // Invoices list
        $invoicesList = SubscriptionInvoice::with('company')->latest()->take(100)->get()->map(function ($inv) {
            return [
                'order_id' => $inv->order_id,
                'company_name' => $inv->company?->name ?? 'Perusahaan',
                'email' => $inv->company?->email ?? '-',
                'months' => $inv->months,
                'amount' => (int) $inv->amount,
                'status' => $inv->status,
                'source' => $inv->source,
                'payment_type' => $inv->payment_type,
                'created_at' => $inv->created_at?->toIso8601String(),
                'paid_at' => $inv->paid_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'product' => 'crave_hrm',
            'product_label' => 'Crave HRM',
            'timestamp' => now()->toIso8601String(),
            'kpi' => [
                'mrr' => $mrr,
                'annual_mrr' => $mrr * 12,
                'revenue_total' => $revenueTotal,
                'revenue_period' => $revenuePeriod,
                'revenue_previous' => $revenuePrevious,
                'paying_companies' => $payingCompaniesCount,
                'conversion_rate' => $conversionRate,
                'total_companies' => $kpi['total_companies'],
                'active_companies' => $kpi['active'],
                'trial_companies' => $kpi['trial'],
                'grace_companies' => $kpi['grace'],
                'expired_companies' => $kpi['expired'],
                'suspended_companies' => $kpi['suspended'],
                'total_employees' => $kpi['total_employees'],
                'total_users' => $kpi['total_users'],
                'attendance_today' => $attendanceToday,
                'new_leads' => $kpi['new_leads'],
                'total_leads' => $kpi['total_leads'],
                'signups_period' => $kpi['signups_period'],
            ],
            'daily' => $daily,
            'expiring' => $expiring,
            'feed' => array_slice($feed, 0, 15),
            'companies' => $companiesList,
            'invoices' => $invoicesList,
        ]);
    }
}
