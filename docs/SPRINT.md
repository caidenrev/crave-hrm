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
* **Reviewer:** Egi Witra Aditya
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
* **Reviewer:** Egi Witra Aditya
* **Skill Rekomendasi:** `impeccable`, `antislop-ui`
* **Status:** `[x] Selesai (10 Nov 2026)`
- [x] Inisialisasi konfigurasi Shadcn UI (`components.json`, style: new-york, baseColor: slate)
- [x] Install seluruh komponen Shadcn UI via `npx shadcn@latest add --all --yes`
- [x] Injeksi token desain Crave POS ke `resources/css/app.css` (OKLCH primary, canvas slate, card radius 24px, soft shadow)
- [x] Verifikasi seluruh komponen Radix primitives dan utils terkompilasi bersih di Vite

### Task 3: Database Multi-Company Core & Auth Middleware
* **Target Selesai:** 13 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Egi Witra Aditya
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
* **Reviewer:** Eka Revandi & Egi Witra Aditya
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
* **Reviewer:** Egi Witra Aditya & Eka Revandi
* **Skill Rekomendasi:** `frontend-ui-engineering`, `security-and-hardening`
* **Status:** `[x] Selesai (12 Nov 2026)`
> 📌 *Referensi Peta Menu & Route:* Lihat tabel di [`docs/PRD.md`](PRD.md) Section 4.2 agar setiap file halaman terhubung tepat ke submenu di `Sidebar.jsx`.
- [x] Migrasi tabel `announcements` dan `holidays`
- [x] Controller pengumuman internal (`/announcements` -> `Announcements/Index.jsx`) & sinkronisasi hari libur nasional SKB 3 Menteri (`/calendar` -> `Calendar/HolidayCalendar.jsx`)
- [x] Halaman **Cabang & Geofence** (`/organization/branches` -> `Organization/Branches.jsx`) untuk input koordinat Lat/Lng, radius geofence, & whitelist IP kantor (prasyarat Task 7)
- [x] Halaman **Struktur Organisasi / Org Chart** (`/organization/chart` -> `Organization/OrgChart.jsx`)
- [x] **Gerbang Evaluasi QA Sprint 1:** UAT Sign-off isolasi multi-company dan master data oleh Egi Witra Aditya (`verification-before-completion`) - 16 PHPUnit tests lolos (95 assertions), Vite build sukses tanpa error.

---

# ⚡ SPRINT 2: Operational Core (Presensi, Cuti, Lembur & Kantin)
**Periode:** 17 November – 23 November 2026  
**Target:** Smart Attendance GPS & Shift, Izin/Cuti alur bertingkat, Reimbursement & Lembur PP 35/2021, Crave Canteen QR dinamis.

### Task 7: Smart Attendance System (GPS Geofence + IP + Kamera Selfie + Shift)
* **Target Selesai:** 18 November 2026
* **PIC:** Eka Revandi (Service & Geofence) & Aufa (Kamera, Shift & UI)
* **Reviewer:** Egi Witra Aditya
* **Skill Rekomendasi:** `test-driven-development`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `shifts` dan `attendances`
- [ ] Implementasi `AttendanceService` (rumus Haversine radius kantor, IP whitelist kantor, kalkulasi menit keterlambatan)
- [ ] Submenu **Presensi Harian** (`/attendance` -> `Attendance/CheckIn.jsx`) mobile-optimized dengan live GPS indicator & kamera selfie preview
- [ ] Submenu **Jadwal & Shift** (`/attendance/shifts` -> `Attendance/Shifts.jsx`) untuk shift reguler, berputar, fleksibel, & tukar shift
- [ ] Submenu **Rekap Kehadiran** (`/attendance/recap` -> `Attendance/Report.jsx`) dashboard HR monitoring harian dengan filter tanggal, cabang, dan shift
- [ ] Uji validasi: Lolos di dalam radius geofence dan tolak otomatis jika di luar radius

### Task 8: Holiday & Leave Management
* **Target Selesai:** 20 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi & Egi Witra Aditya
* **Skill Rekomendasi:** `frontend-ui-engineering`, `test-driven-development`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `leave_types` dan `leave_requests`
- [ ] Logika alokasi saldo cuti tahunan dan alur approval berjenjang (Karyawan -> Atasan Langsung -> HR)
- [ ] Submenu **Cuti & Izin Saya** (`/leave` -> `Leave/Index.jsx`) form pengajuan cuti dengan date range picker & upload surat dokter
- [ ] Submenu **Persetujuan Cuti** (`/leave/approvals` -> `Leave/Approvals.jsx`) antrean persetujuan / penolakan untuk atasan & HR
- [ ] Integrasi visual cuti tim satu departemen pada submenu **Kalender & Libur** (`/calendar` -> `Calendar/HolidayCalendar.jsx`)
- [ ] Uji potongan kuota cuti otomatis setelah persetujuan final

### Task 9: Reimbursement, Overtime PP 35/2021 & Visit Lapangan
* **Target Selesai:** 21 November 2026
* **PIC:** Aufa (Form & View) & Eka Revandi (Kalkulator Lembur)
* **Reviewer:** Egi Witra Aditya
* **Skill Rekomendasi:** `test-driven-development`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `reimbursements`, `overtimes` (SPKL), dan `visits`
- [ ] Implementasi formula lembur resmi Depnaker PP 35/2021 (pengali upah 1/173) di `OvertimeCalculatorService`
- [ ] Submenu **Lembur (SPKL)** (`/claims/overtime` -> `Claims/Overtime.jsx`)
- [ ] Submenu **Reimbursement** (`/claims/reimbursement` -> `Claims/Reimbursement.jsx`) dengan upload pratinjau struk/kuitansi
- [ ] Submenu **Tugas Lapangan / Visit** (`/claims/visit` -> `Claims/Visit.jsx`) dengan geotagging GPS & swafoto di lokasi klien
- [ ] Uji coba hitungan pengali lembur 1.5x dan 2x

