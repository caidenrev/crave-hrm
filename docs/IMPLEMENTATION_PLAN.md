# SaaS HRM "Crave HRM" Implementation Plan & Sprint Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun SaaS Human Resource Management (HRM) "Crave HRM" lengkap dengan 9 modul inti + PWA berbasis Laravel 13, Inertia.js v2, React 19, Tailwind CSS v4, dan seluruh komponen Shadcn UI bergaya modern dashboard (Crave POS aesthetic) dengan target selesai sebelum 30 November 2026.

**Target Selesai:** 29 November 2026 (Go-Live Ready)  
**Spec Document:** [`docs/superpowers/specs/2026-11-10-hrm-saas-design.md`](file:///c:/xampp/htdocs/revan-laravel/docs/superpowers/specs/2026-11-10-hrm-saas-design.md)

---

## Tim Pengembang & Peran (Project Team)

| Nama | Peran | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Eka Revandi** | Lead Project & Lead Software Engineer | Arsitektur inti, Multi-company tenancy, skema database, security & audit log, engine kalkulasi PPh 21 TER & BPJS, code review, dan deployment |
| **Egi Witra Aditya** | Project Manager | Manajemen sprint, alokasi timeline, backlog grooming, pengujian UAT fungsional, kepatuhan regulasi, dan dokumentasi release |
| **Aufa** | Project Development | Implementasi modul fungsional, komponen UI React 19 / Shadcn, form validation, integrasi Inertia, alur interaksi pengguna |

*(Catatan: Kolom **PIC / Assignee** pada setiap task di bawah dapat diubah atau disesuaikan kapan saja oleh tim).*

---

## Ringkasan Jadwal Sprint (Deadline: < 30 November 2026)

```
[10 Nov - 16 Nov] SPRINT 1: Foundation, Design System, Multi-Company & Internal Mgmt
         │
         ▼
[17 Nov - 23 Nov] SPRINT 2: Smart Attendance, Holiday & Leave, Overtime/Visit, Canteen QR
         │
         ▼
[24 Nov - 29 Nov] SPRINT 3: Indonesian Payroll (PPh 21 TER & BPJS), Recruitment, 360 Review, PWA & Launch
```

---

## Global Constraints
* Framework & Version: PHP ^8.3, Laravel ^13.17, React ^19, Tailwind CSS ^4.
* Typography: Plus Jakarta Sans (`weights: 400, 500, 600, 700, 800, 900`).
* Primary Color: Royal Electric Indigo Blue `oklch(0.54 0.19 258)` / `#1B5CFE` pada canvas slate sejuk dan kartu putih `rounded-2xl` (24px).
* UI Components: Wajib menggunakan Shadcn UI untuk seluruh input, modal, dropdown, table, card, sidebar, sheet, tabs, sonner/toast via `npx shadcn@latest add --all`.
* Tenancy: Single portal di `hrm.craveservices.my.id`, semua query data dibatasi oleh `company_id` aktif dari session.
* PWA Attendance: Validasi lokasi via Geolocation GPS + Public IP Kantor (online-only).
* Compliance: PPh 21 TER 2024 (PP 58/2023), BPJS TK & Kesehatan, Lembur PP 35/2021 (1/173).

## Review Focus
1. **Multi-Company Data Leakage:** User tidak boleh bisa mengakses data karyawan/payroll perusahaan lain hanya dengan mengubah URL parameter (wajib Global Scope / Policy check `company_id`).
2. **Attendance Mock Location / Fake GPS:** Koordinat latitude & longitude wajib divalidasi keutuhan dan akurasinya di sisi server, serta verifikasi IP publik kantor.
3. **PPh 21 TER Edge Cases:** Karyawan dengan status PTKP berbeda (Kategori A, B, C) serta penghasilan di atas batas PTKP harus menghasilkan pemotongan pajak yang presisi sesuai tabel tarif resmi.
4. **Canteen QR Replay Attack:** Token QR voucher makan wajib memiliki kedaluwarsa waktu (dinamis 60 detik) dan berstatus *one-time use* (langsung invalid begitu discan).
5. **Approval Hierarchy Loop:** Alur persetujuan bertingkat tidak boleh mengalami kebuntuan (*deadlock*) jika posisi atasan langsung kosong (fallback otomatis ke HR Admin).

---

## 📂 Standar Struktur Direktori Proyek

```text
revan-laravel/
├── app/                               # 🐘 BACKEND (LARAVEL 13)
│   ├── Http/
│   │   ├── Controllers/               # Controller merender Inertia::render('Folder/Page', $props)
│   │   └── Middleware/                # EnsureActiveCompany.php, HandleInertiaRequests.php
│   ├── Models/                        # Eloquent models (Company, Employee, Attendance, Payroll, dll)
│   ├── Services/                      # Pph21TerCalculator, BpjsCalculator, AttendanceService, dll
│   └── Traits/                        # BelongsToCompany.php (Global Scope)
├── database/                          # Migrations & Seeders
├── docs/                              # PRD.md, IMPLEMENTATION_PLAN.md, SPRINT.md
├── resources/                         # ⚛️ FRONTEND (REACT 19 + SHADCN UI)
│   ├── css/app.css                    # Tailwind CSS v4 + Token OKLCH Crave POS
│   ├── js/
│   │   ├── app.jsx                    # Entry point Inertia React 19
│   │   ├── components/
│   │   │   ├── dashboard/             # AppShell.jsx, Sidebar.jsx, Header.jsx, CompanySwitcher.jsx
│   │   │   └── ui/                    # Seluruh komponen Shadcn UI (terpasang via npx shadcn add --all)
│   │   ├── layouts/                   # AuthenticatedLayout.jsx, GuestLayout.jsx
│   │   ├── lib/                       # utils.js (cn helper), formatters.js (Rupiah & Tanggal ID)
│   │   └── pages/                     # Halaman Inertia (Attendance/, Employees/, Payroll/, Leave/, dll)
│   └── views/app.blade.php            # Root blade template
└── routes/web.php                     # Route web aplikasi
```

---

# SPRINT 1: Foundation, Design System & Master Data (10 Nov – 16 Nov)
*Fokus: Membangun fondasi arsitektur, instalasi seluruh pustaka Shadcn, multi-company tenancy, master data organisasi & karyawan.*

### Task 1: Scaffolding Inertia React 19 & Styling Foundation
* **Sprint:** Sprint 1
* **Target Selesai:** 11 Nov 2026
* **PIC / Assignee:** Eka Revandi
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Modify: `composer.json`
* Modify: `package.json`
* Modify: `vite.config.js`
* Create: `resources/js/app.jsx`
* Create: `resources/views/app.blade.php`
* Modify: `resources/css/app.css`

- [x] **Step 1: Install Inertia Laravel package**
  Run: `composer require inertiajs/inertia-laravel`
- [x] **Step 2: Publish & register Inertia middleware**
  Run: `php artisan inertia:middleware` dan daftarkan `HandleInertiaRequests` di `bootstrap/app.php`
- [x] **Step 3: Setup Vite and Tailwind v4 with React plugin**
  Install `@vitejs/plugin-react`, `@inertiajs/react`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] **Step 4: Configure root view `resources/views/app.blade.php` and entry point `resources/js/app.jsx`**
  Pasang font Plus Jakarta Sans, `@viteReactRefresh`, `@vite(['resources/js/app.jsx', 'resources/css/app.css'])`, dan `@inertiaHead`
