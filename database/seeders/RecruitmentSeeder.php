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

        // 2. Create Realistic Candidates across Kanban Stages
        $candidatesData = [
            // Stage: Applied
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFullstack->id,
                'full_name' => 'Rian Pratama, S.Kom',
                'email' => 'rian.pratama@techmail.id',
                'phone' => '081288991122',
                'current_company' => 'PT Solusi Finansial Digital',
                'current_title' => 'Backend Engineer',
                'linkedin_url' => 'https://linkedin.com/in/rianpratama',
                'portfolio_url' => 'https://github.com/rianpratama',
                'source' => 'Career Portal',
                'stage' => 'applied',
                'rating' => 0,
                'cover_letter' => 'Saya memiliki pengalaman 4 tahun mengembangkan microservices dengan Laravel dan React. Sangat tertarik berkontribusi di ekosistem Crave HRM.',
            ],
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobDesigner->id,
                'full_name' => 'Annisa Triana',
                'email' => 'annisa.triana@designstudio.com',
                'phone' => '081399887766',
                'current_company' => 'Agency Kreatif Nusantara',
                'current_title' => 'Senior UI Designer',
                'linkedin_url' => 'https://linkedin.com/in/annisa-triana',
                'portfolio_url' => 'https://dribbble.com/annisatriana',
                'source' => 'LinkedIn',
                'stage' => 'applied',
                'rating' => 0,
                'cover_letter' => 'Saya berfokus pada design system dan UI modern berbasis OKLCH dan clean typography.',
            ],

            // Stage: Screening
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFullstack->id,
                'full_name' => 'Dimas Arya Putra',
                'email' => 'dimas.arya@cloudservice.co.id',
                'phone' => '082155443322',
                'current_company' => 'E-Commerce Unicorn ID',
                'current_title' => 'Full Stack Developer',
                'linkedin_url' => 'https://linkedin.com/in/dimas-arya',
                'source' => 'Career Portal',
                'stage' => 'screening',
                'rating' => 3,
                'interview_notes' => 'Screening CV lolos. Pengalaman Laravel sangat kuat, memahami konsep clean architecture dan TDD.',
            ],
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFinance->id,
                'full_name' => 'Fitria Zahra, Ak.',
                'email' => 'fitria.zahra@taxcorp.id',
                'phone' => '081122334455',
                'current_company' => 'KAP Hadori Sugiarto',
                'current_title' => 'Senior Tax Auditor',
                'linkedin_url' => 'https://linkedin.com/in/fitria-zahra',
                'source' => 'Referral',
                'stage' => 'screening',
                'rating' => 4,
                'interview_notes' => 'Memiliki Brevet B dan sertifikasi konsultan pajak. Portofolio audit PPh 21 TER dan e-Faktur sangat rapi.',
            ],

            // Stage: Interview
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFullstack->id,
                'full_name' => 'Kevin Sanjaya, M.T.',
                'email' => 'kevin.sanjaya@engineer.id',
                'phone' => '081809988776',
                'current_company' => 'Global SaaS Labs',
                'current_title' => 'Senior Software Engineer',
                'linkedin_url' => 'https://linkedin.com/in/kevin-sanjaya',
                'portfolio_url' => 'https://github.com/kevinsanjaya',
                'source' => 'Career Portal',
                'stage' => 'interview',
                'rating' => 5,
                'interview_scheduled_at' => now()->addDays(2)->setHour(14)->setMinute(0),
                'interview_meeting_link' => 'https://meet.google.com/crv-eng-rec',
                'interview_notes' => 'Wawancara teknis arsitektur Laravel multi-tenancy dan benchmark performa query. Pemahaman algoritma dan struktur data luar biasa.',
            ],

            // Stage: Offering
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobDesigner->id,
                'full_name' => 'Nadia Safira, S.Ds.',
                'email' => 'nadia.safira@designworks.id',
                'phone' => '081722331100',
                'current_company' => 'Digital Product Studio',
                'current_title' => 'Senior Product Designer',
                'linkedin_url' => 'https://linkedin.com/in/nadiasafira',
                'portfolio_url' => 'https://nadiasafira.design',
                'source' => 'LinkedIn',
                'stage' => 'offering',
                'rating' => 5,
                'offered_salary' => 19500000,
                'interview_notes' => 'User interview dengan Eka Revandi (Lead) dan Egi Witra (PM) mendapat rekomendasi kuat (Strong Hire). Surat penawaran kerja (Offering Letter) telah dikirim.',
            ],

            // Stage: Hired (Ready for 1-Click Onboard to Employee)
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFullstack->id,
                'full_name' => 'Aditya Wijaya, S.Kom.',
                'email' => 'aditya.wijaya@craveservices.my.id',
                'phone' => '081233445566',
                'current_company' => 'Indo FinTech Solutions',
                'current_title' => 'Lead Fullstack Developer',
                'linkedin_url' => 'https://linkedin.com/in/aditya-wijaya',
                'portfolio_url' => 'https://github.com/adityawijaya',
                'source' => 'Career Portal',
                'stage' => 'hired',
                'rating' => 5,
                'offered_salary' => 22000000,
                'hired_at' => now()->subDays(1),
                'interview_notes' => 'Kandidat menerima penawaran kerja (Offering Signed). Siap dilakukan 1-click onboarding ke Master Data Karyawan.',
                'is_converted_to_employee' => false,
            ],

            // Stage: Rejected
            [
                'company_id' => $holding->id,
                'job_posting_id' => $jobFullstack->id,
                'full_name' => 'Farhan Ramadhan',
                'email' => 'farhan.ramadhan@mail.com',
                'phone' => '085611223344',
                'current_company' => 'Freelance Web Developer',
                'current_title' => 'Junior Developer',
                'source' => 'Career Portal',
                'stage' => 'rejected',
                'rating' => 2,
                'rejection_reason' => 'Pengalaman arsitektur backend belum memenuhi standar minimum level Senior yang dibutuhkan saat ini.',
            ],
        ];

        foreach ($candidatesData as $data) {
            Candidate::firstOrCreate(
                [
                    'company_id' => $data['company_id'],
                    'email' => $data['email'],
                ],
                $data
            );
        }
    }
}

