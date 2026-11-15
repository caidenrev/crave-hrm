<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CanteenController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\RecruitmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes (Crave POS Guest Layout)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

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

// Holiday & Leave Management
Route::prefix('leave')->name('leave.')->group(function () {
    Route::get('/', [LeaveController::class, 'index'])->name('index');
    Route::post('/', [LeaveController::class, 'store'])->name('store');
    Route::delete('/{leaveRequest}', [LeaveController::class, 'cancel'])->name('cancel');

    // Approvals
    Route::get('/approvals', [LeaveController::class, 'approvals'])->name('approvals');
    Route::post('/approvals/{leaveRequest}/supervisor', [LeaveController::class, 'approveSupervisor'])->name('approvals.supervisor');
    Route::post('/approvals/{leaveRequest}/hr', [LeaveController::class, 'approveHr'])->name('approvals.hr');
    Route::post('/approvals/{leaveRequest}/reject', [LeaveController::class, 'reject'])->name('approvals.reject');
});

// Klaim, Lembur (PP 35/2021) & Tugas Lapangan
Route::prefix('claims')->name('claims.')->group(function () {
    Route::get('/', [ClaimController::class, 'index'])->name('index');

    // Overtime (SPKL)
    Route::get('/overtime', [ClaimController::class, 'overtimeIndex'])->name('overtime.index');
    Route::post('/overtime', [ClaimController::class, 'storeOvertime'])->name('overtime.store');
    Route::post('/overtime/{overtime}/approve', [ClaimController::class, 'approveOvertime'])->name('overtime.approve');
    Route::post('/overtime/{overtime}/reject', [ClaimController::class, 'rejectOvertime'])->name('overtime.reject');

    // Reimbursement
    Route::get('/reimbursement', [ClaimController::class, 'reimbursementIndex'])->name('reimbursement.index');
    Route::post('/reimbursement', [ClaimController::class, 'storeReimbursement'])->name('reimbursement.store');
    Route::post('/reimbursement/{reimbursement}/approve', [ClaimController::class, 'approveReimbursement'])->name('reimbursement.approve');
    Route::post('/reimbursement/{reimbursement}/pay', [ClaimController::class, 'payReimbursement'])->name('reimbursement.pay');
    Route::post('/reimbursement/{reimbursement}/reject', [ClaimController::class, 'rejectReimbursement'])->name('reimbursement.reject');

    // Tugas Lapangan / Visit
    Route::get('/visit', [ClaimController::class, 'visitIndex'])->name('visit.index');
    Route::post('/visit', [ClaimController::class, 'storeVisit'])->name('visit.store');
    Route::post('/visit/{visit}/verify', [ClaimController::class, 'verifyVisit'])->name('visit.verify');
});

// Crave Canteen (Dynamic QR 60s & Merchant Scanner)
Route::prefix('canteen')->name('canteen.')->group(function () {
    Route::get('/', [CanteenController::class, 'index'])->name('index');
    Route::post('/refresh-token', [CanteenController::class, 'refreshToken'])->name('refresh-token');

    // Merchant Scanner
    Route::get('/scanner', [CanteenController::class, 'scanner'])->name('scanner');
    Route::post('/redeem', [CanteenController::class, 'redeem'])->name('redeem');

    // Vendor Reconciliation / Settlement
    Route::get('/settlement', [CanteenController::class, 'settlement'])->name('settlement');
    Route::post('/vendors', [CanteenController::class, 'storeVendor'])->name('vendors.store');
    Route::put('/vendors/{vendor}', [CanteenController::class, 'updateVendor'])->name('vendors.update');
    Route::delete('/vendors/{vendor}', [CanteenController::class, 'destroyVendor'])->name('vendors.destroy');
});

// Smart Attendance System (GPS Geofence + IP + Selfie + Shifts)
Route::prefix('attendance')->name('attendance.')->group(function () {
    Route::get('/', [AttendanceController::class, 'checkInView'])->name('index');
    Route::post('/clock-in', [AttendanceController::class, 'clockIn'])->name('clock-in');
    Route::post('/clock-out', [AttendanceController::class, 'clockOut'])->name('clock-out');

    // Shifts & Schedules
    Route::get('/shifts', [AttendanceController::class, 'shifts'])->name('shifts');
    Route::post('/shifts', [AttendanceController::class, 'storeShift'])->name('shifts.store');
    Route::put('/shifts/{shift}', [AttendanceController::class, 'updateShift'])->name('shifts.update');
    Route::patch('/shifts/{shift}/toggle-active', [AttendanceController::class, 'toggleShiftActive'])->name('shifts.toggle-active');
    Route::delete('/shifts/{shift}', [AttendanceController::class, 'destroyShift'])->name('shifts.destroy');

    // Shift Swap
    Route::post('/shifts/swap', [AttendanceController::class, 'storeShiftSwap'])->name('shifts.swap.store');
    Route::patch('/shifts/swap/{shiftSwap}/action', [AttendanceController::class, 'actionShiftSwap'])->name('shifts.swap.action');

    // Daily Recap & HR Monitoring
    Route::get('/recap', [AttendanceController::class, 'recap'])->name('recap');
    Route::patch('/recap/{attendance}/correct', [AttendanceController::class, 'correctAttendance'])->name('recap.correct');
});

