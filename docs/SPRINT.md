# 📅 SPRINT ROADMAP & WORK BREAKDOWN
## SaaS HRM "Crave HRM"
*Target Rilis: Sebelum 30 November 2026 (Target Go-Live: 29 November 2026)*

---

## 👥 Tim & Tanggung Jawab (RACI)

| Nama | Peran | Fokus Utama | Skills Rekomendasi Utama |
| :--- | :--- | :--- | :--- |
| **Eka Revandi** | Lead Project & Lead Software Engineer | Core Architecture, Multi-Company Tenancy, Security, Engine PPh 21 TER & BPJS, Code Review & Deployment | `security-and-hardening`, `test-driven-development`, `performance-optimization` |
| **Egi Witra Aditya** | Project Manager | Sprint Tracking, Backlog Priority, QA / UAT Verification, Compliance & Delivery Sign-off | `verification-before-completion`, `code-review-and-quality` |
| **Aufa** | Project Development | Full-Stack Features, React 19 / Shadcn UI Components, Form Validation, Module Flows | `impeccable`, `frontend-ui-engineering`, `antislop-ui`, `antislop-code` |

*(Catatan: Kolom **PIC** dan status checkbox `[ ]` dapat diperbarui langsung oleh tim setiap kali ada progres harian).*

---

## 🛠️ Pemetaan Skills Populer & Efektif per Kategori Task

Berikut adalah skills terbaik yang terpasang di sistem dan siap diaktifkan sesuai kebutuhan task:

1. **Crafting UI & Dashboard Modern (Aufa):**
   * `impeccable`: Menghasilkan UI level *award-winning*, menjaga hirarki visual, konsistensi token Crave POS, dan transisi halus tanpa rasa *generic template*.
   * `frontend-ui-engineering`: Membangun komponen React 19 yang kokoh, modular, aksesibel (WCAG), dan minim re-render.
   * `antislop-ui` & `antislop-layoutmobile`: Mengamankan kontras warna, tap-target jempol di PWA mobile, dan layout grid yang responsif mulus.
2. **Keamanan & Tenancy Multi-Company (Eka Revandi):**
   * `security-and-hardening`: Mencegah kebocoran data antar tenant (*cross-tenant leakage*), mengamankan session context, enkripsi NIK/gaji, dan proteksi CSRF/XSS.
   * `api-and-interface-design`: Memastikan kontrak props Inertia antara Controller Laravel dan komponen React bersih dan stabil.
3. **Kalkulasi Kritis Presisi 100% (Eka Revandi):**
   * `test-driven-development`: Dipakai wajib pada kalkulator PPh 21 TER, kalkulator BPJS, dan formula lembur PP 35/2021. Menulis *automated tests* terlebih dahulu untuk menjamin 0% kesalahan hitungan nominal uang & pajak.
4. **Optimasi Kueri & Database (Eka Revandi & Aufa):**
   * `performance-optimization`: Mencegah masalah *N+1 query* pada data absensi massal dan rekapitulasi penggajian ratusan karyawan.
5. **Quality Gate & UAT Sign-Off (Egi Witra Aditya):**
   * `verification-before-completion`: Menjamin setiap task hanya boleh dicentang selesai setelah ada bukti konkret (hasil `php artisan test` hijau, build Vite sukses tanpa error).
   * `code-review-and-quality`: Melakukan review menyeluruh sebelum gerbang sprint dinyatakan lulus.

---

## 🧭 Ringkasan Jadwal Sprint

```
[10 Nov - 16 Nov 2026] SPRINT 1: Foundation, Design System, Multi-Company & Internal Mgmt
         │
         ▼
[17 Nov - 23 Nov 2026] SPRINT 2: Smart Attendance, Holiday & Leave, Overtime/Visit, Canteen QR
         │
         ▼
[24 Nov - 29 Nov 2026] SPRINT 3: Indonesian Payroll (PPh 21 TER & BPJS), Recruitment, 360 Review, PWA & Launch
```

---

# 🚀 SPRINT 1: Foundation, Design System & Master Data
**Periode:** 10 November – 16 November 2026  
**Target:** Scaffolding Inertia React 19, instalasi seluruh pustaka Shadcn UI, tema Crave POS, multi-company tenancy, master data organisasi & karyawan.

### Task 1: Scaffolding Inertia React 19 & Styling Foundation
* **Target Selesai:** 11 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Install package Inertia Laravel (`composer require inertiajs/inertia-laravel`)
- [x] Publish & daftarkan middleware `HandleInertiaRequests` di `bootstrap/app.php`
- [x] Install dependencies frontend: `@vitejs/plugin-react`, `@inertiajs/react`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] Konfigurasi `resources/views/app.blade.php`, font Plus Jakarta Sans, dan entry point `resources/js/app.jsx`
- [x] Verifikasi build awal dengan `npm run build`

### Task 2: Install Shadcn UI (All Components) & Theme Injection
* **Target Selesai:** 12 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `impeccable`, `antislop-ui`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Inisialisasi konfigurasi Shadcn UI (`components.json`, style: new-york, baseColor: slate)
- [x] Install seluruh komponen Shadcn UI via `npx shadcn@latest add --all --yes`
- [x] Injeksi token desain Crave POS ke `resources/css/app.css` (OKLCH primary, canvas slate, card radius 24px, soft shadow)
- [x] Verifikasi seluruh komponen Radix primitives dan utils terkompilasi bersih di Vite

