<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFounder
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->guest(route('login'));
        }

        if (!$user->isFounder()) {
            abort(403, 'Akses Ditolak. Dashboard Founder & Manajemen Pengguna SaaS hanya dapat diakses oleh SaaS Founder / Super Admin.');
        }

        return $next($request);
    }
}
