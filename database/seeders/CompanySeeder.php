<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Holding Company
        $holding = Company::create([
            'name' => 'Crave Global Group (Holding)',
            'slug' => 'crave-global-group',
            'is_holding' => true,
            'email' => 'holding@craveservices.my.id',
            'phone' => '021-5550100',
            'address' => 'MSIG Tower Floor 38, Jl Jendral Sudirman, Jakarta Selatan',
            'tax_id' => '01.234.567.8-012.000',
            'is_active' => true,
        ]);

        // 2. Create Subsidiary Companies
        $sub1 = Company::create([
            'name' => 'PT Crave Layanan Digital',
            'slug' => 'crave-layanan-digital',
            'is_holding' => false,
            'parent_company_id' => $holding->id,
            'email' => 'digital@craveservices.my.id',
            'phone' => '021-5550101',
            'address' => 'MSIG Tower Floor 38, Jl Jendral Sudirman, Jakarta Selatan',
            'tax_id' => '01.234.567.8-013.000',
            'is_active' => true,
        ]);

        $sub2 = Company::create([
            'name' => 'PT Crave Mitra Logistik',
            'slug' => 'crave-mitra-logistik',
            'is_holding' => false,
            'parent_company_id' => $holding->id,
            'email' => 'logistik@craveservices.my.id',
            'phone' => '021-5550102',
            'address' => 'Kawasan Industri MM2100, Cikarang Barat, Bekasi',
            'tax_id' => '01.234.567.8-014.000',
            'is_active' => true,
        ]);

        // 3. Create Branches for Sub1
        $branchJakarta = Branch::create([
            'company_id' => $sub1->id,
            'name' => 'Kantor Pusat Sudirman (HQ)',
            'code' => 'HQ-JKT',
            'address' => 'MSIG Tower Lt. 38, Jl. Jend. Sudirman Kav. 21, Jakarta Selatan',
            'latitude' => -6.21980000,
            'longitude' => 106.82270000,
            'radius_meters' => 100,
            'office_ips' => ['182.253.120.45', '127.0.0.1'],
            'is_active' => true,
        ]);

        $branchBandung = Branch::create([
            'company_id' => $sub1->id,
            'name' => 'Cabang Dago Bandung',
            'code' => 'BR-BDG',
            'address' => 'Jl. Ir. H. Juanda No. 120, Dago, Bandung',
            'latitude' => -6.89150000,
            'longitude' => 107.61060000,
            'radius_meters' => 100,
            'office_ips' => ['182.253.130.88'],
            'is_active' => true,
        ]);

        // 4. Create Users (Project Team)
        // Eka Revandi (Lead SE)
        $eka = User::create([
            'name' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'password' => Hash::make('@Mukbsca22'),
            'email_verified_at' => now(),
        ]);

        // Egi Witra Aditya (PM)
        $egi = User::create([
            'name' => 'Egi Witra Aditya',
            'email' => 'egi@craveservices.my.id',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Aufa (Dev)
        $aufa = User::create([
            'name' => 'Aufa',
            'email' => 'aufa@craveservices.my.id',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // 5. Attach Memberships & Roles
        // Eka has super_admin access to Holding and company_admin in subsidiaries
        $eka->companies()->attach($holding->id, ['role' => 'super_admin', 'is_primary' => true]);
        $eka->companies()->attach($sub1->id, ['role' => 'company_admin', 'branch_id' => $branchJakarta->id, 'is_primary' => false]);
        $eka->companies()->attach($sub2->id, ['role' => 'company_admin', 'is_primary' => false]);

        // Egi has holding_admin access
        $egi->companies()->attach($holding->id, ['role' => 'holding_admin', 'is_primary' => true]);
        $egi->companies()->attach($sub1->id, ['role' => 'company_admin', 'is_primary' => false]);

        // Aufa has company_admin access in Sub1
        $aufa->companies()->attach($sub1->id, ['role' => 'company_admin', 'branch_id' => $branchJakarta->id, 'is_primary' => true]);
    }
}
