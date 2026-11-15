<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Landing/Index', [
            'stats' => [
                'companies' => Company::count(),
                'employees' => Employee::count(),
            ],
        ]);
    }
}
