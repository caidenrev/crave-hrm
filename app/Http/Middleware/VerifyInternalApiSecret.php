<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalApiSecret
{
    /**
     * Handle an incoming internal microservice / API request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $corsHeaders = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Authorization, X-Crave-Internal-Key, Content-Type, Accept, X-Requested-With',
        ];

        // Handle CORS preflight options request
        if ($request->isMethod('OPTIONS')) {
            return response('', 204, $corsHeaders);
        }

        $expectedSecret = (string) config('services.crave_internal.secret');
        if (empty($expectedSecret)) {
            $expectedSecret = (string) env('CRAVE_INTERNAL_API_SECRET');
        }

        $providedSecret = $request->header('X-Crave-Internal-Key')
            ?? $request->bearerToken()
            ?? $request->query('secret');

        if (empty($providedSecret) || empty($expectedSecret) || ! hash_equals($expectedSecret, (string) $providedSecret)) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized: Invalid or missing internal secret key.',
                'hint' => 'Provide header X-Crave-Internal-Key or Bearer token matching CRAVE_INTERNAL_API_SECRET',
            ], 401, $corsHeaders);
        }

        $response = $next($request);

        foreach ($corsHeaders as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
