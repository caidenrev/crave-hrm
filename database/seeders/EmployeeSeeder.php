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
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptHr->id,
            'designation_id' => $desHrMgr->id,
            'nik' => 'CRV-HR-001',
            'nama_lengkap' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@craveservices.my.id',
            'nomor_telepon' => '081199887766',
            'tanggal_lahir' => '1997-05-12',
            'jenis_kelamin' => 'P',
            'tanggal_masuk' => '2023-02-01',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210448833',
            'gaji_pokok' => 14500000,
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptFin->id,
            'designation_id' => $desFin->id,
            'nik' => 'CRV-FIN-001',
            'nama_lengkap' => 'Budi Santoso',
            'email' => 'budi.santoso@craveservices.my.id',
            'nomor_telepon' => '081522334455',
            'tanggal_lahir' => '1992-09-30',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2022-11-15',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/2',
            'bank_name' => 'BNI',
            'bank_account_number' => '0293847561',
            'gaji_pokok' => 16000000,
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchBdg?->id,
            'department_id' => $deptEng->id,
            'designation_id' => $desFe->id,
            'nik' => 'CRV-ENG-003',
            'nama_lengkap' => 'Rian Pratama',
            'email' => 'rian.pratama@craveservices.my.id',
            'nomor_telepon' => '082133445566',
            'tanggal_lahir' => '1999-07-19',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2024-01-08',
            'status_kerja' => 'Probation',
            'ptkp_status' => 'TK/0',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210772211',
            'gaji_pokok' => 12000000,
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchBdg?->id,
            'department_id' => $deptPrd->id,
            'designation_id' => $desUi->id,
            'nik' => 'CRV-PRD-002',
            'nama_lengkap' => 'Dinda Kirana',
            'email' => 'dinda.kirana@craveservices.my.id',
            'nomor_telepon' => '081277665544',
            'tanggal_lahir' => '1998-04-14',
            'jenis_kelamin' => 'P',
            'tanggal_masuk' => '2023-09-01',
            'status_kerja' => 'PKWT',
            'ptkp_status' => 'TK/1',
            'bank_name' => 'BRI',
            'bank_account_number' => '034101002345501',
            'gaji_pokok' => 13500000,
            'is_active' => true,
        ]);

        Employee::create([
            'company_id' => $sub1->id,
            'branch_id' => $branchJkt?->id,
            'department_id' => $deptOps->id,
            'designation_id' => $desOps->id,
            'nik' => 'CRV-OPS-001',
            'nama_lengkap' => 'Hendra Wijaya',
            'email' => 'hendra.wijaya@craveservices.my.id',
            'nomor_telepon' => '081833445566',
            'tanggal_lahir' => '1994-12-03',
            'jenis_kelamin' => 'L',
            'tanggal_masuk' => '2023-04-10',
            'status_kerja' => 'PKWTT',
            'ptkp_status' => 'K/1',
            'bank_name' => 'BCA',
            'bank_account_number' => '8210665544',
            'gaji_pokok' => 9500000,
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