- [x] **Step 5: Verify Inertia rendering with test route**
  Run: `npm run build` untuk memverifikasi kompilasi clean.

---

### Task 2: Install Shadcn UI (All Components) & Theme Injection
* **Sprint:** Sprint 1
* **Target Selesai:** 12 Nov 2026
* **PIC / Assignee:** Eka Revandi
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `components.json`
* Create/Modify: `resources/js/lib/utils.js`
* Modify: `resources/css/app.css` (Injeksi OKLCH tokens, `--radius-2xl: 24px`, `--shadow-soft` dari Crave POS)
* Create: `resources/js/components/ui/*` (Button, Card, Dialog, Table, Input, Form, Select, Sheet, Tabs, Switch, Popover, DropdownMenu, Avatar, Badge, Tooltip, Calendar, Sonner, Command, dll)

- [x] **Step 1: Initialize Shadcn CLI**
  Run: `npx shadcn@latest init` (style: new-york, baseColor: slate, icon: lucide, cssVariables: true)
- [x] **Step 2: Install all Shadcn components**
  Run: `npx shadcn@latest add --all --yes`
- [x] **Step 3: Injeksi Design Tokens Crave POS ke `resources/css/app.css`**
  Pastikan variabel OKLCH primary `oklch(0.54 0.19 258)`, background slate, card radius 24px terpasang.
