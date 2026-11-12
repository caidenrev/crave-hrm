<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HolidayController;
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

// Internal Announcements
Route::prefix('announcements')->name('announcements.')->group(function () {
    Route::get('/', [AnnouncementController::class, 'index'])->name('index');
    Route::post('/', [AnnouncementController::class, 'store'])->name('store');
    Route::put('/{announcement}', [AnnouncementController::class, 'update'])->name('update');
    Route::patch('/{announcement}/toggle-pin', [AnnouncementController::class, 'togglePin'])->name('toggle-pin');
    Route::delete('/{announcement}', [AnnouncementController::class, 'destroy'])->name('destroy');
});

// Calendar & National Holidays
Route::prefix('calendar')->name('calendar.')->group(function () {
    Route::get('/', [HolidayController::class, 'index'])->name('index');
    Route::post('/', [HolidayController::class, 'store'])->name('store');
    Route::delete('/{holiday}', [HolidayController::class, 'destroy'])->name('destroy');
});

// Organization, Branches, Chart & RBAC Matrix
Route::get('/rbac', [OrganizationController::class, 'rbacMatrix'])->name('rbac');
Route::prefix('organization')->name('organization.')->group(function () {
    Route::get('/chart', [OrganizationController::class, 'chart'])->name('chart');
    Route::patch('/chart/placement/{employee}', [OrganizationController::class, 'updatePlacement'])->name('chart.placement');
    Route::post('/chart/departments', [OrganizationController::class, 'storeDepartment'])->name('chart.departments.store');
    Route::get('/rbac-matrix', [OrganizationController::class, 'rbacMatrix'])->name('rbac-matrix');

    // Branches & Geofence
    Route::prefix('branches')->name('branches.')->group(function () {
        Route::get('/', [BranchController::class, 'index'])->name('index');
        Route::post('/', [BranchController::class, 'store'])->name('store');
        Route::put('/{branch}', [BranchController::class, 'update'])->name('update');
        Route::patch('/{branch}/toggle-active', [BranchController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{branch}', [BranchController::class, 'destroy'])->name('destroy');
    });
});


