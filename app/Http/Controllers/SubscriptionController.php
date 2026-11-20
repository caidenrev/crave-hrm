<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPlan;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Display Company Subscription status and renewal options (For HR Admin).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeCompanyId = session('active_company_id');
        $company = $activeCompanyId
            ? Company::find($activeCompanyId)
            : $user?->currentCompany();

        if (!$company) {
            $company = Company::where('is_active', true)->first();
        }

        // Mock payment handler for local/testing convenience
        if ($mockOrderId = $request->query('mock_payment')) {
            $invoice = SubscriptionInvoice::where('order_id', $mockOrderId)->first();
            if ($invoice && !$invoice->isPaid()) {
                MidtransService::handleNotification([
                    'order_id' => $invoice->order_id,
                    'transaction_status' => 'settlement',
                    'gross_amount' => $invoice->amount,
                    'payment_type' => 'qris_simulation',
                ]);
                return redirect()->route('subscription.index')->with('success', 'Pembayaran langganan simulasi berhasil diselesaikan!');
            }
        }

        $plans = SubscriptionPlan::where('is_active', true)->orderBy('months')->get();

        $invoices = SubscriptionInvoice::where('company_id', $company->id)
            ->latest()
            ->take(10)
            ->get();

        $midtransClientKey = config('midtrans.client_key');
        $snapJsUrl = config('midtrans.snap_js');

        return Inertia::render('Subscription/Index', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'state' => $company->subscriptionState(),
                'days_left' => $company->daysLeft(),
                'trial_ends_at' => $company->trial_ends_at?->format('d M Y'),
                'current_period_end' => $company->current_period_end?->format('d M Y'),
                'plan_name' => $company->plan_name ?? 'Pro HR',
                'can_access' => $company->canAccessHrm(),
            ],
            'plans' => $plans,
            'invoices' => $invoices,
            'midtrans' => [
                'client_key' => $midtransClientKey,
                'snap_js' => $snapJsUrl,
                'is_demo' => str_contains(config('midtrans.server_key'), 'demo-key'),
            ],
        ]);
    }

    /**
     * Create Checkout Invoice & generate Midtrans Snap Token.
     */
    public function checkout(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'months' => ['required', 'integer', 'in:1,6,12'],
        ]);

        $user = $request->user();
        $activeCompanyId = session('active_company_id');
        $company = $activeCompanyId
            ? Company::find($activeCompanyId)
            : $user?->currentCompany();

        if (!$company) {
            return response()->json(['error' => 'Perusahaan tidak ditemukan'], 404);
        }

        $plan = SubscriptionPlan::where('months', $validated['months'])->first();
        if (!$plan) {
            return response()->json(['error' => 'Paket langganan tidak ditemukan'], 404);
        }

        // Cancel previous pending invoices for this company
        SubscriptionInvoice::where('company_id', $company->id)
            ->where('status', 'pending')
            ->update(['status' => 'cancelled']);

        $orderId = 'CRV-HRM-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -6));

        $invoice = SubscriptionInvoice::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'order_id' => $orderId,
            'plan_name' => $plan->label,
            'months' => $plan->months,
            'amount' => $plan->price,
            'status' => 'pending',
            'source' => 'midtrans',
        ]);

        $snap = MidtransService::createSnapTransaction($invoice, $user, $company);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'order_id' => $invoice->order_id,
                'snap_token' => $snap['token'],
                'redirect_url' => $snap['redirect_url'],
            ]);
        }

        return redirect($snap['redirect_url']);
    }

    /**
     * Midtrans IPN Webhook Endpoint.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        $invoice = MidtransService::handleNotification($payload);

        return response()->json([
            'status' => 'success',
            'order_id' => $invoice?->order_id,
        ]);
    }

    /**
     * Suspended company block screen.
     */
    public function suspended(): Response
    {
        $user = request()->user();
        $activeCompanyId = session('active_company_id');
        $company = $activeCompanyId ? Company::find($activeCompanyId) : $user?->currentCompany();

        return Inertia::render('Subscription/Suspended', [
            'company' => [
                'name' => $company?->name ?? 'Perusahaan Anda',
                'suspended_at' => $company?->suspended_at?->format('d M Y H:i'),
                'suspended_reason' => $company?->suspended_reason ?? 'Akses ditangguhkan oleh Administrator SaaS.',
            ],
        ]);
    }
}