- [x] **Step 4: Verify all Shadcn components in Vite build**
  Run: `npm run build` untuk memastikan seluruh Radix primitives terbundel sempurna.

---

### Task 3: Database Multi-Company Core & Auth Middleware
* **Sprint:** Sprint 1
* **Target Selesai:** 13 Nov 2026
* **PIC / Assignee:** Eka Revandi
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_companies_and_branches_table.php`
* Create: `database/migrations/xxxx_xx_xx_create_company_user_table.php`
* Create: `app/Models/Company.php`, `Branch.php`
* Modify: `app/Models/User.php`
* Create: `app/Http/Middleware/EnsureActiveCompany.php`
* Create: `app/Traits/BelongsToCompany.php`

- [x] **Step 1: Write migration for companies, branches, and company_user pivot**
  Sertakan relasi `role` (super_admin, holding_admin, company_admin, branch_manager, finance, employee).
- [x] **Step 2: Implement `Company`, `Branch`, and `User` Eloquent relationships**
- [x] **Step 3: Implement `BelongsToCompany` Global Scope trait**
  Otomatis menerapkan filter `where('company_id', session('active_company_id'))` untuk setiap query data tenant.
- [x] **Step 4: Implement `EnsureActiveCompany` middleware**
- [x] **Step 5: Run migration and verify isolation test**
  Run: `php artisan migrate` dan lolos uji `php artisan test --filter MultiCompanyTest`

---

### Task 4: Master Dashboard Shell (AppShell & SideNav Crave Style)
* **Sprint:** Sprint 1
* **Target Selesai:** 14 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi

**Files:**
* Create: `resources/js/layouts/AuthenticatedLayout.jsx`
* Create: `resources/js/components/dashboard/Sidebar.jsx` (Dual-state `w-72`/`w-20`, menu search, accordion, badge counter)
* Create: `resources/js/components/dashboard/Header.jsx` (Sticky, backdrop-blur, global search bar `w-64 rounded-xl`, notifications, avatar)
* Create: `resources/js/components/dashboard/CompanySwitcher.jsx` (Dropdown switch anak perusahaan)
* Create: `resources/js/components/dashboard/MobileBottomNav.jsx` (PWA mobile navigation)
* Create: `resources/js/pages/Dashboard.jsx` (Hero KPI card kontras + sub-cards)

- [x] **Step 1: Build `CompanySwitcher` component with instant Inertia post**
- [x] **Step 2: Build `Sidebar` collapsible component matching Crave POS `SideNav`**
- [x] **Step 3: Build `Header` component with sticky backdrop-blur and notifications popover**
- [x] **Step 4: Build `MobileBottomNav` for PWA mobile layout**
- [x] **Step 5: Build `Dashboard.jsx` with Hero KPI Cards & Metric charts**
  Run: `npm run build` berhasil 100% tanpa error.

---

### Task 5: Master Data Karyawan, Organisasi & RBAC Matrix
* **Sprint:** Sprint 1
* **Target Selesai:** 15 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi & Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_departments_and_designations_table.php`
* Create: `database/migrations/xxxx_xx_xx_create_employees_table.php`
* Create: `app/Models/Department.php`, `Designation.php`, `Employee.php`
* Create: `app/Http/Controllers/EmployeeController.php`
* Create: `resources/js/pages/Employees/Index.jsx` (Tabel stacked info + avatar + Shadcn Switch toggle aktif/nonaktif)
* Create: `resources/js/pages/Employees/EmployeeSheet.jsx` (Detail slide-over drawer)
* Create: `resources/js/pages/Organization/RbacMatrix.jsx` (Matriks izin peran Crave style)

