<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans API Credentials
    |--------------------------------------------------------------------------
    |
    | Configuration for Midtrans Payment Gateway (Snap / Core API).
    | Get your Server Key and Client Key from https://dashboard.midtrans.com
    |
    */

    'server_key' => env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-demo-key'),
    'client_key' => env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-demo-key'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => env('MIDTRANS_IS_3DS', true),

    'snap_url' => env('MIDTRANS_IS_PRODUCTION', false)
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions',

    'snap_js' => env('MIDTRANS_IS_PRODUCTION', false)
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js',
];
