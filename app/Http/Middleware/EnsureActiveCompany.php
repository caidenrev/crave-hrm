<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // Ensure an active company is selected
            if (!$request->session()->has('active_company_id')) {
                $company = $user->currentCompany();
                if ($company) {
                    $request->session()->put('active_company_id', $company->id);
                }
            }
        }

        return $next($request);
    }
}
