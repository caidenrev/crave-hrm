# 🛡️ AI AGENT MANDATORY OPERATING RULES
## Project: Crave HRM (SaaS Human Resource Management)
**Target Go-Live:** Sebelum 30 November 2026 (29 November 2026)  
**Target Domain:** `hrm.craveservices.my.id`

---

## 🚨 ATURAN UTAMA & WAJIB BACA (CRITICAL MANDATE)

Setiap AI Agent / Assistant yang bekerja pada repositori ini **WAJIB MEMBACA DAN MEMATUHI** file-file dokumentasi di dalam folder `docs/` sebelum menulis kode, merancang skema database, atau menjawab pertanyaan terkait implementasi fitur:

1. **`docs/PRD.md`** *(Product Requirement Document & Visual Design Tokens)*
   * Memuat spesifikasi 9 modul inti, arsitektur multi-company, formula kepatuhan ketenagakerjaan Indonesia (PPh 21 TER 2024, BPJS Kesehatan & Ketenagakerjaan, Lembur PP 35/2021).
   * Memuat token desain resmi turunan dari **Crave POS** (OKLCH color system, radius card 24px, tipografi Plus Jakarta Sans, soft multi-stop shadow).
2. **`docs/IMPLEMENTATION_PLAN.md`** *(Technical Architecture & Task Breakdown)*
   * Memuat arsitektur teknis monolit modern (Laravel 13 + Inertia.js v2 + React 19 + Tailwind CSS v4).
   * Memuat rincian 14 task berurutan lengkap dengan spesifikasi file yang dibuat/diubah, interfaces, dan skenario pengujian.
3. **`docs/SPRINT.md`** *(Active Sprint Roadmap, RACI & Progress Checklist)*
   * Memuat pembagian 3 Sprint kerja hingga 29 November 2026.
   * Memuat daftar PIC pelaksana tugas, checklist progres interaktif (`- [ ]`), dan rekomendasi AI skills yang paling efektif per task.

---

## 👥 Tim Proyek & Hierarki Keputusan
* **Eka Revandi** — Lead Project & Lead Software Engineer *(Keputusan Arsitektur, Multi-Company Tenancy, Keamanan, Engine Kalkulasi Pajak & Payroll, Deployment)*.
* **Egi Witra Aditya** — Project Manager *(Keputusan Prioritas Backlog, Timeline Sprint, Quality Assurance / UAT Sign-off)*.
* **Aufa** — Project Development *(Eksekusi Fitur, Komponen UI Shadcn React 19, Form Validation, Alur Modul)*.

---

## 🎨 Standar Desain Wajib (Crave POS Aesthetic)
Setiap antarmuka (UI) yang dibuat **wajib konsisten 100%** dengan desain sistem Crave POS:
* **Font:** `"Plus Jakarta Sans"` (Headings & angka metrik KPI menggunakan `font-black tracking-tight`).
* **Warna (OKLCH):**
  * Primary: `oklch(0.54 0.19 258)` (Royal Electric Indigo Blue)
  * Background: `oklch(0.98 0.006 250)` (Canvas slate sejuk)
  * Card Surface: Pure White `oklch(1 0 0)` dengan border `oklch(0.91 0.014 252)`
  * Text Primary: Deep Slate Navy `oklch(0.22 0.03 258)`
* **Corner Radius:**
  * Card / Container: **`24px`** (`rounded-2xl` / `card-soft`).
  * Button / Input: **`12px`** (`rounded-xl`).
  * Badges / Status Pills: **`rounded-full`**.
* **Pustaka Komponen UI:** Wajib menggunakan **Shadcn UI** (terpasang via `npx shadcn@latest add --all`). Dilarang membuat komponen form/modal/button custom mentah yang menyimpang dari Shadcn.
* **Pola Layout:** Menggunakan pola `AppShell` (Sticky Header dengan search bar `w-64 rounded-xl`) dan `SideNav` dual-state (`w-72` expand / `w-20` collapse).

---