### Task 3: Database Multi-Company Core & Auth Middleware
* **Target Selesai:** 13 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `security-and-hardening`, `api-and-interface-design`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Migrasi database: `companies`, `branches`, dan `company_user` pivot (dengan role per company)
- [x] Model Eloquent & Relasi: `Company`, `Branch`, `User`
- [x] Buat Trait `BelongsToCompany` (Global Scope filter `company_id` otomatis dari session aktif)
- [x] Middleware `EnsureActiveCompany` (validasi konteks perusahaan aktif)
- [x] Migrasi dan uji isolasi data antar perusahaan (Lolos uji `MultiCompanyTest`)

### Task 4: Master Dashboard Shell (AppShell & SideNav Crave Style)
* **Target Selesai:** 14 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `impeccable`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Buat komponen `CompanySwitcher` (dropdown switch anak perusahaan / holding)
- [x] Buat `Sidebar` dual-state (`w-72` expand / `w-20` collapse) dengan menu search, section divider, dan counter badge
- [x] Buat `Header` sticky dengan backdrop-blur, global search bar `w-64 rounded-xl`, notifikasi, dan avatar profil
- [x] Buat `MobileBottomNav` untuk navigasi sentuh PWA ponsel
- [x] Buat halaman `Dashboard.jsx` dengan Hero KPI Card kontras dan chart metrik (Lolos kompilasi build Vite)

### Task 5: Master Data Karyawan, Organisasi & Matriks RBAC
* **Target Selesai:** 15 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`, `security-and-hardening`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Migrasi tabel `departments`, `designations`, dan `employees` (dengan multi-tenant `company_id`)
- [x] Controller CRUD karyawan dengan validasi data pribadi, pajak PTKP, rekening bank, dan filter pencarian
- [x] Halaman `Employees/Index.jsx` dengan format stacked info 2 baris dan **Shadcn Switch** toggle aktif/nonaktif
- [x] Halaman slide-over sheet detail profil karyawan (`EmployeeSheet.jsx`) & modal form (`EmployeeFormModal.jsx`)
- [x] Halaman visual grid Matriks Izin Peran (`RbacMatrix.jsx`) 5 peran x modul operasional
- [x] Automated tests: `EmployeeManagementTest.php` (5 test lolos, 50 assertions, zero tenant data leakage)

### Task 6: Pengumuman Internal, Kalender Hari Libur, Cabang & Org Chart
* **Target Selesai:** 16 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`, `security-and-hardening`
* **Status:** `[x] Selesai (12 Nov 2026)`
> 📌 *Referensi Peta Menu & Route:* Lihat tabel di [`docs/PRD.md`](PRD.md) Section 4.2 agar setiap file halaman terhubung tepat ke submenu di `Sidebar.jsx`.
- [x] Migrasi tabel `announcements` dan `holidays`
- [x] Controller pengumuman internal (`/announcements` -> `Announcements/Index.jsx`) & sinkronisasi hari libur nasional SKB 3 Menteri (`/calendar` -> `Calendar/HolidayCalendar.jsx`)
- [x] Halaman **Cabang & Geofence** (`/organization/branches` -> `Organization/Branches.jsx`) untuk input koordinat Lat/Lng, radius geofence, & whitelist IP kantor (prasyarat Task 7)
- [x] Halaman **Struktur Organisasi / Org Chart** (`/organization/chart` -> `Organization/OrgChart.jsx`)
- [x] **Gerbang Evaluasi QA Sprint 1:** UAT Sign-off isolasi multi-company dan master data oleh Eka Revandi (Lead) & Egi Witra Aditya (`verification-before-completion`) - 17 PHPUnit tests lolos (100% Green), Vite build sukses tanpa error.

---

# ⚡ SPRINT 2: Operational Core (Presensi, Cuti, Lembur & Kantin)
**Periode:** 17 November – 23 November 2026  
**Target:** Smart Attendance GPS & Shift, Izin/Cuti alur bertingkat, Reimbursement & Lembur PP 35/2021, Crave Canteen QR dinamis.

### Task 7: Smart Attendance System (GPS Geofence + IP + Kamera Selfie + Shift)
* **Target Selesai:** 18 November 2026
* **PIC:** Eka Revandi (Service & Geofence) & Aufa (Kamera, Shift & UI)
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `test-driven-development`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[x] Selesai (14 Nov 2026)`
- [x] Migrasi tabel `shifts` dan `attendances`
- [x] Implementasi `AttendanceService` (rumus Haversine radius kantor, IP whitelist kantor, kalkulasi menit keterlambatan)
- [x] Submenu **Presensi Harian** (`/attendance` -> `Attendance/CheckIn.jsx`) mobile-optimized dengan live GPS indicator & kamera selfie preview
- [x] Submenu **Jadwal & Shift** (`/attendance/shifts` -> `Attendance/Shifts.jsx`) untuk shift reguler, berputar, fleksibel, & tukar shift
- [x] Submenu **Rekap Kehadiran** (`/attendance/recap` -> `Attendance/Report.jsx`) dashboard HR monitoring harian dengan filter tanggal, cabang, dan shift
- [x] Uji validasi: Lolos di dalam radius geofence dan tolak otomatis jika di luar radius (9 automated tests passed, 53 assertions)

### Task 8: Holiday & Leave Management
* **Target Selesai:** 20 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`, `test-driven-development`
* **Status:** `[x] Selesai (15 Nov 2026)`
- [x] Migrasi tabel `leave_types`, `leave_balances`, dan `leave_requests`
- [x] Logika alokasi saldo cuti tahunan dan alur approval berjenjang (Karyawan -> Atasan Langsung -> HR)
- [x] Submenu **Cuti & Izin Saya** (`/leave` -> `Leave/Index.jsx`) form pengajuan cuti dengan date range picker & upload surat dokter
- [x] Submenu **Persetujuan Cuti** (`/leave/approvals` -> `Leave/Approvals.jsx`) antrean persetujuan / penolakan untuk atasan & HR
- [x] Integrasi visual cuti tim satu departemen pada submenu **Kalender & Libur** (`/calendar` -> `Calendar/HolidayCalendar.jsx`)
- [x] Uji potongan kuota cuti otomatis setelah persetujuan final (9 automated tests passed, 39 assertions)

