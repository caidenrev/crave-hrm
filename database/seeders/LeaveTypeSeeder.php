<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();

        $defaultTypes = [
            [
                'name' => 'Cuti Tahunan',
                'code' => 'ANNUAL',
                'days_allocated' => 12,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Hak cuti tahunan resmi 12 hari kerja per tahun kalender.',
            ],
            [
                'name' => 'Cuti Sakit',
                'code' => 'SICK',
                'days_allocated' => 14,
                'is_paid' => true,
                'requires_attachment' => true,
                'description' => 'Izin sakit. Wajib melampirkan surat keterangan dokter jika lebih dari 1 hari.',
            ],
            [
                'name' => 'Cuti Melahirkan / Hamil',
                'code' => 'MATERNITY',
                'days_allocated' => 90,
                'is_paid' => true,
                'requires_attachment' => true,
                'description' => 'Hak cuti bersalin bagi karyawati (3 bulan / 90 hari kalender).',
            ],
            [
                'name' => 'Cuti Menikah',
                'code' => 'MARRIAGE',
                'days_allocated' => 3,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Cuti pernikahan resmi karyawan (3 hari kerja).',
            ],
            [
                'name' => 'Cuti Duka Cita',
                'code' => 'BEREAVEMENT',
                'days_allocated' => 2,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Cuti kedukaan anggota keluarga inti meninggal dunia (2 hari kerja).',
            ],
            [
                'name' => 'Izin Tidak Berbayar (Unpaid)',
                'code' => 'UNPAID',
                'days_allocated' => 0,
                'is_paid' => false,
                'requires_attachment' => false,
                'description' => 'Izin keperluan pribadi tanpa tunjangan gaji harian.',
            ],
        ];

        foreach ($companies as $company) {
            foreach ($defaultTypes as $type) {
                LeaveType::firstOrCreate(
                    [
                        'company_id' => $company->id,
                        'code' => $type['code'],
                    ],
                    array_merge($type, ['company_id' => $company->id])
                );
            }

            // Seed balances for employees of this company
            $annualType = LeaveType::where('company_id', $company->id)->where('code', 'ANNUAL')->first();
            $sickType = LeaveType::where('company_id', $company->id)->where('code', 'SICK')->first();

            $employees = Employee::where('company_id', $company->id)->get();
            foreach ($employees as $emp) {
                if ($annualType) {
                    LeaveBalance::firstOrCreate(
                        [
                            'company_id' => $company->id,
                            'employee_id' => $emp->id,
                            'leave_type_id' => $annualType->id,
                            'year' => 2026,
                        ],
                        [
                            'total_allocated' => 12,
                            'used_days' => 0,
                            'pending_days' => 0,
                            'remaining_days' => 12,
                        ]
                    );
                }

                if ($sickType) {
                    LeaveBalance::firstOrCreate(
                        [
                            'company_id' => $company->id,
                            'employee_id' => $emp->id,
                            'leave_type_id' => $sickType->id,
                            'year' => 2026,
                        ],
                        [
                            'total_allocated' => 14,
                            'used_days' => 0,
                            'pending_days' => 0,
                            'remaining_days' => 14,
                        ]
                    );
                }
            }
        }
    }
}
