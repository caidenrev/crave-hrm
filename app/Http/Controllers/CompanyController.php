<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function switchCompany(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
        ]);

        $user = $request->user();

        // Verify user has access to this company
        if (!$user->companies()->where('companies.id', $validated['company_id'])->exists()) {
            return back()->with('error', 'Anda tidak memiliki hak akses ke entitas perusahaan ini.');
        }

        session(['active_company_id' => $validated['company_id']]);

        return back()->with('success', 'Konteks perusahaan berhasil dialihkan.');
    }
}
