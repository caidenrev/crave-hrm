<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            $shiftPagi = Shift::firstOrCreate(
                ['company_id' => $company->id, 'code' => 'PAGI'],
                [
                    'name' => 'Shift Pagi Reguler',
                    'code' => 'PAGI',
                    'start_time' => '08:00:00',
                    'end_time' => '17:00:00',
                    'late_tolerance_minutes' => 15,
                    'is_flexible' => false,
                    'is_active' => true,
                    'description' => 'Shift operasional kerja reguler kantor pusat.',
                ]
            );

            $shiftSiang = Shift::firstOrCreate(
                ['company_id' => $company->id, 'code' => 'SIANG'],
                [
                    'name' => 'Shift Siang',
                    'code' => 'SIANG',
                    'start_time' => '13:00:00',
                    'end_time' => '21:00:00',
                    'late_tolerance_minutes' => 15,
                    'is_flexible' => false,
                    'is_active' => true,
                    'description' => 'Shift siang operasional layanan.',
                ]
            );

            $shiftMalam = Shift::firstOrCreate(
                ['company_id' => $company->id, 'code' => 'MALAM'],
                [
                    'name' => 'Shift Malam',
                    'code' => 'MALAM',
                    'start_time' => '21:00:00',
                    'end_time' => '06:00:00',
                    'late_tolerance_minutes' => 10,
                    'is_flexible' => false,
                    'is_active' => true,
                    'description' => 'Shift malam monitoring sistem.',
                ]
            );

            $shiftFlex = Shift::firstOrCreate(
                ['company_id' => $company->id, 'code' => 'FLEX'],
                [
                    'name' => 'Jam Kerja Fleksibel',
                    'code' => 'FLEX',
                    'start_time' => '09:00:00',
                    'end_time' => '18:00:00',
                    'late_tolerance_minutes' => 60,
                    'is_flexible' => true,
                    'is_active' => true,
                    'description' => 'Jam kerja fleksibel untuk tim developer & product.',
                ]
            );

            // Assign default shift to employees in this company
            Employee::where('company_id', $company->id)
                ->whereNull('default_shift_id')
                ->update(['default_shift_id' => $shiftPagi->id]);
        }
    }
}
