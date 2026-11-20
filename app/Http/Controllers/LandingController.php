<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Employee;
use App\Models\SalesLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Landing/Index', [
            'stats' => [
                'companies' => Company::count(),
                'employees' => Employee::count(),
            ],
        ]);
    }

    /**
     * Dedicated Contact Sales & Request Demo Page (GuestLayout Full Page).
     */
    public function contactSalesPage(): Response
    {
        return Inertia::render('ContactSales');
    }

    /**
     * Store new Contact Sales / Request Demo lead submission.
     */
    public function contactSales(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'company_name' => ['required', 'string', 'max:150'],
            'work_email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'string', 'min:8', 'max:25'],
            'employee_count' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'company_name.required' => 'Nama perusahaan wajib diisi.',
            'work_email.required' => 'Email kantor / bisnis wajib diisi.',
            'work_email.email' => 'Format email tidak valid.',
            'phone.required' => 'Nomor WhatsApp / HP aktif wajib diisi.',
            'employee_count.required' => 'Perkiraan jumlah karyawan wajib dipilih.',
        ]);

        $lead = SalesLead::create([
            'name' => $validated['name'],
            'company_name' => $validated['company_name'],
            'work_email' => $validated['work_email'],
            'phone' => $validated['phone'],
            'employee_count' => $validated['employee_count'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'new',
        ]);

        $message = "Terima kasih, {$lead->name}! Permintaan konsultasi & demo untuk {$lead->company_name} telah kami terima. Tim Sales Crave HRM akan segera menghubungi Anda dalam 1x24 jam.";

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'lead_id' => $lead->id,
            ]);
        }

        return back()->with('success', $message);
    }
}
