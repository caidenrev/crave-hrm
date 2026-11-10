<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OrganizationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::post('/company/switch', [CompanyController::class, 'switchCompany'])->name('company.switch');

// Employee Management
Route::prefix('employees')->name('employees.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('index');
    Route::post('/', [EmployeeController::class, 'store'])->name('store');
    Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
    Route::patch('/{employee}/toggle-active', [EmployeeController::class, 'toggleActive'])->name('toggle-active');
    Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
});

// Organization & RBAC Matrix
Route::get('/rbac', [OrganizationController::class, 'rbacMatrix'])->name('rbac');
Route::prefix('organization')->name('organization.')->group(function () {
    Route::get('/rbac-matrix', [OrganizationController::class, 'rbacMatrix'])->name('rbac-matrix');
});


