<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user() ?? Auth::user();

        if (!$user) {
            if ($request->expectsJson()) {
                abort(401, 'Silakan masuk ke akun Anda terlebih dahulu.');
            }
            return redirect()->guest(route('login'));
        }

        $currentRole = $user->currentRole();

        // Super Admin (CEO / Founder) has unrestricted global bypass
        if ($currentRole === 'super_admin') {
            return $next($request);
        }

        // Flatten all comma-separated role arguments (e.g. ['super_admin,company_admin', 'finance'])
        $allowedRoles = [];
        foreach ($roles as $role) {
            foreach (explode(',', $role) as $r) {
                $trimmed = trim($r);
                if ($trimmed !== '') {
                    $allowedRoles[] = $trimmed;
                }
            }
        }

        // If no specific roles required, allow through
        if (empty($allowedRoles)) {
            return $next($request);
        }

        // Check if current role has permission
        if ($currentRole && in_array($currentRole, $allowedRoles, true)) {
            return $next($request);
        }

        $roleLabels = [
            'super_admin' => 'Super Admin',
            'holding_admin' => 'Holding Admin',
            'company_admin' => 'Company Admin',
            'hr_admin' => 'HR Administrator',
            'finance' => 'Finance & Payroll',
            'branch_manager' => 'Branch Manager',
            'supervisor' => 'Supervisor',
            'merchant' => 'Kantin Merchant',
            'employee' => 'Karyawan',
        ];

        $userLabel = $roleLabels[$currentRole] ?? ($currentRole ? ucfirst(str_replace('_', ' ', $currentRole)) : 'Karyawan');

        abort(403, "Akses Ditolak. Peran akun Anda saat ini ({$userLabel}) tidak memiliki wewenang untuk mengakses halaman atau fitur ini.");
    }
}
