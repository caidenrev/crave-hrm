<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $holding = Company::where('is_holding', true)->first() ?? Company::first();
        if ($holding) {
            $branchHolding = Branch::firstOrCreate(
                ['company_id' => $holding->id, 'code' => 'HQ-HOLDING'],
                [
                    'name' => 'Kantor Pusat Crave Group (Holding)',
                    'code' => 'HQ-HOLDING',
                    'address' => 'MSIG Tower Lt. 38, Jl. Jend. Sudirman Kav. 21, Jakarta Selatan',
                    'latitude' => -6.21980000,
                    'longitude' => 106.82270000,
                    'radius_meters' => 100,
                    'office_ips' => ['182.253.120.45', '127.0.0.1'],
                    'is_active' => true,
                ]
            );

            $deptBod = Department::firstOrCreate(
                ['company_id' => $holding->id, 'code' => 'BOD'],
                [
                    'name' => 'Board of Directors & Executives',
                    'code' => 'BOD',
                    'description' => 'Dewan Direksi dan Kepemimpinan Eksekutif Crave Group.',
                    'is_active' => true,
                ]
            );

            $deptStrat = Department::firstOrCreate(
                ['company_id' => $holding->id, 'code' => 'STRAT'],
                [
                    'name' => 'Corporate Strategy & Governance',
                    'code' => 'STRAT',
                    'description' => 'Strategi pertumbuhan bisnis, legalitas, dan kepatuhan holding.',
                    'is_active' => true,
                ]
            );

            $deptTreasury = Department::firstOrCreate(
                ['company_id' => $holding->id, 'code' => 'TRS'],
                [
                    'name' => 'Group Treasury & Investment',
                    'code' => 'TRS',
                    'description' => 'Pengelolaan permodalan grup, investasi, dan hubungan investor.',
                    'is_active' => true,
                ]
            );

            $desCeo = Designation::firstOrCreate(
                ['company_id' => $holding->id, 'department_id' => $deptBod->id, 'title' => 'Chief Executive Officer (CEO)'],
                ['level' => 'Director', 'description' => 'Pemimpin eksekutif grup holding']
            );

            $desCpo = Designation::firstOrCreate(
                ['company_id' => $holding->id, 'department_id' => $deptBod->id, 'title' => 'Chief Product & Operating Officer (CPO)'],
                ['level' => 'Director', 'description' => 'Kepala produk dan operasional grup']
            );

            $desVpEng = Designation::firstOrCreate(
                ['company_id' => $holding->id, 'department_id' => $deptBod->id, 'title' => 'VP of Engineering & Technology'],
                ['level' => 'Director', 'description' => 'Wakil Presiden teknologi dan rekayasa perangkat lunak']
            );

            $desHeadStrat = Designation::firstOrCreate(
                ['company_id' => $holding->id, 'department_id' => $deptStrat->id, 'title' => 'Head of Corporate Strategy'],
                ['level' => 'Lead', 'description' => 'Kepala divisi strategi perusahaan']
            );

            $desVpTreasury = Designation::firstOrCreate(
                ['company_id' => $holding->id, 'department_id' => $deptTreasury->id, 'title' => 'VP of Treasury & Finance'],
                ['level' => 'Lead', 'description' => 'Wakil Presiden perbendaharaan holding']
            );

            $userEka = User::where('email', 'founder@craveservices.my.id')->first();
            $userEgi = User::where('email', 'egi@craveservices.my.id')->first();
            $userAufa = User::where('email', 'aufa@craveservices.my.id')->first();

            Employee::firstOrCreate(
                ['company_id' => $holding->id, 'nik' => 'HLD-001'],
                [
                    'branch_id' => $branchHolding->id,
                    'department_id' => $deptBod->id,
                    'designation_id' => $desCeo->id,
                    'user_id' => $userEka?->id,
                    'nama_lengkap' => 'Eka Revandi',
                    'email' => 'founder@craveservices.my.id',
                    'nomor_telepon' => '081211223344',
                    'tanggal_lahir' => '1995-05-15',
                    'jenis_kelamin' => 'L',
                    'tanggal_masuk' => '2022-01-01',
                    'status_kerja' => 'PKWTT',
                    'ptkp_status' => 'TK/0',
                    'bank_name' => 'BCA',
                    'bank_account_number' => '8801928371',
                    'gaji_pokok' => 45000000,
                    'avatar_url' => '/images/avatars/avatar-1.jpg',
                    'is_active' => true,
                ]
            );

            Employee::firstOrCreate(
                ['company_id' => $holding->id, 'nik' => 'HLD-002'],
                [
                    'branch_id' => $branchHolding->id,
                    'department_id' => $deptBod->id,
                    'designation_id' => $desCpo->id,
                    'user_id' => $userEgi?->id,
                    'nama_lengkap' => 'Egi Witra Aditya',
                    'email' => 'egi@craveservices.my.id',
                    'nomor_telepon' => '081255667788',
                    'tanggal_lahir' => '1996-08-20',
                    'jenis_kelamin' => 'L',
                    'tanggal_masuk' => '2022-01-01',
                    'status_kerja' => 'PKWTT',
                    'ptkp_status' => 'TK/0',
                    'bank_name' => 'Mandiri',
                    'bank_account_number' => '127009847261',
                    'gaji_pokok' => 38000000,
                    'avatar_url' => '/images/avatars/avatar-2.jpg',
                    'is_active' => true,
                ]
            );

            Employee::firstOrCreate(
                ['company_id' => $holding->id, 'nik' => 'HLD-003'],
                [
                    'branch_id' => $branchHolding->id,
                    'department_id' => $deptBod->id,
                    'designation_id' => $desVpEng->id,
                    'user_id' => $userAufa?->id,
                    'nama_lengkap' => 'Aufa',
                    'email' => 'aufa@craveservices.my.id',
                    'nomor_telepon' => '081399887766',
                    'tanggal_lahir' => '1997-12-10',
                    'jenis_kelamin' => 'L',
                    'tanggal_masuk' => '2022-03-01',
                    'status_kerja' => 'PKWTT',
                    'ptkp_status' => 'TK/0',
                    'bank_name' => 'BCA',
                    'bank_account_number' => '8803456712',
                    'gaji_pokok' => 35000000,
                    'avatar_url' => '/images/avatars/avatar-3.jpg',
                    'is_active' => true,
                ]
            );
        }

        $sub1 = Company::where('slug', 'crave-layanan-digital')->first();
        $sub2 = Company::where('slug', 'crave-mitra-logistik')->first();

        if (!$sub1) {
            return;
        }

        $branchJkt = Branch::where('company_id', $sub1->id)->where('code', 'HQ-JKT')->first();
        $branchBdg = Branch::where('company_id', $sub1->id)->where('code', 'BR-BDG')->first();

        // 1. Departments for Sub1
        $deptEng = Department::create([
            'company_id' => $sub1->id,
            'name' => 'Engineering & Tech',
            'code' => 'ENG',
            'description' => 'Software engineering, architecture, and cloud infrastructure.',
        ]);

        $deptPrd = Department::create([
            'company_id' => $sub1->id,
            'name' => 'Product & Design',
            'code' => 'PRD',
            'description' => 'Product strategy, roadmap, and UI/UX research.',
        ]);

        $deptHr = Department::create([
            'company_id' => $sub1->id,
            'name' => 'Human Resources',
            'code' => 'HR',
            'description' => 'People operations, talent acquisition, and organizational development.',
        ]);

        $deptFin = Department::create([
            'company_id' => $sub1->id,
            'name' => 'Finance & Payroll',
            'code' => 'FIN',
            'description' => 'Corporate finance, tax compliance, and payroll disbursement.',
        ]);

        $deptOps = Department::create([
            'company_id' => $sub1->id,
            'name' => 'Operations & Support',
            'code' => 'OPS',
            'description' => 'Technical support and field operations.',
        ]);

        // 2. Designations for Sub1
        $desLeadEng = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptEng->id,
            'title' => 'Lead Software Engineer',
            'level' => 'Lead',
        ]);

        $desDev = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptEng->id,
            'title' => 'Senior Fullstack Developer',
            'level' => 'Senior',
        ]);

        $desFe = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptEng->id,
            'title' => 'Frontend Developer',
            'level' => 'Staff',
        ]);

        $desPm = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptPrd->id,
            'title' => 'Project Manager',
            'level' => 'Lead',
        ]);

        $desUi = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptPrd->id,
            'title' => 'UI/UX Designer',
            'level' => 'Staff',
        ]);

        $desHrMgr = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptHr->id,
            'title' => 'HR Specialist',
            'level' => 'Specialist',
        ]);

        $desFin = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptFin->id,
            'title' => 'Finance & Tax Officer',
            'level' => 'Specialist',
        ]);

        $desOps = Designation::create([
            'company_id' => $sub1->id,
            'department_id' => $deptOps->id,
            'title' => 'IT Operations Specialist',
            'level' => 'Staff',
        ]);

        // Connect Users to Employees
        $userEka = User::where('email', 'founder@craveservices.my.id')->first();
        $userEgi = User::where('email', 'egi@craveservices.my.id')->first();
        $userAufa = User::where('email', 'aufa@craveservices.my.id')->first();

        // 3. Seed Employees for Sub1
        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptEng->id,
            'designation_id' => $desLeadEng->id,
            'user_id' => $userEka?->id,
            'nik' => 'CRV-ENG-001',
            'nama_lengkap' => 'Eka Revandi',
            'email' => 'founder@craveservices.my.id',
            'nomor_telepon' => '081234567890',
            'tanggal_lahir' => '1995-08-17',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2023-01-10',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/1',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210984721',
            'gaji_pokok' => 35000000,
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptPrd->id,
            'designation_id' => $desPm->id,
            'user_id' => $userEgi?->id,
            'nik' => 'CRV-PRD-001',
            'nama_lengkap' => 'Egi Witra Aditya',
            'email' => 'egi@craveservices.my.id',
            'nomor_telepon' => '081298765432',
            'tanggal_lahir' => '1996-03-24',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2023-03-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/1',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210339912',
            'gaji_pokok' => 28000000,
            'avatar_url' => '/images/avatars/avatar-2.jpg',
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptEng->id,
            'designation_id' => $desDev->id,
            'user_id' => $userAufa?->id,
            'nik' => 'CRV-ENG-002',
            'nama_lengkap' => 'Aufa',
            'email' => 'aufa@craveservices.my.id',
            'nomor_telepon' => '081377889900',
            'tanggal_lahir' => '1998-11-05',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2023-06-15',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'Mandiri',
            'bank_account_number' => '1370019283741',
            'gaji_pokok' => 18000000,
            'avatar_url' => '/images/avatars/avatar-3.jpg',
            'is_active' => true,
        ]);

        // 4. Seed Departments & Employees for Sub2 (Logistics) to verify multi-tenant isolation
        if ($sub2) {
            $deptLog = Department::create([
                'company_id' => $sub2->id,
                'name' => 'Warehouse & Fleet Logistics',
                'code' => 'WHS',
                'description' => 'Fleet operations, dispatch, and hub inventory.',
            ]);

            $desFleetMgr = Designation::create([
                'company_id' => $sub2->id,
                'department_id' => $deptLog->id,
                'title' => 'Fleet Manager',
                'level' => 'Manager',
            ]);

            Employee::create([
                'company_id' => $sub2->id,
                'department_id' => $deptLog->id,
                'designation_id' => $desFleetMgr->id,
                'nik' => 'LOG-001',
                'nama_lengkap' => 'Agus Sudarsono',
                'email' => 'agus.sudarsono@cravelogistik.my.id',
                'nomor_telepon' => '081744556677',
                'tanggal_lahir' => '1990-06-20',
                'jenis_kelamin' => 'L',
                'tanggal_masuk' => '2023-05-01',
                'status_kerja' => 'PKWTT',
                'ptkp_status' => 'K/2',
                'bank_name' => 'Mandiri',
                'bank_account_number' => '1370029384751',
                'gaji_pokok' => 15000000,
                'is_active' => true,
            ]);
        }
    }
}