- [x] **Step 1: Write migrations for departments, designations, and employees**
- [x] **Step 2: Build `EmployeeController` with validation and avatar upload**
- [x] **Step 3: Build `Employees/Index.jsx` with stacked 2-row cell and active switch toggle**
- [x] **Step 4: Build `RbacMatrix.jsx` visual grid table (Roles vs Permissions)**
- [x] **Step 5: Test Employee CRUD and instant status switch**
  Run: `php artisan test --filter EmployeeManagementTest` lolos 100% (5 test, 50 assertions).

---

### Task 6: Pengumuman Internal & Kalender Hari Libur
* **Sprint:** Sprint 1
* **Target Selesai:** 16 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_announcements_and_holidays_table.php`
* Create: `app/Models/Announcement.php`, `Holiday.php`
* Create: `app/Http/Controllers/AnnouncementController.php`, `HolidayController.php`
* Create: `resources/js/pages/Announcements/Index.jsx`
* Create: `resources/js/pages/Calendar/HolidayCalendar.jsx`

- [ ] **Step 1: Create migrations and models for announcements & holidays**
- [ ] **Step 2: Build controllers with company scoping**
- [ ] **Step 3: Build Announcement feed card and Holiday calendar view**
- [ ] **Step 4: Checkpoint Sprint 1 Review & Demo bersama PM (Egi Witra)**

---

# SPRINT 2: Operational Core (17 Nov – 23 Nov)
*Fokus: Smart Attendance GPS, Izin/Cuti bertingkat, Reimbursement & Lembur PP 35/2021, Kolabo Canteen QR.*

### Task 7: Smart Attendance System (GPS Geofence + IP + Selfie)
* **Sprint:** Sprint 2
* **Target Selesai:** 18 Nov 2026
* **PIC / Assignee:** Eka Revandi (Engine & Geofence) & Aufa (Kamera & UI)
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_shifts_and_attendances_table.php`
* Create: `app/Models/Shift.php`, `Attendance.php`
* Create: `app/Services/AttendanceService.php` (Formula Haversine GPS, Whitelist IP, Kalkulasi Telat)
* Create: `app/Http/Controllers/AttendanceController.php`
* Create: `resources/js/pages/Attendance/CheckIn.jsx` (Webcam selfie, GPS indicator, status badge)
* Create: `resources/js/pages/Attendance/Report.jsx` (Monitoring harian HR & Approval koreksi)

- [ ] **Step 1: Write migrations for shifts and attendances**
- [ ] **Step 2: Implement `AttendanceService` haversine distance algorithm & IP whitelist check**
- [ ] **Step 3: Build `CheckIn.jsx` mobile-optimized UI with live camera preview**
- [ ] **Step 4: Build HR Attendance monitoring table with filter date, branch, and shift**
- [ ] **Step 5: Test geofence acceptance within radius and rejection outside radius**

---

