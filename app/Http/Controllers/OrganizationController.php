<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function chart(Request $request)
    {
        $branchId = $request->input('branch_id', 'all');

        $activeCompany = Company::find(session('active_company_id')) ?? Company::first();

        $branches = \App\Models\Branch::where('is_active', true)
            ->select('id', 'name', 'code')
            ->get();

        $departments = Department::with([
            'designations' => fn ($q) => $q->where('is_active', true),
            'employees' => function ($q) use ($branchId) {
                $q->where('is_active', true)
                  ->with(['designation', 'branch'])
                  ->orderBy('nama_lengkap');

                if ($branchId !== 'all' && !empty($branchId)) {
                    $q->where('branch_id', $branchId);
                }
            }
        ])
        ->where('is_active', true)
        ->get();

        $allEmployees = Employee::where('is_active', true)
            ->select('id', 'nama_lengkap', 'nik', 'department_id', 'designation_id', 'branch_id')
            ->orderBy('nama_lengkap')
            ->get();

        $allDesignations = Designation::where('is_active', true)
            ->select('id', 'department_id', 'title', 'level')
            ->get();

        $stats = [
            'total_departments' => $departments->count(),
            'total_employees' => $departments->sum(fn ($d) => $d->employees->count()),
            'total_designations' => Designation::where('is_active', true)->count(),
            'total_branches' => $branches->count(),
        ];

        return Inertia::render('Organization/OrgChart', [
            'company' => $activeCompany,
            'departments' => $departments,
            'branches' => $branches,
            'allEmployees' => $allEmployees,
            'allDesignations' => $allDesignations,
            'selectedBranchId' => $branchId,
            'stats' => $stats,
        ]);
    }

    public function updatePlacement(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $employee->update($validated);

        return back()->with('success', "Penempatan {$employee->nama_lengkap} berhasil diperbarui.");
    }

    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
        ]);

        Department::create($validated);

        return back()->with('success', 'Departemen baru berhasil ditambahkan.');
    }

    public function rbacMatrix()
    {
        $roles = [
            [
                'id' => 'super_admin',
                'name' => 'Super Admin (Holding)',
                'badge' => 'Holding Level',
                'description' => 'Akses penuh tanpa batas ke seluruh holding dan semua entitas anak perusahaan.',
            ],
            [
                'id' => 'company_admin',
                'name' => 'Company Admin (HR Director)',
                'badge' => 'Company Level',
                'description' => 'Pengelola utama entitas anak perusahaan, kebijakan karyawan, dan operasional bisnis.',
            ],
            [
                'id' => 'branch_manager',
                'name' => 'Branch Manager',
                'badge' => 'Branch Level',
                'description' => 'Pengawas operasional dan kehadiran tim pada cabang kantor bersangkutan.',
            ],
            [
                'id' => 'finance',
                'name' => 'Finance & Payroll Officer',
                'badge' => 'Specialist',
                'description' => 'Eksekusi kalkulasi PPh 21, BPJS, klaim reimbursement, dan disbursement perbankan.',
            ],
            [
                'id' => 'employee',
                'name' => 'Employee (Self-Service)',
                'badge' => 'Standard',
                'description' => 'Portal mandiri: presensi GPS selfie, slip gaji, pengajuan cuti, voucher kantin, dan klaim.',
            ],
        ];

        $modules = [
            [
                'group' => 'Presensi & Kehadiran',
                'items' => [
                    [
                        'key' => 'attendance.self',
                        'label' => 'Presensi GPS Selfie & Whitelist IP',
                        'description' => 'Melakukan check-in dan check-out kehadiran harian via mobile/web.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => true, 'employee' => true],
                    ],
                    [
                        'key' => 'attendance.manage',
                        'label' => 'Kelola Shift & Koreksi Absensi',
                        'description' => 'Mengubah jadwal shift kerja dan menyetujui koreksi jam kerja karyawan.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => false, 'employee' => false],
                    ],
                ],
            ],
            [
                'group' => 'Kompensasi & Penggajian',
                'items' => [
                    [
                        'key' => 'payroll.view_own',
                        'label' => 'Lihat & Unduh Slip Gaji Sendiri',
                        'description' => 'Mengunduh rincian slip gaji PDF berproteksi sandi.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => true, 'employee' => true],
                    ],
                    [
                        'key' => 'payroll.calculate',
                        'label' => 'Kalkulasi PPh 21 TER 2024 & BPJS',
                        'description' => 'Menghitung take home pay dan potongan pajak sesuai regulasi pemerintah.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => false, 'finance' => true, 'employee' => false],
                    ],
                    [
                        'key' => 'payroll.bank_batch',
                        'label' => 'Ekspor File Batch Perbankan (BCA/Mandiri/BRI/BNI)',
                        'description' => 'Menghasilkan berkas transfer massal perbankan korporat.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => false, 'finance' => true, 'employee' => false],
                    ],
                ],
            ],
            [
                'group' => 'Master Karyawan & Organisasi',
                'items' => [
                    [
                        'key' => 'employee.manage',
                        'label' => 'Master Data Karyawan & Switch Status Aktif',
                        'description' => 'Tambah, edit profil karyawan, ubah status kerja, dan aktivasi akun.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => false, 'finance' => false, 'employee' => false],
                    ],
                    [
                        'key' => 'rbac.manage',
                        'label' => 'Konfigurasi Matriks RBAC & Hak Akses',
                        'description' => 'Menyesuaikan pembagian wewenang role user per modul.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => false, 'finance' => false, 'employee' => false],
                    ],
                ],
            ],
            [
                'group' => 'Cuti & Izin Kerja',
                'items' => [
                    [
                        'key' => 'leave.apply',
                        'label' => 'Pengajuan Cuti Tahunan & Sakit',
                        'description' => 'Mengajukan permohonan istirahat kerja dengan upload dokumen pendukung.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => true, 'employee' => true],
                    ],
                    [
                        'key' => 'leave.approve',
                        'label' => 'Persetujuan Cuti Bertingkat (Supervisor & HR)',
                        'description' => 'Melakukan review dan persetujuan pengajuan cuti bawahan.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => false, 'employee' => false],
                    ],
                ],
            ],
            [
                'group' => 'Crave Kantin',
                'items' => [
                    [
                        'key' => 'canteen.voucher',
                        'label' => 'Generate Dynamic QR Voucher (TTL 60s)',
                        'description' => 'Mendapatkan voucher makan harian untuk ditukarkan ke merchant kantin.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => true, 'finance' => true, 'employee' => true],
                    ],
                    [
                        'key' => 'canteen.scanner',
                        'label' => 'Merchant Scanner & Klaim Settlement',
                        'description' => 'Memindai QR voucher karyawan dan melihat rekap penagihan katering.',
                        'matrix' => ['super_admin' => true, 'company_admin' => true, 'branch_manager' => false, 'finance' => true, 'employee' => false],
                    ],
                ],
            ],
        ];

        return Inertia::render('Organization/RbacMatrix', [
            'roles' => $roles,
            'modules' => $modules,
        ]);
    }
}
