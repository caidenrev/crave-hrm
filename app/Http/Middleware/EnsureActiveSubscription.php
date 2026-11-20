<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Platform Founder always has global unrestricted bypass
        if ($user && $user->isFounder()) {
            return $next($request);
        }

        // Whitelist routes that must remain accessible even if suspended or expired
        if (
            $request->is('subscription*') ||
            $request->is('profile*') ||
            $request->is('logout') ||
            $request->is('company/switch') ||
            $request->is('api/midtrans*') ||
            $request->is('midtrans*')
        ) {
            return $next($request);
        }

        $activeCompanyId = session('active_company_id');
        $company = $activeCompanyId
            ? \App\Models\Company::find($activeCompanyId)
            : $user?->currentCompany();

        if (!$company) {
            return $next($request);
        }

        $state = $company->subscriptionState();

        // If company is suspended by Founder
        if ($state === 'suspended') {
            if ($request->expectsJson()) {
                abort(403, 'Akses perusahaan Anda ditangguhkan oleh Administrator SaaS.');
            }
            return redirect()->route('subscription.suspended');
        }

        // If trial or paid subscription has completely expired
        if ($state === 'expired') {
            // Allow GET viewing on dashboard with warning banner, but block other modules
            if (!$request->is('dashboard')) {
                if ($request->expectsJson()) {
                    abort(403, 'Masa aktif langganan perusahaan Anda telah berakhir. Silakan lakukan perpanjangan.');
                }
                return redirect()->route('subscription.index')->with('error', 'Masa aktif langganan / trial perusahaan Anda telah berakhir. Silakan pilih paket langganan untuk melanjutkan.');
            }
        }

        return $next($request);
    }
}
