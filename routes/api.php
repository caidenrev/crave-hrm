<?php

use App\Http\Controllers\Api\InternalFounderMetricsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Internal Microservice / SaaS Ecosystem API Routes
|--------------------------------------------------------------------------
|
| Secured via CRAVE_INTERNAL_API_SECRET bearer / header validation.
| Used by central Crave Founder Console (in Crave POS) to query HRM telemetry.
|
*/

Route::middleware('internal.secret')->prefix('v1/internal')->group(function () {
    Route::match(['GET', 'OPTIONS'], '/founder-stats', [InternalFounderMetricsController::class, 'index'])->name('api.internal.founder-stats');
});
