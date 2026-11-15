<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Candidate;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\JobPosting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RecruitmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $holding = Company::where('is_holding', true)->first();
        if (!$holding) {
            return;
        }

        $branch = Branch::where('company_id', $holding->id)->first();
        $deptTech = Department::where('company_id', $holding->id)->where('name', 'like', '%Tech%')->first()
            ?? Department::where('company_id', $holding->id)->first();
        $deptFinance = Department::where('company_id', $holding->id)->where('name', 'like', '%Finan%')->first()
            ?? Department::where('company_id', $holding->id)->first();

        // 1. Create Job Postings
        $jobFullstack = JobPosting::firstOrCreate(
            ['company_id' => $holding->id, 'slug' => 'senior-full-stack-engineer'],
            [
                'branch_id' => $branch?->id,
                'department_id' => $deptTech?->id,
                'title' => 'Senior Full Stack Engineer (React 19 & Laravel 13)',
                'employment_type' => 'PKWTT',
                'workplace_type' => 'Hybrid',
                'experience_level' => 'Senior Level',
                'min_salary' => 18000000,
                'max_salary' => 25000000,
                'show_salary' => true,
                'description' => "Kami mencari Senior Full Stack Engineer yang berpengalaman dalam membangun arsitektur SaaS berskala tinggi menggunakan Laravel dan React (Inertia.js). Anda akan memimpin pengembangan modul inti Crave POS dan Crave HRM.",
                'requirements' => "• Pengalaman minimal 4 tahun dengan PHP (Laravel) dan JavaScript/TypeScript (React).\n• Memahami arsitektur Multi-Tenancy dan performa database MySQL.\n• Berpengalaman dengan Tailwind CSS dan arsitektur komponen modern.\n• Mampu merancang REST API yang aman dan skalabel.",
                'benefits' => "• Gaji kompetitif & BPJS Lengkap (Kesehatan & Ketenagakerjaan)\n• Tunjangan makan harian Crave Canteen Pass\n• Fleksibilitas kerja Hybrid (3 hari kantor, 2 hari remote)\n• MacBook Pro & anggaran pembelajaran tahunan",
                'vacancies_count' => 2,
                'deadline' => now()->addDays(30),
                'status' => 'published',
            ]
        );

        $jobDesigner = JobPosting::firstOrCreate(
            ['company_id' => $holding->id, 'slug' => 'lead-product-designer'],
            [
                'branch_id' => $branch?->id,
                'department_id' => $deptTech?->id,
                'title' => 'Lead Product Designer (UI/UX Systems)',
                'employment_type' => 'PKWTT',
                'workplace_type' => 'On-site',
                'experience_level' => 'Lead / Manager',
                'min_salary' => 16000000,
                'max_salary' => 22000000,
                'show_salary' => true,
                'description' => "Memimpin visi desain produk Crave POS dan ekosistem HRM dengan estetika modern, standar token OKLCH, micro-interactions, dan pengalaman pengguna kelas dunia tanpa kompromi.",
                'requirements' => "• Pengalaman 5+ tahun dalam merancang antarmuka aplikasi SaaS / Web App yang kompleks di Figma.\n• Portofolio yang mendalam menunjukkan penguasaan sistem desain (Design Tokens, Auto Layout, Component Sets).\n• Memahami implementasi frontend (Tailwind CSS, HTML/CSS semantics).\n• Kemampuan komunikasi dan kepemimpinan tim yang luar biasa.",
                'benefits' => "• Asuransi kesehatan swasta kelas 1 + BPJS\n• Kuota makan gratis di seluruh tenant katering Crave Canteen\n• Lingkungan kerja dinamis dengan workstation Apple 4K",
                'vacancies_count' => 1,
                'deadline' => now()->addDays(20),
                'status' => 'published',
            ]
        );

        $jobFinance = JobPosting::firstOrCreate(
            ['company_id' => $holding->id, 'slug' => 'corporate-tax-specialist'],
            [
                'branch_id' => $branch?->id,
                'department_id' => $deptFinance?->id,
                'title' => 'Corporate Tax & Payroll Specialist',
                'employment_type' => 'PKWTT',
                'workplace_type' => 'On-site',
                'experience_level' => 'Mid Level',
                'min_salary' => 12000000,
                'max_salary' => 16000000,
                'show_salary' => true,
                'description' => "Mengelola kepatuhan perpajakan korporasi (PPh 21 TER 2024, PPh 23, PPN, SPT Tahunan) dan mengawasi akurasi perhitungan beban penggajian karyawan di holding dan anak usaha.",
                'requirements' => "• S1 Akuntansi / Perpajakan dengan sertifikasi Brevet A & B (Brevet C nilai plus).\n• Menguasai formulasi PPh 21 TER 2024 (PP 58/2023 & PMK 168/2023) dan pelaporan e-Bupot.\n• Mahir mengoperasikan software akuntansi dan spreadsheet tingkat lanjut.",
                'benefits' => "• Paket kompensasi menarik & bonus tahunan performa\n• Jenjang karir jelas di grup holding Crave",
                'vacancies_count' => 1,
                'deadline' => now()->addDays(25),
                'status' => 'published',
            ]
        );

        // 2. Note: Candidates are kept empty for clean operational testing.
        // Candidates will enter organically when applicants submit forms via the Public Career Portal (/careers).
    }
}