### Task 9: Reimbursement, Overtime PP 35/2021 & Visit Lapangan
* **Target Selesai:** 21 November 2026
* **PIC:** Aufa (Form & View) & Eka Revandi (Kalkulator Lembur)
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `test-driven-development`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[x] Selesai (15 Nov 2026)`
- [x] Migrasi tabel `reimbursements`, `overtimes` (SPKL), dan `visits`
- [x] Implementasi formula lembur resmi Depnaker PP 35/2021 (pengali upah 1/173) di `OvertimeCalculatorService`
- [x] Submenu **Lembur (SPKL)** (`/claims/overtime` -> `Claims/Overtime.jsx`)
- [x] Submenu **Reimbursement** (`/claims/reimbursement` -> `Claims/Reimbursement.jsx`) dengan upload pratinjau struk/kuitansi
- [x] Submenu **Tugas Lapangan / Visit** (`/claims/visit` -> `Claims/Visit.jsx`) dengan geotagging GPS & swafoto di lokasi klien
- [x] Uji coba hitungan pengali lembur 1.5x dan 2x (7 automated tests passed, 32 assertions, 100% Green)

### Task 10: Crave Canteen (Dynamic QR Code 60s & Merchant Scanner)
* **Target Selesai:** 23 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `security-and-hardening`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[x] Selesai (15 Nov 2026)`
- [x] Migrasi tabel `canteen_vendors` dan `canteen_vouchers`
- [x] Implementasi generator QR Code token dinamis terenkripsi dengan TTL 60 detik (*one-time use*)
- [x] Submenu **Voucher QR Saya** (`/canteen` -> `Canteen/VoucherCard.jsx`) dengan animasi countdown timer
- [x] Submenu **Scanner Merchant** (`/canteen/scanner` -> `Canteen/Scanner.jsx`) menggunakan kamera pemindai barcode/QR
- [x] Submenu **Rekonsiliasi Vendor** (`/canteen/settlement` -> `Canteen/Reports.jsx`) rekapitulasi porsi makan bulanan untuk tagihan katering
- [x] Filter visibilitas submenu Sidebar berbasis RBAC (menu kasir/admin disembunyikan untuk `employee`)
- [x] **Gerbang Evaluasi QA Sprint 2:** Sign-off arsitektur & fitur operasional oleh Eka Revandi (Lead) & Egi Witra Aditya (PM) (`verification-before-completion`) - 51 PHPUnit tests lolos (100% Green), build Vite sukses tanpa error (3,087 modul dalam 1.77s). Seluruh target Sprint 2 rampung 100%!

---

# 🎯 SPRINT 3: Payroll Compliance, Recruitment, 360 Review & PWA Launch
**Periode:** 24 November – 29 November 2026  
**Target:** Mesin penggajian Indonesia PPh 21 TER & BPJS, Slip PDF, Ekspor Bank, E-Recruitment ATS, 360 Review, PWA packaging, dan Go-Live.

### Task 11: Payroll Management (PPh 21 TER, BPJS, Slip PDF & Bank Batch)
* **Target Selesai:** 25 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `test-driven-development`, `performance-optimization`, `security-and-hardening`
* **Status:** `[x] Selesai (15 Nov 2026)`
- [x] Migrasi tabel `payrolls` dan `salary_components`
- [x] Implementasi `Pph21TerCalculator` sesuai tabel resmi 2024 (Kategori TER A, B, C)
- [x] Implementasi `BpjsCalculator` (Kesehatan 4%:1%, JKK, JKM, JHT 3.7%:2%, JP 2%:1%)
- [x] Submenu **Proses Payroll** (`/payroll` -> `Payroll/Index.jsx`) runner otomatisasi penggajian bulanan perusahaan
- [x] Submenu **Slip Gaji** (`/payroll/slips` -> `Payroll/Slips.jsx` & `PayslipModal.jsx`) generator Slip Gaji PDF via DomPDF / print-ready view berlogo perusahaan & opsi proteksi sandi
- [x] Submenu **Ekspor Bank & Rekap** (`/payroll/export` -> `Payroll/Export.jsx`) layanan ekspor file batch bank corporate internet banking (BCA, Mandiri, BRI, BNI) & Excel
- [x] Uji presisi perhitungan pajak da  n BPJS terhadap tabel simulasi pemerintah (8 automated tests passed, 46 assertions, 100% Green)