### Task 10: Crave Canteen (Dynamic QR Code 60s & Merchant Scanner)
* **Target Selesai:** 23 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi & Egi Witra Aditya
* **Skill Rekomendasi:** `security-and-hardening`, `frontend-ui-engineering`, `antislop-layoutmobile`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `canteen_vendors` dan `canteen_vouchers`
- [ ] Implementasi generator QR Code token dinamis terenkripsi dengan TTL 60 detik (*one-time use*)
- [ ] Submenu **Voucher QR Saya** (`/canteen` -> `Canteen/VoucherCard.jsx`) dengan animasi countdown timer
- [ ] Submenu **Scanner Merchant** (`/canteen/scanner` -> `Canteen/Scanner.jsx`) menggunakan kamera pemindai barcode/QR
- [ ] Submenu **Rekonsiliasi Vendor** (`/canteen/settlement` -> `Canteen/Reports.jsx`) rekapitulasi porsi makan bulanan untuk tagihan katering
- [ ] Filter visibilitas submenu Sidebar berbasis RBAC (menu kasir/admin disembunyikan untuk `employee`)
- [ ] **Gerbang Evaluasi QA Sprint 2:** UAT Sign-off fitur operasional oleh Egi Witra Aditya (`verification-before-completion`)

---

# 🎯 SPRINT 3: Payroll Compliance, Recruitment, 360 Review & PWA Launch
**Periode:** 24 November – 29 November 2026  
**Target:** Mesin penggajian Indonesia PPh 21 TER & BPJS, Slip PDF, Ekspor Bank, E-Recruitment ATS, 360 Review, PWA packaging, dan Go-Live.

### Task 11: Payroll Management (PPh 21 TER, BPJS, Slip PDF & Bank Batch)
* **Target Selesai:** 25 November 2026
* **PIC:** Eka Revandi
* **Reviewer:** Egi Witra Aditya
* **Skill Rekomendasi:** `test-driven-development`, `performance-optimization`, `security-and-hardening`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel `payrolls` dan `salary_components`
- [ ] Implementasi `Pph21TerCalculator` sesuai tabel resmi 2024 (Kategori TER A, B, C)
- [ ] Implementasi `BpjsCalculator` (Kesehatan 4%:1%, JKK, JKM, JHT 3.7%:2%, JP 2%:1%)
- [ ] Submenu **Proses Payroll** (`/payroll` -> `Payroll/Index.jsx`) runner otomatisasi penggajian bulanan perusahaan
- [ ] Submenu **Slip Gaji** (`/payroll/slips` -> `Payroll/Slips.jsx` & `PayslipModal.jsx`) generator Slip Gaji PDF via DomPDF berlogo perusahaan & opsi proteksi sandi
- [ ] Submenu **Ekspor Bank & Rekap** (`/payroll/export` -> `Payroll/Export.jsx`) layanan ekspor file batch bank corporate internet banking (BCA, Mandiri, BRI, BNI) & Excel
- [ ] Uji presisi perhitungan pajak dan BPJS terhadap tabel simulasi pemerintah

### Task 12: Crave E-Recruitment (Career Portal Publik & ATS Kanban)
* **Target Selesai:** 26 November 2026
* **PIC:** Aufa
* **Reviewer:** Eka Revandi & Egi Witra Aditya
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
* **Reviewer:** Eka Revandi & Egi Witra Aditya
* **Skill Rekomendasi:** `frontend-ui-engineering`
* **Status:** `[ ] Pending`
- [ ] Migrasi tabel siklus evaluasi, kuesioner, dan nilai responden
- [ ] Form kuesioner skala Likert 1–5 untuk 4 rater (Self, Atasan, Rekan, Bawahan)
- [ ] Visualisasi Spider/Radar Chart menggunakan Recharts untuk membandingkan skor evaluator
- [ ] Ringkasan skor KPI dan rekomendasi promosi/evaluasi karyawan

### Task 14: PWA Packaging, Device Session Security & Final Launch Ready
* **Target Selesai:** 28–29 November 2026
* **PIC:** Eka Revandi & Aufa
* **Reviewer:** Egi Witra Aditya (Final Delivery Sign-off)
* **Skill Rekomendasi:** `performance-optimization`, `antislop-layoutmobile`, `verification-before-completion`
* **Status:** `[ ] Pending`
- [ ] Konfigurasi `vite-plugin-pwa` dan Service Worker caching
- [ ] Buat file `manifest.json` Crave HRM dengan tema `#1B5CFE`
- [ ] Buat halaman keamanan sesi login aktif (`/sessions` -> `Profile/DeviceSessions.jsx`, ditautkan dari dropdown profil Header & Footer Sidebar)
- [ ] Banner prompt install PWA otomatis di desktop & mobile
- [ ] Kompilasi build final produksi (`npm run build`)
- [ ] **Final UAT & Go-Live Sign-off:** Verifikasi kelayakan rilis sebelum 30 November oleh Egi Witra Aditya

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