## 📂 Standar Struktur Direktori (Modern Monolith Laravel + Inertia React 19)
Seluruh AI Agent **WAJIB** menempatkan file sesuai arsitektur baku berikut:
```text
revan-laravel/
├── app/                               # 🐘 BACKEND (LARAVEL)
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

## 🔒 Batasan Keamanan & Multi-Tenancy (Strict Boundaries)
1. **Pemisahan Data Multi-Company:**
   * Setiap query data transaksi (karyawan, absensi, gaji, cuti, klaim) **WAJIB** difilter berdasarkan `company_id` dari session perusahaan aktif (menggunakan Global Scope `BelongsToCompany`).
   * Dilarang keras menampilkan atau memanipulasi data milik perusahaan lain (*zero cross-tenant data leakage*).
2. **Proteksi Data Sensitif:**
   * NIK KTP, nomor rekening bank, dan besaran gaji pokok karyawan wajib terenkripsi.
3. **Absensi & Kantin:**
   * Absensi GPS diwajibkan *online-only* dengan validasi radius geofence dan IP publik kantor.
   * Token QR voucher kantin wajib memiliki TTL 60 detik dan berstatus *one-time use*.

---

## 🧠 ATURAN WAJIB PENGGUNAAN SKILLS (MANDATORY SKILL PROTOCOL)
Setiap AI Agent **WAJIB MENERAPKAN SKILLS REKOMENDASI** yang tertera pada setiap task di `docs/SPRINT.md` sebelum dan selama mengeksekusi kode:

1. **`frontend-ui-engineering` & `impeccable`:**
   * Wajib aktif untuk setiap pengerjaan UI/UX, komponen Shadcn React 19, AppShell, form validation, dan tata letak Crave POS.
   * Memastikan kepatuhan mutlak pada token desain: `oklch(0.54 0.19 258)`, `--radius-2xl: 24px`, `--shadow-soft`, dan tipografi Plus Jakarta Sans (`font-black tracking-tight` pada KPI & heading).
2. **`security-and-hardening` & `api-and-interface-design`:**
   * Wajib aktif untuk logika multi-tenancy, middleware `EnsureActiveCompany`, proteksi data sensitif karyawan (enkripsi NIK/rekening/gaji), validasi IP publik & radius GPS geofence absensi, serta token QR dinamis (60s TTL) kantin.
   * Dilarang meloloskan query tanpa filter `company_id`.
3. **`test-driven-development`:**
   * Wajib aktif untuk logika bisnis krusial: perhitungan PPh 21 TER 2024 (PP 58/2023), BPJS Kes/TK, formula upah lembur PP 35/2021 ($1/173$), isolasi multi-tenant, dan mutasi data master karyawan.
   * Selalu menyertakan file pengujian di `tests/Feature/` atau `tests/Unit/`.
4. **`antislop-layoutmobile`:**
   * Wajib aktif untuk halaman operasional lapangan dan PWA Mobile (Employee Self-Service): presensi selfie, klaim struk kuitansi, voucher kantin, dan `MobileBottomNav`.
5. **`performance-optimization` & `verification-before-completion`:**
   * Wajib dijalankan di setiap akhir task sebelum menyatakan selesai: eksekusi `npm run build` dan `php artisan test`, verifikasi output 0 error/failure, lalu catat pembaruan checklist dan daily log di `docs/SPRINT.md`.

---

## 🔄 Alur Eksekusi Task & Pembaruan Dokumentasi
1. Sebelum mulai mengerjakan suatu task, buka dan baca task tersebut di `docs/IMPLEMENTATION_PLAN.md` dan `docs/SPRINT.md`.
2. **Wajib terapkan skills** yang direkomendasikan pada task bersangkutan sesuai panduan di atas.
3. Setiap kali satu task selesai:
   * Jalankan uji verifikasi: `npm run build` dan `php artisan test`.
   * Perbarui status checklist di `docs/SPRINT.md` dari `[ ]` menjadi `[x]`.
   * Catat progres pada tabel *Daily Standup Log* di bagian bawah `docs/SPRINT.md`.