### Task 12: Crave E-Recruitment (Career Portal Publik & ATS Kanban)
* **Target Selesai:** 26 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`, `impeccable`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `job_postings` dan `candidates`
- [ ] Halaman portal karir publik terintegrasi daftar lowongan aktif
- [ ] Papan Kanban ATS interaktif (*Applied -> Screening -> Interview -> Offering -> Hired*)
- [ ] Tombol aksi "Konversi ke Karyawan" (transfer data kandidat langsung ke tabel karyawan)
- [ ] Uji coba flow pelamar dari daftar hingga di-onboard menjadi akun karyawan

### Task 13: 360 Performance Review (Radar Chart Recharts)
* **Target Selesai:** 27 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel siklus evaluasi, kuesioner, dan nilai responden
- [ ] Form kuesioner skala Likert 1–5 untuk 4 rater (Self, Atasan, Rekan, Bawahan)
- [ ] Visualisasi Spider/Radar Chart menggunakan Recharts untuk membandingkan skor evaluator
- [ ] Ringkasan skor KPI dan rekomendasi promosi/evaluasi karyawan

### Task 14: PWA Packaging, Device Session Security & Final Launch Ready
* **Target Selesai:** 28–29 November 2026
* **PIC:** Eka Revandi & Aufa
* **Reviewer:** Eka Revandi (Lead Project Sign-off) & Egi Witra Aditya (PM Delivery Sign-off)
* **Skill Rekomendasi:** `performance-optimization`, `antislop-layoutmobile`, `verification-before-completion`
* **Status:** `[ ] Pending`
- [ ] Konfigurasi `vite-plugin-pwa` dan Service Worker caching
- [ ] Buat file `manifest.json` Crave HRM dengan tema `#1B5CFE`
- [ ] Buat halaman keamanan sesi login aktif (`/sessions` -> `Profile/DeviceSessions.jsx`, ditautkan dari dropdown profil Header & Footer Sidebar)
- [ ] Banner prompt install PWA otomatis di desktop & mobile
- [ ] Kompilasi build final produksi (`npm run build`)
- [ ] **Final UAT & Go-Live Sign-off:** Verifikasi kelayakan rilis sebelum 30 November oleh Eka Revandi (Lead) & Egi Witra Aditya (PM)

---

## 📝 Catatan Progres Harian (Daily Standup Log)

