<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $departmentId = $request->input('department_id');
        $branchId = $request->input('branch_id');
        $status = $request->input('status', 'all');

        $query = Employee::with(['department', 'designation', 'branch'])
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'probation') {
            $query->where('status_kerja', 'Probation');
        } elseif ($status === 'pkwt') {
            $query->where('status_kerja', 'PKWT');
        } elseif ($status === 'pkwtt') {
            $query->where('status_kerja', 'PKWTT');
        }

        $employees = $query->paginate(15)->withQueryString();

        $activeCompanyId = session('active_company_id');

        $departments = Department::where('company_id', $activeCompanyId)
            ->where('is_active', true)
            ->select('id', 'name', 'code')
            ->get();

        $branches = Branch::where('company_id', $activeCompanyId)
            ->where('is_active', true)
            ->select('id', 'name', 'code')
            ->get();

        $designations = Designation::where('company_id', $activeCompanyId)
            ->where('is_active', true)
            ->select('id', 'title', 'department_id', 'level')
            ->get();

        $metrics = [
            'total' => Employee::count(),
            'active' => Employee::where('is_active', true)->count(),
            'probation' => Employee::where('status_kerja', 'Probation')->count(),
            'pkwt' => Employee::where('status_kerja', 'PKWT')->count(),
            'pkwtt' => Employee::where('status_kerja', 'PKWTT')->count(),
        ];

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'branches' => $branches,
            'designations' => $designations,
            'metrics' => $metrics,
            'filters' => [
                'search' => $search,
                'department_id' => $departmentId,
                'branch_id' => $branchId,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $activeCompanyId = session('active_company_id');

        $validated = $request->validate([
            'nik' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees')->where('company_id', $activeCompanyId),
            ],
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'nomor_telepon' => 'nullable|string|max:30',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_masuk' => 'required|date',
            'status_kerja' => 'required|string|in:PKWT,PKWTT,Probation,Internship',
            'ptkp_status' => 'required|string|in:TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3',
            'bank_name' => 'required|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'gaji_pokok' => 'required|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'branch_id' => 'nullable|exists:branches,id',
            'is_active' => 'boolean',
        ]);

        $validated['company_id'] = $activeCompanyId;
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        Employee::create($validated);

        return back()->with('success', 'Data karyawan baru berhasil ditambahkan.');
    }

    public function update(Request $request, Employee $employee)
    {
        $activeCompanyId = session('active_company_id');

        $validated = $request->validate([
            'nik' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees')->where('company_id', $activeCompanyId)->ignore($employee->id),
            ],
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'nomor_telepon' => 'nullable|string|max:30',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_masuk' => 'required|date',
            'status_kerja' => 'required|string|in:PKWT,PKWTT,Probation,Internship',
            'ptkp_status' => 'required|string|in:TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3',
            'bank_name' => 'required|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'gaji_pokok' => 'required|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'branch_id' => 'nullable|exists:branches,id',
            'is_active' => 'boolean',
        ]);

        $employee->update($validated);

        return back()->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function toggleActive(Employee $employee)
    {
        $employee->is_active = !$employee->is_active;
        $employee->save();

        $statusLabel = $employee->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Status akun karyawan {$employee->nama_lengkap} berhasil {$statusLabel}.");
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return back()->with('success', 'Data karyawan berhasil dihapus.');
    }
}
