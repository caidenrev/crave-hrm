<?php

namespace App\Services;

use App\Models\Company;
use App\Models\SubscriptionInvoice;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    /**
     * Create Midtrans Snap Transaction Token and Redirect URL.
     */
    public static function createSnapTransaction(SubscriptionInvoice $invoice, User $user, Company $company): array
    {
        $serverKey = config('midtrans.server_key');
        $snapUrl = config('midtrans.snap_url');

        $params = [
            'transaction_details' => [
                'order_id' => $invoice->order_id,
                'gross_amount' => (int) $invoice->amount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
                'phone' => $company->phone ?? '081234567890',
            ],
            'item_details' => [
                [
                    'id' => "PLAN-{$invoice->months}M",
                    'price' => (int) $invoice->amount,
                    'quantity' => 1,
                    'name' => "Langganan Crave HRM: {$invoice->plan_name}",
                ],
            ],
            'callbacks' => [
                'finish' => route('subscription.index'),
            ],
        ];

        // If credentials are valid real keys, call Midtrans Snap API
        if ($serverKey && !str_contains($serverKey, 'demo-key')) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->timeout(8)->post($snapUrl, $params);

                if ($response->successful()) {
                    $data = $response->json();
                    $token = $data['token'] ?? null;
                    $redirectUrl = $data['redirect_url'] ?? null;

                    $invoice->update(['snap_token' => $token]);

                    return [
                        'token' => $token,
                        'redirect_url' => $redirectUrl,
                    ];
                }

                Log::warning('[Midtrans] Snap token generation returned error', ['body' => $response->body()]);
            } catch (\Throwable $e) {
                Log::error('[Midtrans] Exception calling Snap API: ' . $e->getMessage());
            }
        }

        // Demo / offline fallback simulation token
        $mockToken = 'SNAP-MOCK-' . strtoupper(substr(md5($invoice->order_id), 0, 16));
        $invoice->update(['snap_token' => $mockToken]);

        return [
            'token' => $mockToken,
            'redirect_url' => route('subscription.index') . '?mock_payment=' . $invoice->order_id,
        ];
    }

    /**
     * Verify Midtrans Signature Key SHA512.
     */
    public static function verifySignature(string $orderId, string $statusCode, string $grossAmount, string $signatureKey): bool
    {
        $serverKey = config('midtrans.server_key');
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return hash_equals($expectedSignature, $signatureKey);
    }

    /**
     * Process Midtrans Notification Webhook payload.
     */
    public static function handleNotification(array $payload): ?SubscriptionInvoice
    {
        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;
        $paymentType = $payload['payment_type'] ?? 'midtrans';
        $grossAmount = $payload['gross_amount'] ?? 0;
        $signatureKey = $payload['signature_key'] ?? '';
        $statusCode = $payload['status_code'] ?? '200';

        if (!$orderId) {
            return null;
        }

        $invoice = SubscriptionInvoice::where('order_id', $orderId)->first();
        if (!$invoice) {
            Log::warning("[Midtrans Webhook] Invoice not found for order_id: {$orderId}");
            return null;
        }

        // Verify signature if key is configured
        $serverKey = config('midtrans.server_key');
        if ($signatureKey && $serverKey && !str_contains($serverKey, 'demo-key')) {
            if (!self::verifySignature($orderId, $statusCode, (string) $grossAmount, $signatureKey)) {
                Log::error("[Midtrans Webhook] Invalid signature key for order_id: {$orderId}");
                return null;
            }
        }

        $isPaid = false;
        if ($transactionStatus === 'capture') {
            if ($fraudStatus === 'accept') {
                $isPaid = true;
            }
        } elseif ($transactionStatus === 'settlement') {
            $isPaid = true;
        }

        if ($isPaid) {
            if (!$invoice->isPaid()) {
                $company = $invoice->company;
                $start = now();
                if ($company->current_period_end && $company->current_period_end->isFuture()) {
                    $start = $company->current_period_end;
                }
                $end = $start->copy()->addMonths($invoice->months);

                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'payment_type' => $paymentType,
                    'payment_reference' => $payload['transaction_id'] ?? null,
                    'period_start' => $start,
                    'period_end' => $end,
                ]);

                $company->update([
                    'subscription_status' => 'active',
                    'current_period_end' => $end,
                    'plan_name' => $invoice->plan_name,
                ]);

                Log::info("[Midtrans Webhook] Invoice {$orderId} marked as PAID for company {$company->name} until {$end->toDateString()}");
            }
        } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            $invoice->update([
                'status' => $transactionStatus === 'expire' ? 'expired' : 'cancelled',
                'payment_reference' => $payload['transaction_id'] ?? null,
            ]);
        }

        return $invoice;
    }
}