| Tanggal | Aktivitas / Progres | Kendala / Blocker | Status |
| :--- | :--- | :--- | :--- |
| **10 Nov 2026** | Finalisasi PRD, Desain Tokens Crave POS, dan Penyusunan Roadmap Sprint | - | `Selesai` |
| **10 Nov 2026** | **Task 1 & Task 2 Selesai:** Scaffolding Inertia React 19, Tailwind CSS v4, Plus Jakarta Sans, dan seluruh komponen Shadcn UI terinstal (582 modul terkompilasi dalam 1.39s) | - | `Selesai` |
| **10 Nov 2026** | **Task 3 Selesai:** Migrasi Multi-Company, relasi User-Company pivot, `BelongsToCompany` trait, `EnsureActiveCompany` middleware, seeding holding/subsidiaries, lolos uji otomatis `MultiCompanyTest` | - | `Selesai` |
| **10 Nov 2026** | **Task 4 Selesai:** Master Dashboard Shell (`AuthenticatedLayout`, `Sidebar` dual-state, `Header`, `CompanySwitcher`, `MobileBottomNav`, `Dashboard.jsx` Hero KPI Card), build Vite 100% sukses | - | `Selesai` |
| **10 Nov 2026** | **Task 5 Selesai:** Master Data Karyawan, Organisasi & Matriks RBAC (`EmployeeController`, `Employees/Index.jsx` dengan Shadcn Switch toggle, `EmployeeSheet.jsx`, `RbacMatrix.jsx`, seeder realistis), 5 unit/feature tests lolos (50 assertions) | - | `Selesai` |
| **10 Nov 2026** | **UI/UX Audit & Refactor (Crave POS 100% Parity):** Audit visual terhadap folder `crave-pos-dashboard`, pembersihan menyeluruh elemen AI-slop (menghapus gradient pelangi & badge berlebihan), integrasi aset brand asli (`light-mode-logo.png`, `dark-mode-logo.png`, `profile-logo.jpeg`), penyesuaian layout 2-kolom `karyawan.tsx` dan stat cards `dashboard.tsx`. Kompilasi 3,062 modul lolos, 9 tests PHPUnit hijau (57 assertions) | - | `Selesai` |
| **12 Nov 2026** | **Arsitektur SideMenu Dropdown & Sinkronisasi Docs (Lead Update):** Backup `Sidebar.jsx.bak`, implementasi 6 grup dropdown accordion persis pola Crave POS (`Presensi`, `Cuti & Libur`, `Klaim & Lembur`, `Crave Canteen`, `Payroll Management`, `Organisasi & Akses`), pemetaan lengkap tabel Route -> Page React di `PRD.md` Section 4.2, serta pembaruan PR halaman baru di `IMPLEMENTATION_PLAN.md` & `SPRINT.md`. Build Vite & 9 PHPUnit tests lolos 100%. | - | `Selesai` |
| **12 Nov 2026** | **Task 6 Selesai (Penutup Sprint 1 & Gate Evaluasi QA Sukses):** Migrasi & Seeder Pengumuman Internal & Kalender SKB 3 Menteri, Controllers (Announcement, Holiday, Branch), 4 Halaman React 19 (Announcements, Calendar, Branches, OrgChart) sesuai Crave POS tokens, 16 PHPUnit tests lolos (95 assertions), Vite build sukses tanpa error. Seluruh target Sprint 1 rampung 100%! | - | `Selesai` |
| **12 Nov 2026** | **Final Refinement & Anti-Slop Overhaul (Branch `task-6-internal-org`):** Implementasi komponen reusable `ViewToggle` (List & Card View) pada Karyawan, Pengumuman, dan Cabang. Normalisasi focus/hover (menghilangkan ring 3px tebal AI-slop pada `<Input>` & `<Tabs>`), perapihan tombol close `(X)` & `Edit` pada Sheet detail karyawan, foto profil riil + fallback inisial, pita PIN solid tanpa gradasi pada pengumuman dengan aksi langsung (tanpa titik tiga di Card View), layout cabang anti-truncate, perbaikan Hero Card Struktur Organisasi, aktivasi Company Switcher multi-company & Quick Module Search di Header. Build Vite sukses (3,069 modul) & 16 PHPUnit tests lolos (95 assertions). | - | `Selesai` |
| **12 Nov 2026** | **UI/UX Polish Pass 2 (Pill Filter Contrast, Modal Konfirmasi & Layout Stacking):** (1) Mode Card Karyawan diubah menjadi layout vertikal stacked (Karyawan di atas, Matriks Izin Peran di bawah dengan grid responsif lapang `xl:grid-cols-4`), (2) Integrasi `AvatarImage` pada `EmployeeSheet` agar foto profil konsisten dengan Card/List, (3) Tombol filter status & kategori (Karyawan, Pengumuman, ViewToggle) diselaraskan ke tema pill Light/Dark toggle Sidebar (`bg-muted rounded-full p-1` dengan kontras tinggi), (4) Penghapusan search bar ganda di `OrgChart.jsx` sehingga bersih mengacu pada Header search, (5) Pembuatan komponen reusable `ConfirmDeleteDialog.jsx` berbasis Shadcn `AlertDialog` dan diintegrasikan pada Pengumuman, Cabang, dan Karyawan. Build Vite 100% lolos (3,070 modul dalam 3.89s) & 16 PHPUnit tests lulus (95 assertions). | - | `Selesai` |
| **12 Nov 2026** | **Header Space Optimization & Mobile Navigation Drawer Overhaul:** (1) Perbaikan pemotongan teks judul header dengan compact avatar profile `size-9`, search bar expandable `w-40 md:w-48 lg:w-56 focus:w-64`, dan pemindahan kontrol filter (Tahun di Kalender, ViewToggle di Cabang) ke toolbar halaman masing-masing, (2) Sentralisasi daftar rute menu di `navigationItems.js`, (3) Pembuatan komponen `MobileMenuDrawer.jsx` (slide-over Sheet kiri) lengkap dengan Company Switcher, pencarian modul, menu bertingkat accordion, toggle tema, & profil, (4) Pemasangan tombol Hamburger di `Header.jsx` (`lg:hidden`) dan refactor tab ke-5 `MobileBottomNav.jsx` menjadi tombol pemicu Menu. Kompilasi 3,072 modul sukses (4.04s) & 16 PHPUnit tests lulus (95 assertions). | - | `Selesai` |
| **13 Nov 2026** | **UI/UX Audit & Crave POS Dashboard Alignment (Kalender & Pengumuman Internal):** (1) Penyelarasan total halaman `Calendar/HolidayCalendar.jsx` dengan widget Dasbor Crave POS (`crave-pos-dashboard/src/routes/dashboard.tsx`): 4 KPI Cards (1 Hero Blue + 3 White card-soft tanpa icon pelangi), layout 2:1 Chart Area Sebaran Bulanan & Donut Pie Komposisi Libur, layout 2-kolom Jadwal Terdekat (`bg-muted/50 p-3 rounded-xl` + date block) & Agenda Lengkap dengan search bar dan filter kategori, serta toggle `Widget Dasbor` vs `Grid 12 Bulan`, (2) Audit & perombakan halaman `Announcements/Index.jsx`: penambahan widget analitik 2:1 (AreaChart Aktivitas Penerbitan Informasi & PieChart Donut Komposisi Kategori), penggantian corner ribbon miring diagonal dengan PIN Badge resmi Shadcn (`<Badge variant="default">` + `size-2.5 fill-current`), normalisasi seluruh custom span pelangi ke standard Shadcn `<Badge>`, serta eliminasi `text-rose-500` ke `text-destructive`. Verifikasi build Vite 100% (3,072 modul dalam 3.17s) dan 14 test PHPUnit lulus (93 assertions). | - | `Selesai` |
| **13 Nov 2026** | **UI/UX Audit & Modal Polish Cabang & Geofence (`Branches.jsx`):** (1) Perombakan modal form `Tambah/Edit Cabang`: eliminasi vertical overflow & scrollbar yang memotong close button via layout grid 3-kolom compact (Lat, Lng, Radius) dan grid 2-kolom (Whitelist IP & Switch Status Aktif), eliminasi warna `text-rose-500` ke `text-destructive`, (2) Penambahan widget analitik 2:1 Crave POS (BarChart Distribusi Staf per Cabang & PieChart Donut Kesiapan Geofence), (3) Normalisasi 4 KPI Cards (menghilangkan icon hijau/biru acak), serta penambahan live Search Bar & status filter tabs di toolbar atas. Build Vite sukses (3,072 modul dalam 2.68s) dan seluruh automated tests lulus 100%. | - | `Selesai` |
| **13 Nov 2026** | **Dynamic Multi-Branch & Editable Org Chart (`OrgChart.jsx`):** (1) Implementasi filter cabang dinamis (*Setiap Cabang Beda-Beda*) via toolbar pill `Semua Cabang` dan cabang spesifik (`?branch_id=`), (2) Penambahan kapabilitas **Edit Penempatan & Jabatan Langsung** dari setiap card karyawan dalam hierarki (`PATCH /organization/chart/placement/{employee}`) lengkap dengan modal pemindahan departemen, jabatan level, dan kantor cabang, (3) Pembuatan modal **Tambah Departemen Baru** (`POST /organization/chart/departments`), (4) Pembersihan AI-slop pada 4 KPI Top Cards (semua icon netral dan selaras Crave POS). Vite build 100% (3,071 modul dalam 1.99s) dan 3 automated tests baru lulus (100% Green, total 17 tests lolos). | - | `Selesai` |
| **14 Nov 2026** | **Task 7 Selesai (Smart Attendance GPS Geofence, IP, Kamera Selfie & Shift):** (1) Migrasi tabel `shifts`, `shift_swaps`, dan `attendances`, (2) `AttendanceService` (Haversine distance, IP whitelist fallback, kalkulasi keterlambatan & kepulangan cepat), (3) Halaman **Presensi Harian** (`Attendance/CheckIn.jsx`) dengan kamera selfie live & GPS radius indicator, (4) Halaman **Jadwal & Shift** (`Attendance/Shifts.jsx`) dengan master shift regular/fleksibel & permohonan tukar shift, (5) Halaman **Rekap Kehadiran** (`Attendance/Report.jsx`) dengan analitik 2:1 (AreaChart tren & Donut komposisi shift), filter cabang/shift/status, dan modal koreksi HR. Seluruh 28 automated tests lulus (166 assertions, 100% Green) & build Vite sukses tanpa error (3,074 modul dalam 11.8s). | - | `Selesai` |
| **15 Nov 2026** | **Attendance Polish & Human-Readable Geocoding:** (1) Implementasi reverse geocoding otomatis (OpenStreetMap Nominatim + BigDataCloud fallback) pada halaman Presensi Harian (`CheckIn.jsx`): mengubah tampilan angka koordinat teknis mentah menjadi nama jalan, kelurahan, kecamatan, kota/kabupaten dan provinsi yang jelas dan ramah pengguna, (2) Pembuatan komponen interaktif `SlideButton.jsx` (Slide-to-Confirm) dengan fisika sentuh/tarik mouse dari warna biru menjadi hijau terkonfirmasi saat absen masuk, (3) Eliminasi total icon `Sparkle`/`Sparkles` di seluruh repositori (0 sisa), (4) Penyelarasan widget KPI Top Cards di seluruh submenu presensi sesuai standar `Dashboard.jsx`. Build Vite sukses (3,075 modul) & 28 PHPUnit tests lulus 100% (166 assertions). | - | `Selesai` |
| **15 Nov 2026** | **Task 8 Selesai (Holiday & Leave Management):** (1) Migrasi tabel `leave_types`, `leave_balances`, dan `leave_requests`, (2) `LeaveService` (kalkulasi hari kerja skip weekend & libur nasional SKB 3 Menteri, validasi kuota cuti tahunan, pengecekan overlap, dan alur approval bertingkat Supervisor -> HR), (3) Halaman **Cuti & Izin Saya** (`Leave/Index.jsx`) lengkap dengan 4 Top KPI Cards, modal pengajuan cuti, estimasi hari kerja, dan upload surat keterangan dokter, (4) Halaman **Persetujuan Cuti** (`Leave/Approvals.jsx`) antrean approval berjenjang, modal alasan penolakan, pratinjau lampiran, dan auto-potong kuota cuti pada persetujuan final HR, (5) Integrasi jadwal cuti tim satu divisi di **Kalender & Libur** (`Calendar/HolidayCalendar.jsx`), (6) Penggantian Company Switcher menjadi minimalis anti-slop dengan monogram avatar. Seluruh 37 automated tests lulus (205 assertions, 100% Green) & build Vite sukses tanpa error (3,078 modul dalam 3.25s). | - | `Selesai` |
| **15 Nov 2026** | **Task 9 Selesai (Reimbursement, Overtime PP 35/2021 & Visit Lapangan):** (1) Migrasi tabel `reimbursements`, `overtimes` (SPKL), dan `visits`, (2) Implementasi `OvertimeCalculatorService` sesuai rumus resmi PP 35/2021 (upah per jam = Gaji Pokok / 173; hari kerja jam 1 = 1.5x, jam 2+ = 2x; hari libur 8 jam pertama = 2x, jam 9 = 3x, jam 10+ = 4x), (3) Halaman **Lembur (SPKL)** (`Claims/Overtime.jsx`) dengan 4 KPI cards, live rate calculator preview, modal SPKL & alur approval, (4) Halaman **Reimbursement** (`Claims/Reimbursement.jsx`) dengan receipt upload preview modal & status pencairan (Disbursement), (5) Halaman **Tugas Lapangan / Visit** (`Claims/Visit.jsx`) dengan live GPS geotagging otomatis, kamera selfie live di modal & approval supervisor, (6) 7 PHPUnit tests lolos (32 assertions, zero tenant data leakage via `BelongsToCompany`), total 44 tests lolos 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Task 10 Selesai (Crave Canteen Dynamic QR Code 60s & Merchant Scanner - Penutup Sprint 2):** (1) Migrasi tabel `canteen_vendors` dan `canteen_vouchers`, (2) Generator token QR dinamis HMAC-SHA256 ber-TTL 60 detik (*one-time use* & anti-screenshot), (3) Halaman **Voucher QR Saya** (`Canteen/VoucherCard.jsx`) dengan countdown timer progress bar 60 detik, auto-refresh token, daftar mitra vendor aktif & riwayat penebusan, (4) Halaman **Scanner Merchant** (`Canteen/Scanner.jsx`) antarmuka kasir cepat (< 0.5s) dengan webcam/HP viewfinder, reticle animasi Crave POS, audio feedback Web Audio API, input kode manual/USB barcode, popup data karyawan & log scan real-time, (5) Halaman **Rekonsiliasi Vendor** (`Canteen/Reports.jsx`) dengan 4 Top KPI Cards, 2:1 analitik (AreaChart tren harian & Donut komposisi porsi vendor), tabel settlement tagihan katering & CRUD modal vendor, (6) Filter visibilitas RBAC di `Sidebar.jsx` dan `MobileMenuDrawer.jsx` (menu kasir/settlement disembunyikan untuk karyawan), (7) 7 automated tests lolos (48 assertions), total 51 tests lulus 100% Green, Vite build sukses 0 error (3,087 modul dalam 1.77s). **Seluruh target Sprint 2 selesai 100%!** | - | `Selesai` |
| **15 Nov 2026** | **UI/UX Audit & Refactor Crave Canteen (100% Crave POS Parity):** Audit menyeluruh pada 3 submenu Canteen (`VoucherCard.jsx`, `Scanner.jsx`, `Reports.jsx`): (1) Menghilangkan seluruh kotak/pill latar belakang berwarna di belakang icon KPI Top Cards, mengembalikan bare outline icons persis pola `Dashboard.jsx`, (2) Normalisasi delta indikator menggunakan `ArrowUpRight`/`ArrowDownRight` dengan kelas semantik `text-success`/`text-destructive`, (3) Eliminasi seluruh warna hardcoded hex `#1B5CFE` ke CSS design tokens resmi (`var(--color-primary)`, `card-soft`, `border-border/50`), (4) Penyelarasan chart Area & Donut Pie di `Reports.jsx` 100% menggunakan CSS chart variables (`var(--color-chart-1)` s.d. `5`), (5) Desain ulang kartu tiket makan *Crave Meal Pass* dengan garis putus-putus perforasi dan barcode reticle presisi. Build Vite lolos (3,087 modul dalam 2.99s) & 51 tests PHPUnit 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Task 11 Selesai (Payroll Management PPh 21 TER 2024, BPJS, Slips & Bank Batch):** (1) Migrasi tabel `salary_components`, `payroll_periods`, `payroll_items`, (2) Service `Pph21TerCalculator` (tabel TER 2024 PMK 168/2023 Kategori A, B, C), `BpjsCalculator` (split 4%:1% Kesehatan, JKK 0.24%, JKM 0.3%, JHT 3.7%:2%, JP 2%:1% dengan cap upah resmi), dan `BankExportService` (file batch BCA CSV, Mandiri MCM CSV, BRI CMS TXT, BNI Direct TXT), (3) Controller `PayrollController` dengan 8 endpoint penggajian dan printable slip blade A4, (4) 4 Halaman React 19 (`Payroll/Index.jsx`, `Payroll/Slips.jsx`, `Payroll/Export.jsx`, `Payroll/PayslipModal.jsx`) dengan token Crave POS, 4 KPI cards (Hero Blue + 3 White card-soft), analitik 2:1 AreaChart & Donut Pie, (5) 8 automated tests lolos (46 assertions, 100% Green) & build Vite sukses (3,091 modul dalam 4.53s, 0 error). | - | `Selesai` |
| **15 Nov 2026** | **Task 11 Refinement & Executive Polish (Fix Batch Error, Wave Chart, Bank Logos & Formal Slip):** (1) Perbaikan bug SQL 1054 pada `PayrollController.php` (penggunaan kolom `estimated_amount` dari tabel `overtimes`), (2) Perbaikan kurva gelombang pada AreaChart Tren Penggajian via agregasi data multi-periode `trendData`, (3) Perbaikan alur logic `ViewToggle` di `Payroll/Index.jsx` (`viewMode === "list"` vs `"card"`), (4) Integrasi komponen konfirmasi modern `ConfirmActionDialog.jsx` berbasis Radix/Shadcn `AlertDialog` menggantikan alert browser bawaan, (5) Integrasi logo bank resmi dual-theme (BCA, Mandiri, BRI Light/Dark & BNI universal) pada halaman Ekspor Bank, (6) Desain ulang template cetak Slip Gaji A4 (`slip-print.blade.php`) menjadi ultra-formal corporate payslip dengan kop surat, double rule, konversi nominal `terbilang` bahasa Indonesia, dan digital audit hash. Build Vite 100% lolos (3,092 modul) & seluruh 59 unit/feature tests lolos (331 assertions, 100% Green). | - | `Selesai` |
| **15 Nov 2026** | **Universal Cursor & Pointer Ergonomics Overhaul:** (1) Penerapan aturan `@layer base` universal pada `app.css` untuk seluruh elemen interaktif (`button`, `a[href]`, `label[for]`, `select`, `input[type=checkbox/radio]`, `summary`, tabs, switches, dialog close, menu items) agar konsisten menampilkan hand pointer (`cursor: pointer`), serta `cursor: not-allowed` pada elemen disabled, (2) Pembaruan langsung pustaka komponen Shadcn UI (`buttonVariants`, `DropdownMenuItem`, `SelectItem`, `SelectTrigger`, `TabsTrigger`, `Switch`, `Checkbox`, `DialogClose`, `SheetClose`, `ViewToggle`), (3) Pembaruan elemen navigasi shell (`Sidebar`, `Header`, `CompanySwitcher`, `MobileBottomNav`, `MobileMenuDrawer`). Kompilasi Vite sukses & 59 test lolos 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Payroll Tenant Resolution & Typography Alignment (Eliminasi font-mono):** (1) Penambahan helper `getActiveCompanyId()` di `PayrollController.php` dan perbaikan `EnsureActiveCompany.php` untuk resolusi otomatis tenant perusahaan aktif, (2) Eksekusi `PayrollSeeder` untuk data demo periode November 2026, (3) **Normalisasi tipografi 100% Crave POS:** Mengeliminasi seluruh kelas `font-mono` di seluruh widget dan tabel modul Payroll (`Index.jsx`, `Slips.jsx`, `Export.jsx`, `PayslipModal.jsx`), menyelaraskan font angka metrik KPI ke standar Plus Jakarta Sans (`font-black tracking-tight sm:text-2xl`) persis menu Cuti & Dasbor utama, (4) Menjaga struktur `Sidebar.jsx` dan `MobileMenuDrawer.jsx` tetap 100% orisinal. Build Vite 100% lolos & seluruh 59 unit/feature tests lolos (331 assertions, 100% Green). | - | `Selesai` |
| **15 Nov 2026** | **Mobile Liquid GlassNav & Bottom Sheet Overhaul (Crave POS Parity Gambar 1 & Gambar 2):** (1) Integrasi komponen liquid `GlassNav.jsx` dengan efek pembiasan SVG displacement, physics-based spring animation, haptics, dan adaptasi tema dinamis (Light/Dark), (2) Integrasi `GlassNav` pada `MobileBottomNav.jsx` melayang di bagian bawah layar (`fixed bottom-4 inset-x-3 max-w-[480px]`) dengan tab inti (Dasbor, Presensi, Cuti, Payroll, Lainnya/Menu), (3) Restrukturisasi `MobileMenuDrawer.jsx` menjadi Bottom Sheet (Gambar 2) dari bawah (`side="bottom"`, `h-[85vh]`, `rounded-t-[28px]`, drag handle pill, pencarian modul, menu accordion dengan solid electric blue active pill, Light/Dark pill switch, dan kartu profil), (4) Transformasi universal seluruh modal dialog & popup (`DialogContent` & `AlertDialogContent`) khusus pada tampilan mobile (`max-sm:`) menjadi Bottom Sheet modern (`rounded-t-[28px]`, pull indicator handle, slide up dari bawah, `max-h-[88vh] overflow-y-auto`) sembari mempertahankan dialog centered modal pada desktop (`sm:`), (5) Penyesuaian mobile safe padding `pb-28` pada `AuthenticatedLayout.jsx`. Build Vite lolos (3,093 modul dalam 4.02s) & seluruh automated tests lolos 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Nav Stacking Isolation & Continuous Spring Animation (Zero Skip on Page Load):** (1) Elevasi kontainer `MobileBottomNav` ke lapisan layer tertinggi `z-[9999]` dengan `isolation: isolate` pada `GlassNav.jsx` sehingga bar navigasi berada di atas seluruh elemen chart, card, dan table, (2) Implementasi memori pegas persisten lintas navigasi (`globalNavState`) pada `GlassNav.jsx` yang menyimpan posisi `x`, kecepatan pegas `v`, dan target `tx`, (3) Penambahan transisi *optimistic tab state* pada `MobileBottomNav.jsx` sehingga kapsul cairan pegas langsung meluncur seketika saat tab ditekan dan terus melanjutkan lintasannya secara mulus tanpa terpotong (*zero skip/flicker*) saat halaman baru selesai dimuat. Build Vite lolos (1.83s) & 59 automated tests 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Gesture-Driven Bottom Sheet Menu (Vaul Drawer - Slide Up, Drag Down & Outside Tap Dismiss):** (1) Refactor `MobileMenuDrawer.jsx` menggunakan pustaka `Drawer` berbasis `vaul` (`DrawerContent`, `DrawerOverlay`), (2) Animasi peluncuran masuk halus dari bawah (*smooth slide-up*) dengan *spring damping* ala iOS, (3) Interaksi fisik gesture sentuh *drag down to dismiss* (dapat ditarik ke bawah manual menggunakan jari/mouse untuk menutup), (4) Penutupan otomatis dengan klik backdrop/overlay luar atau tombol close `X` dengan animasi meluncur turun ke bawah (*slide down*). Build Vite sukses 100% (3,095 modul dalam 1.77s) & 59 automated tests 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Universal Animated Bottom Sheet Popups & Touch Drag-Down (Parity Gambar 2):** (1) Implementasi keyframes animasi Radix pada `app.css` (`sheetSlideUp` 0.32s, `sheetSlideDown` 0.22s, `overlayFadeIn`, `overlayFadeOut`, `modalScaleIn`, `modalScaleOut`) pada `dialog.jsx` dan `alert-dialog.jsx`, (2) Implementasi komponen gesture interaktif `MobileDragHandle` di bagian atas popup dengan event tracking touch (`onTouchStart`, `onTouchMove`, `onTouchEnd`) sehingga popup dapat ditarik ke bawah (*drag down to dismiss*) atau memantul kembali (*spring-back* jika tarikan < 80px), (3) Penutupan otomatis via tap outside overlay atau tombol Batal/(X) dengan animasi meluncur turun ke bawah yang halus (*slide down*), (4) Tampilan desktop (`sm:`) tetap mempertahankan modal popup terpusat (*centered modal*). Build Vite sukses 100% (3,095 modul dalam 2.35s) & 59 automated tests 100% Green. | - | `Selesai` |
| **15 Nov 2026** | **Header Cleanup (Penghapusan Tombol Hamburger Mobile):** Menghapus tombol menu garis 3 (`Menu` icon) di header atas (`Header.jsx`) karena navigasi menu mobile kini sepenuhnya dan lebih ergonomis diakses melalui tab *Lainnya* pada floating `GlassNav` bawah. Judul halaman pada mobile menjadi lebih bersih, lapang, dan bebas distraksi. Build Vite 100% sukses (2.05s) & unit tests 100% Green. | - | `Selesai` |