// Payroll Management (PPh 21 TER 2024, BPJS, Slips & Bank Batch)
Route::prefix('payroll')->name('payroll.')->group(function () {
    Route::get('/', [PayrollController::class, 'index'])->name('index');
    Route::post('/run', [PayrollController::class, 'runPayroll'])->name('run');
    Route::patch('/{period}/finalize', [PayrollController::class, 'finalize'])->name('finalize');

    // Payslips
    Route::get('/slips', [PayrollController::class, 'slips'])->name('slips');
    Route::get('/slips/{item}/print', [PayrollController::class, 'printSlip'])->name('slips.print');

    // Bank Batch & Master Recap Export
    Route::get('/export', [PayrollController::class, 'export'])->name('export');
    Route::post('/export/bank', [PayrollController::class, 'exportBank'])->name('export.bank');
    Route::post('/export/excel', [PayrollController::class, 'exportExcel'])->name('export.excel');
});

// Organization, Branches, Chart & RBAC Matrix
Route::get('/rbac', [OrganizationController::class, 'rbacMatrix'])->name('rbac');
Route::prefix('organization')->name('organization.')->group(function () {
    Route::get('/chart', [OrganizationController::class, 'chart'])->name('chart');
    Route::patch('/chart/placement/{employee}', [OrganizationController::class, 'updatePlacement'])->name('chart.placement');
    Route::post('/chart/departments', [OrganizationController::class, 'storeDepartment'])->name('chart.departments.store');
    Route::get('/rbac-matrix', [OrganizationController::class, 'rbacMatrix'])->name('rbac-matrix');
    Route::post('/rbac-matrix', [OrganizationController::class, 'updateRbacMatrix'])->name('rbac-matrix.update');

    // Branches & Geofence
    Route::prefix('branches')->name('branches.')->group(function () {
        Route::get('/', [BranchController::class, 'index'])->name('index');
        Route::post('/', [BranchController::class, 'store'])->name('store');
        Route::put('/{branch}', [BranchController::class, 'update'])->name('update');
        Route::patch('/{branch}/toggle-active', [BranchController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{branch}', [BranchController::class, 'destroy'])->name('destroy');
    });
});

// Public Career Portal (Guest / Tanpa Login)
Route::get('/careers', [RecruitmentController::class, 'publicPortal'])->name('careers.index');
Route::get('/careers/{companySlug}', [RecruitmentController::class, 'publicPortal'])->name('careers.company');
Route::post('/careers/apply/{jobSlug}', [RecruitmentController::class, 'publicApply'])->name('careers.apply');

// Crave E-Recruitment & ATS Kanban (Admin)
Route::prefix('recruitment')->name('recruitment.')->group(function () {
    Route::get('/', [RecruitmentController::class, 'index'])->name('index');
    Route::post('/jobs', [RecruitmentController::class, 'storeJob'])->name('jobs.store');
    Route::put('/jobs/{job}', [RecruitmentController::class, 'updateJob'])->name('jobs.update');
    Route::delete('/jobs/{job}', [RecruitmentController::class, 'destroyJob'])->name('jobs.destroy');
    Route::patch('/candidates/{candidate}/stage', [RecruitmentController::class, 'updateStage'])->name('candidates.stage');
    Route::patch('/candidates/{candidate}/scorecard', [RecruitmentController::class, 'updateScorecard'])->name('candidates.scorecard');
    Route::post('/candidates/{candidate}/schedule', [RecruitmentController::class, 'scheduleInterview'])->name('candidates.schedule');
    Route::post('/candidates/{candidate}/convert', [RecruitmentController::class, 'convertToEmployee'])->name('candidates.convert');
    Route::get('/candidates/{candidate}/offering', [RecruitmentController::class, 'offeringLetter'])->name('candidates.offering');
    Route::delete('/candidates/{candidate}', [RecruitmentController::class, 'destroyCandidate'])->name('candidates.destroy');
});