### Task 8: Holiday & Leave Management
* **Sprint:** Sprint 2
* **Target Selesai:** 20 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi & Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_leave_types_and_leave_requests_table.php`
* Create: `app/Models/LeaveType.php`, `LeaveRequest.php`
* Create: `app/Http/Controllers/LeaveRequestController.php`
* Create: `resources/js/pages/Leave/Index.jsx`
* Create: `resources/js/pages/Leave/Apply.jsx` (Date range picker, kuota cuti counter, upload surat dokter)

- [ ] **Step 1: Write migrations for leave types and requests**
- [ ] **Step 2: Implement balance deduction and sequential approval (Supervisor -> HR)**
- [ ] **Step 3: Build employee leave request form with file upload**
- [ ] **Step 4: Build supervisor/HR approval action modal**
- [ ] **Step 5: Test leave submission, approval chain, and quota deduction**

---

### Task 9: Reimbursement, Overtime & Visit Lapangan
* **Sprint:** Sprint 2
* **Target Selesai:** 21 Nov 2026
* **PIC / Assignee:** Aufa (Forms & Views) & Eka Revandi (Overtime Calculator)
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_reimbursements_and_overtimes_table.php`
* Create: `app/Models/Reimbursement.php`, `Overtime.php`, `Visit.php`
* Create: `app/Services/OvertimeCalculatorService.php` (PP 35/2021 formula 1/173)
* Create: `app/Http/Controllers/ClaimController.php`
* Create: `resources/js/pages/Claims/Reimbursement.jsx`
* Create: `resources/js/pages/Claims/Overtime.jsx`
* Create: `resources/js/pages/Claims/Visit.jsx`

- [ ] **Step 1: Create migrations for reimbursements, SPKL overtime, and client visits**
- [ ] **Step 2: Implement PP 35/2021 overtime formula in `OvertimeCalculatorService`**
- [ ] **Step 3: Build claim forms with receipt upload preview and visit GPS geotagging**
- [ ] **Step 4: Build claim approval inbox and monthly recapitulation table**
- [ ] **Step 5: Verify calculation of 1.5x and 2x overtime rates**

---

### Task 10: Crave Canteen (Dynamic QR Code & Merchant Scanner)
* **Sprint:** Sprint 2
* **Target Selesai:** 23 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi & Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_canteen_vouchers_table.php`
* Create: `app/Models/CanteenVoucher.php`, `CanteenVendor.php`
* Create: `app/Http/Controllers/CanteenController.php`
* Create: `resources/js/pages/Canteen/VoucherCard.jsx` (QR code dinamis dengan 60s countdown timer)
* Create: `resources/js/pages/Canteen/Scanner.jsx` (Antarmuka scanner kasir kantin berbasis kamera)
* Create: `resources/js/pages/Canteen/Reports.jsx` (Rekapitulasi tagihan vendor katering)

- [ ] **Step 1: Write migrations for canteen vendors and voucher transactions**
- [ ] **Step 2: Implement encrypted token generator (60s TTL) and one-time redemption check**
- [ ] **Step 3: Build employee voucher card with live animated countdown**
- [ ] **Step 4: Build merchant scanner interface using HTML5 QR scanner**
- [ ] **Step 5: Checkpoint Sprint 2 Review & UAT Demo bersama PM (Egi Witra)**

---

# SPRINT 3: Payroll Compliance, Recruitment, 360 Review & PWA Launch (24 Nov – 29 Nov)
*Fokus: Mesin penggajian Indonesia PPh 21 TER & BPJS, Slip Gaji, Ekspor Bank, E-Recruitment ATS, 360 Review, PWA packaging & Go-Live.*

### Task 11: Payroll Management (PPh 21 TER, BPJS, Slip PDF & Bank Batch)
* **Sprint:** Sprint 3
* **Target Selesai:** 25 Nov 2026
* **PIC / Assignee:** Eka Revandi
* **Reviewer / QA:** Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_payrolls_and_components_table.php`
* Create: `app/Models/Payroll.php`, `SalaryComponent.php`
* Create: `app/Services/Pph21TerCalculator.php` (Lookup tabel resmi TER Kategori A, B, C)
* Create: `app/Services/BpjsCalculator.php` (Kesehatan & Ketenagakerjaan split)
* Create: `app/Services/BankExportService.php` (BCA, Mandiri, BRI, BNI formatters)
* Create: `app/Http/Controllers/PayrollController.php`
* Create: `resources/js/pages/Payroll/Index.jsx`
* Create: `resources/js/pages/Payroll/Generate.jsx`
* Create: `resources/js/pages/Payroll/PayslipModal.jsx` (Pratinjau & Download PDF)

