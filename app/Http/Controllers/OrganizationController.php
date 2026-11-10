<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
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