- [ ] **Step 1: Write migrations for payroll runs and payroll items**
- [ ] **Step 2: Implement `Pph21TerCalculator` based on official 2024 monthly TER tables**
- [ ] **Step 3: Implement `BpjsCalculator` with employer & employee split rates**
- [ ] **Step 4: Build automated payroll batch generation runner**
- [ ] **Step 5: Build Payslip PDF generation using DomPDF with company letterhead**
- [ ] **Step 6: Build Bank Export service generating downloadable CSV/TXT for BCA, Mandiri, BRI, BNI**
- [ ] **Step 7: Verify payroll calculation matches manual tax & BPJS benchmark**

---

### Task 12: Crave E-Recruitment (Career Portal & ATS Kanban)
* **Sprint:** Sprint 3
* **Target Selesai:** 26 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi & Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_job_postings_and_candidates_table.php`
* Create: `app/Models/JobPosting.php`, `Candidate.php`
* Create: `app/Http/Controllers/RecruitmentController.php`
* Create: `resources/js/pages/Career/PublicPortal.jsx` (Portal lowongan kerja publik)
* Create: `resources/js/pages/Recruitment/KanbanBoard.jsx` (Drag-and-drop / stage pipeline)
* Create: `resources/js/pages/Recruitment/CandidateDetail.jsx` (Scorecard & e-offering)

- [ ] **Step 1: Write migrations for job vacancies and applicant stages**
- [ ] **Step 2: Build public career portal page (accessible without login)**
- [ ] **Step 3: Build ATS Kanban Board with stages (Applied, Screening, Interview, Offering, Hired)**
- [ ] **Step 4: Implement "Convert to Employee" button transferring hired candidate to employees table**
- [ ] **Step 5: Test candidate application, stage transition, and employee onboarding**

---

### Task 13: 360 Performance Review (Radar Chart Recharts)
* **Sprint:** Sprint 3
* **Target Selesai:** 27 Nov 2026
* **PIC / Assignee:** Aufa
* **Reviewer / QA:** Eka Revandi & Egi Witra Aditya

**Files:**
* Create: `database/migrations/xxxx_xx_xx_create_performance_reviews_table.php`
* Create: `app/Models/PerformanceReview.php`, `ReviewItem.php`
* Create: `app/Http/Controllers/PerformanceReviewController.php`
* Create: `resources/js/pages/Performance/Index.jsx`
* Create: `resources/js/pages/Performance/Evaluate.jsx` (Likert 1-5 questionnaire)
* Create: `resources/js/pages/Performance/ReportRadar.jsx` (Recharts spider chart)

- [ ] **Step 1: Write migrations for review cycles, questions, and responses**
- [ ] **Step 2: Implement review invitation and score aggregator**
- [ ] **Step 3: Build evaluation form with Likert scale and qualitative comments**
- [ ] **Step 4: Build Radar Chart report comparing Self vs Peer vs Supervisor scores using Recharts**
- [ ] **Step 5: Verify scoring aggregation and chart rendering**

---

### Task 14: PWA Packaging, Device Session Security & Final Launch
* **Sprint:** Sprint 3
* **Target Selesai:** 28–29 Nov 2026 (Go-Live Ready)
* **PIC / Assignee:** Eka Revandi & Aufa
* **Reviewer / QA:** Egi Witra Aditya (Final UAT Sign-off)

**Files:**
* Modify: `vite.config.js`
* Create: `public/manifest.json`
* Create: `public/icons/*` (PWA icons 192x192, 512x512)
* Create: `resources/js/components/PwaInstallPrompt.jsx`
* Create: `resources/js/components/dashboard/DeviceSessions.jsx` (Pelacak sesi login aktif)

- [ ] **Step 1: Configure `vite-plugin-pwa` in `vite.config.js` with Workbox caching**
- [ ] **Step 2: Create Web App Manifest with Crave HRM branding and theme color `#1B5CFE`**
- [ ] **Step 3: Build `DeviceSessions.jsx` widget (OS, Browser, IP, tombol Revoke Sesi)**
- [ ] **Step 4: Build PWA install prompt banner for mobile and desktop**
- [ ] **Step 5: Run full production build (`npm run build`) and final UAT sign-off with Egi Witra**
