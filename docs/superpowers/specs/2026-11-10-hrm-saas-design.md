# Product Requirement Document (PRD) & Technical Design Spec
# Project: SaaS HRM (Human Resource Management) "Crave HRM"

- **Status:** Final Draft / Pending User Approval
- **Date:** 2026-11-10
- **Target Deadline:** Sebelum 30 November 2026 (Target Go-Live: 29 November 2026)
- **Project Team & Roles:**
  * **Eka Revandi** — Lead Project & Lead Software Engineer *(Core Architecture, Multi-Company Tenancy, Security, Payroll Calculation Engine, Code Review & Deployment)*
  * **Egi Witra Aditya** — Project Manager *(Sprint Management, Backlog Prioritization, Quality Assurance / UAT, Timeline Tracking, Documentation)*
  * **Aufa** — Project Development *(Full-Stack Feature Development, UI/UX Component Implementation, Form Validation, Module Flows)*
- **Target Domain:** `hrm.craveservices.my.id` (Single Portal SaaS dengan Active Company Context)
- **Architecture:** Laravel 13 (PHP 8.3+) + Inertia.js v2 + React 19 + Tailwind CSS v4
- **Design Reference & Tokens:** Crave POS System (`crave-monorepo-system/apps/pos-system`)
- **UI Component Library:** **Shadcn UI (All Components via `npx shadcn@latest add --all`)**
- **Client Deployment:** Web SaaS first, dilanjutkan PWA installable (Desktop, iOS, Android)

---

## 1. Objective & Vision

### 1.1 Objective
Membangun platform SaaS Human Resource Management (HRM) kelas *enterprise-ready* namun berantarmuka modern, intuitif, dan ramah pengguna (*Lovable/Crave aesthetic*). Melayani operasional *end-to-end* perusahaan modern dari skala UKM hingga multi-cabang/anak perusahaan di Indonesia.

### 1.2 Core Pillars
1. **Automated & Indonesian Regulation Compliant:** Perhitungan otomatis presensi GPS, kalkulasi lembur Depnaker (PP 35/2021), cuti, hingga penggajian PPh 21 TER 2024 dan BPJS Ketenagakerjaan & Kesehatan.
2. **Seamless Employee Experience (ESS):** Karyawan dapat mengelola absensi GPS, klaim makan kantin (QR code dinamis), lembur, cuti, dan slip gaji langsung via antarmuka mobile web / PWA.
3. **Multi-Tenancy & Multi-Company:** 1 akun pengguna (*Global Identity*) dapat memiliki akses dan berpindah konteks (*Switch Company*) ke berbagai anak perusahaan/cabang holding secara instan.
4. **Crave Ecosystem Design Language:** Mengadopsi secara presisi sistem token desain, tipografi *Plus Jakarta Sans*, sudut membulat 24px (*super-rounded*), bayangan lembut multi-stop, dan palet warna Royal Indigo/Electric Blue dari Crave POS.

---

## 2. Design System & Tokens (Crave POS Aesthetic)

Desain Crave HRM disinkronisasikan 100% dengan standar UI/UX dari `caidenrev/crave-monorepo-system/apps/pos-system`.

### 2.1 Color Tokens (OKLCH System)
* **Primary (Royal Indigo/Electric Blue):** `oklch(0.54 0.19 258)` (Setara `#1B5CFE` / `#4F46E5`). Digunakan untuk tombol utama, active menu, hero cards, dan active tabs.
* **Primary Foreground:** `oklch(0.99 0.005 250)` (White text pada elemen primer).
* **Background (Light Canvas):** `oklch(0.98 0.006 250)` (Soft slate canvas sejuk yang bersih dan nyaman di mata).
* **Background (Dark Mode):** `oklch(0.18 0.02 260)` (Deep Charcoal / Slate Navy).
* **Card & Surface:** Pure White `oklch(1 0 0)` di Light Mode dengan border tipis `oklch(0.91 0.014 252)`.
* **Foreground / Text Primary:** Deep Slate Navy `oklch(0.22 0.03 258)` untuk judul & angka metrik.
* **Muted Foreground:** `oklch(0.53 0.035 256)` untuk subtitle, label input, dan info bertumpuk.
* **Semantic Status:**
  * **Success:** `oklch(0.62 0.15 155)` (Emerald) — Hadir tepat waktu, lunas, aktif.
  * **Warning:** `oklch(0.75 0.15 75)` (Amber / Warm Orange) — Menunggu approval, terlambat, trial.
  * **Destructive:** `oklch(0.58 0.22 20)` (Coral Red) — Ditolak, alpha, non-aktif.

### 2.2 Corner Radius & Elevation
* **Base Radius:** `1rem` (16px).
* **Card & Container Radius (`var(--radius-2xl)`):** **24px** (`rounded-2xl` / `card-soft`). Memberikan kesan modern, bersahabat, dan premium khas Lovable style.
* **Buttons & Inputs:** `rounded-xl` (12px).
* **Badges & Status Pills:** `rounded-full` (Pill format).
* **Soft Layered Shadows (`--shadow-soft`):**
  `box-shadow: 0 1px 2px oklch(0.45 0.12 255 / 0.06), 0 8px 24px oklch(0.45 0.12 255 / 0.08);`

### 2.3 Tipografi & Hirarki Data
* **Font Family:** `"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`.
* **Heading & KPI Numbers:** `font-black` (900) atau `font-extrabold` (800) dengan `tracking-tight` untuk *high visual punch*.
* **Stacked Cell Data Pattern:** Kolom tabel data menggunakan format 2 baris (Baris atas: Nama/Item `font-bold text-sm`, Baris bawah: Email/ID/Subtitle `text-[11px] text-muted-foreground`).

---

## 3. UI/UX Architecture & Shell Patterns

### 3.1 Dual-State Collapsible Sidebar (`SideNav`)
* **State Lebar:** `w-72` (288px) saat expanded, `w-20` (80px) saat collapsed dengan transisi halus `transition-[padding] duration-300`.
* **Header Sidebar:** Logo Crave + Label Aplikasi ("Crave HRM") + **Company Switcher Dropdown** (pilih anak perusahaan / cabang aktif).
* **Instant Menu Search:** Kotak pencarian menu cepat di atas navigasi untuk menyaring 9 modul dalam hitungan detik.
* **Section Dividers:** Header seksi kapital tebal (`OPERASIONAL`, `KOMPENSASI`, `MANAJEMEN`, `PENGATURAN`).
* **Menu Badges:** Badge pill angka (misal `Lembur (3)`, `Cuti (2)` untuk notifikasi approval tertunda).
* **Accordion Submenu:** Menu bersarang dengan animasi drop yang rapi (misal `Payroll -> Rekap, PPh 21, Bank Transfer`).
* **Footer Sidebar:** Tombol toggle Dark Mode, status profil ringkas pengguna, tombol logout, dan tombol minimize sidebar.

### 3.2 Sticky Header (`AppShell`)
* `sticky top-0 z-20 border-b bg-background/85 backdrop-blur`.
* **Kiri:** Judul halaman H1 (`font-extrabold`) + deskripsi halaman 1 kalimat (*subtitle context*).
* **Kanan:**
  * Global Search Bar (`w-64 rounded-xl pl-9` dengan icon search).
  * Quick Action Button (CTA dinamis per halaman, misal: *+ Tambah Karyawan*, *+ Ajukan Cuti*, *Generate Payroll*).
  * Notification Bell Popover dengan unread count pill.
  * User Avatar Dropdown (Profil, Keamanan Sesi, Pengaturan Akun).

### 3.3 Mobile Bottom Navigation Bar (PWA ESS Mode)
* Fixed bottom navigation bar khusus tampilan ponsel untuk karyawan:
  * **Beranda** (Home overview)
  * **Absensi** (Kamera Selfie & GPS Check-in)
  * **Kantin QR** (Voucher makan dinamis)
  * **Inbox / Approval** (Status pengajuan izin, lembur, klaim)
  * **Akun** (Profil, Slip Gaji, Sesi Perangkat)

---

## 4. Capability Map & Modul Inti

| Module ID | Module Name | Tanggung Jawab Utama | Dependencies |
| :--- | :--- | :--- | :--- |
| `mod-saas-core` | Multi-Company & Tenancy | Multi-company, multi-cabang, global user identity, company switcher, RBAC matrix, audit log, device session | — |
| `mod-internal-mgmt` | Company Internal Management | Master data karyawan (stacked info + switch active), org chart, departemen, jabatan, pengumuman, kalender libur | `mod-saas-core` |
| `mod-attendance` | Smart Attendance System | Presensi GPS Geofencing, Whitelist IP publik kantor, kamera selfie, dynamic shifts, WFH/WFA, late tracking, approval | `mod-internal-mgmt` |
| `mod-leave` | Holiday & Leave | Kuota cuti tahunan, pengajuan izin/sakit + upload surat dokter, multi-tier approval, laporan saldo | `mod-internal-mgmt` |
| `mod-claims` | Reimbursement, Overtime & Visit | Pengajuan dinas luar (visit) + selfie, lembur (SPKL) hitungan PP 35/2021, reimbursement biaya + struk, approval alur | `mod-internal-mgmt` |
| `mod-payroll` | Payroll Management | Penggajian otomatis, kalkulator PPh 21 TER (A/B/C), BPJS TK & Kes, slip gaji PDF/Excel, ekspor batch bank | `mod-attendance`, `mod-leave`, `mod-claims` |
| `mod-canteen` | Crave Canteen | Kuota makan harian, QR voucher dinamis (60s countdown), merchant scanner interface, rekapitulasi vendor | `mod-internal-mgmt` |
| `mod-recruitment` | Crave E-Recruitment | Portal lowongan publik, ATS Kanban stages, interview scheduler, e-offering letter, 1-click onboard to employee | `mod-internal-mgmt` |
| `mod-360-review` | 360 Performance Review | Periode review kuartalan/tahunan, kuesioner multi-rater (self, atasan, rekan, bawahan), Recharts radar chart KPI | `mod-internal-mgmt` |
| `mod-pwa-ess` | PWA & Mobile Experience | Vite PWA plugin, Service Worker caching, Web Manifest, install banner prompt, mobile bottom navigation | View layer |

---

## 5. Spesifikasi Fungsional Rinci per Modul

### 5.1 Modul 1: Smart Attendance System
* **GPS Geofencing:** Radius absensi akurat berdasarkan koordinat latitude/longitude kantor cabang (default radius 50–100m).
* **Validasi Jaringan Kantor:** Whitelist IP Publik kantor untuk mengonfirmasi kehadiran fisik di lokasi.
* **Camera Selfie Verification:** Mengambil foto wajah saat check-in/check-out secara langsung via kamera perangkat.
* **Shift Scheduling:** Shift reguler, shift berputar (pagi/siang/malam), fleksibel, dan tukar shift antar karyawan.
* **Monitoring & Keterlambatan:** Perhitungan otomatis menit keterlambatan (*late in*), pulang cepat (*early out*), dan integrasi langsung ke pemotongan tunjangan kehadiran payroll.
* **Kebijakan Online-Only:** Transaksi wajib online untuk mencegah kecurangan manipulasi jam lokal perangkat (*anti-fake clock tampering*).

### 5.2 Modul 2: Payroll Management (Standar Indonesia)
* **Formula Gaji:**
  `Take Home Pay = Gaji Pokok + Tunjangan Tetap + Tunjangan Tidak Tetap + Uang Lembur + Reimbursement - Potongan (BPJS + PPh 21 + Keterlambatan/Kasbon)`.
* **Kalkulator PPh 21 TER (PP 58/2023 & PMK 168/2023):**
  * Kategori A: PTKP TK/0 (Rp 54 jt), TK/1 (Rp 58.5 jt), K/0 (Rp 58.5 jt).
  * Kategori B: PTKP TK/2, TK/3, K/1, K/2.
  * Kategori C: PTKP K/3.
  * Perhitungan masa pajak reguler (Januari - November) dan perhitungan ulang masa pajak Desember (Tarif Pasal 17 ayat 1 huruf a UU PPh).
* **Kalkulator BPJS Lengkap:**
  * BPJS Kesehatan: 4% ditanggung perusahaan, 1% dipotong dari gaji karyawan (mengikuti batas cap upah maksimal).
  * BPJS Ketenagakerjaan: JKK (0.24% - 1.74% sesuai risiko), JKM (0.30%), JHT (3.7% perusahaan, 2.0% karyawan), JP (2.0% perusahaan, 1.0% karyawan dengan cap plafon).
* **Kompensasi Lembur PP 35/2021:**
  * Formula upah per jam: `1/173 x Upah Sebulan`.
  * Hari Kerja: Jam pertama 1.5x upah sejam, jam kedua dan seterusnya 2x upah sejam.
  * Hari Libur/Istirahat Mingguan: Perhitungan pengali bertingkat sesuai aturan ketenagakerjaan resmi.
* **Dokumen & Ekspor:**
  * Cetak Slip Gaji PDF dengan logo perusahaan, rincian komponen transparan, dan opsi password proteksi (tanggal lahir karyawan).
  * Rekapitulasi penggajian format Excel (.xlsx).
  * Ekspor file batch transfer perbankan (*Corporate Internet Banking*): BCA (KlikBCA Bisnis CSV), Mandiri (MCM CSV/TXT), BRI (CMS TXT), dan BNI (BNI Direct TXT).

### 5.3 Modul 3: Company Internal Management
* **Daftar Karyawan Modern:**
  * Tabel stacked: Foto avatar bulat + Nama lengkap (bold 14px) + Jabatan/Departemen (muted 11px).
  * Status badge pill (`Aktif`, `Probation`, `Cuti`, `Resign`).
  * **Shadcn Switch Toggle:** Tombol sakelar aktif/nonaktif akun karyawan secara langsung di baris tabel.
  * Row click membuka **Slide-over Sheet / Modal Dialog** profil lengkap (data pribadi, keluarga, pajak PTKP, rekening, dokumen KTP/Ijazah/Kontrak).
* **Visual RBAC Permission Matrix:**
  * Grid matriks hak akses visual yang memetakan kolom Peran (*Holding Admin, Company HR, Branch Manager, Finance, Employee*) dengan baris Hak Akses Modul.
* **Struktur Organisasi (Org Chart):** Bagan pohon interaktif menghubungkan Direksi, Departemen, Divisi, dan Atasan Langsung.
* **Pengumuman Internal:** Feed pengumuman dengan target perusahaan/cabang, *rich text*, dan konfirmasi telah dibaca (*read receipt*).
* **Kalender & Hari Libur:** Sinkronisasi hari libur nasional resmi (SKB 3 Menteri) dan cuti bersama.

### 5.4 Modul 4: Holiday & Leave
* **Manajemen Kuota:** Saldo cuti tahunan (default 12 hari), cuti melahirkan, duka, menikah, dan aturan kedaluwarsa kuota.
* **Pengajuan Cuti/Izin:** Kalender *date range picker*, perhitungan otomatis hari kerja (skip Sabtu/Minggu & Libur Nasional), upload surat dokter wajib untuk sakit > 1 hari.
* **Alur Persetujuan Bertingkat:** Karyawan $\rightarrow$ Atasan Langsung (Direct Supervisor) $\rightarrow$ HR Admin.
* **Departemen Calendar View:** Visualisasi cuti rekan satu tim agar tidak terjadi kekosongan staf bersamaan.

### 5.5 Modul 5: 360 Feedback (Performance Appraisal)
* **Periode Review:** Pengaturan siklus penilaian kuartalan / semesteran / tahunan.
* **Multi-Evaluator Rater:** Kuesioner dinilai oleh 4 pihak:
  * *Self-evaluation* (Karyawan sendiri)
  * *Superior* (Atasan langsung)
  * *Peers* (Rekan kerja satu divisi)
  * *Subordinates* (Bawahan langsung bagi posisi manajerial)
* **Kuesioner:** Skala Likert 1–5, indikator kompetensi inti, kepemimpinan, dan umpan balik kualitatif (Kelebihan & Area Pengembangan).
* **Radar Chart Visualizer (Recharts):** Spider chart tumpang-tindih membandingkan skor evaluasi diri vs atasan vs rekan kerja, dilengkapi ringkasan KPI untuk rekomendasi promosi.

### 5.6 Modul 6: Crave Canteen
* **Meal Allowance:** Kuota makan harian otomatis aktif bagi karyawan yang terverifikasi hadir (WFO) hari itu.
* **Dynamic QR Code Voucher:** Aplikasi karyawan men-generate QR Code token terenkripsi dengan *countdown timer* 60 detik (*one-time use* untuk mencegah screenshot).
* **Merchant / Canteen Scanner View:** Antarmuka web khusus kasir/merchant kantin (menggunakan webcam laptop atau kamera HP) untuk memindai QR karyawan dalam tempo < 1 detik.
* **Laporan Rekonsiliasi Vendor:** Rekapitulasi bulanan total porsi makan terpakai per vendor kantin untuk dasar penagihan invoice katering.

### 5.7 Modul 7: Reimbursement, Overtime & Visit
* **Klaim Lembur (SPKL):** Pengajuan sebelum lembur atau pelaporan jam lembur setelah selesai kerja dengan upload bukti pengerjaan.
* **Reimbursement:** Form klaim biaya medis, parkir, bensin, kacamata, transportasi dengan pratinjau upload struk/kuitansi fisik.
* **Tugas Lapangan / Visit:** Check-in lokasi klien/proyek di luar kantor dengan validasi geotagging GPS dan swafoto di tempat klien.
* **Approval & Rekapitulasi:** Alur persetujuan berjenjang dan rekap pembayaran klaim yang otomatis digabung ke slip gaji bulanan.

### 5.8 Modul 8: Crave E-Recruitment
* **Career Portal Publik:** Halaman lowongan kerja publik responsive berdesain modern yang terhubung ke daftar lowongan aktif perusahaan.
* **ATS Kanban Pipeline:** Papan Kanban interaktif dengan drag-and-drop tahap kandidat:
  `Applied -> Screening -> Interview HR -> Interview User -> Offering -> Hired / Rejected`.
* **Interview Scheduler & Scorecard:** Catatan penilaian pewawancara, jadwal sesi wawancara, dan integrasi link meeting online.
* **E-Offering Letter:** Generator surat penawaran kerja otomatis dengan tanda tangan digital sederhana.
* **One-Click Onboard to Employee:** Tombol sakelar dari status "Hired" langsung mentransfer data profil pelamar menjadi data akun Karyawan Baru di modul Internal Management.

### 5.9 Modul 9: Multi-Company & Keamanan Sesi
* **Hirarki Multi-Tenant:**
  `Holding Group -> Anak Perusahaan (Subsidiary) -> Cabang (Branch) -> Departemen -> Karyawan`.
* **Global User Identity & Switch Company:**
  * 1 akun email dapat terafiliasi ke beberapa anak perusahaan (contoh: Direksi Holding atau HR Konsolidasi).
  * Dropdown *Switch Company* di sidebar memungkinkan berpindah entitas bisnis tanpa perlu logout.
* **Manajemen Perangkat & Sesi Login (*Device & Session Security*):**
  * Widget pemantau sesi aktif di tab profil (mencatat OS, browser, IP address, waktu login, dan label "Perangkat ini - Aktif sekarang").
  * Tombol `Keluarkan Sesi` dan `Keluarkan Semua Perangkat Lain` untuk perlindungan akun.
* **Audit Trail:** Log pencatatan riwayat manipulasi data sensitif (siapa yang mengubah nominal gaji, mengedit absensi manual, atau membatalkan status cuti).

### 5.10 Modul 10: PWA & Mobile Optimization (ESS)
* **Installable App:** Prompt otomatis "Install Crave HRM" di Chrome, Safari (Add to Home Screen), dan Desktop Windows/Mac.
* **Service Worker & Manifest:** Caching static shell layout, manifest dengan tema `#1B5CFE` dan background `#FFFFFF`.
* **Mobile-First Responsive Layout:** Bottom navigation bar, interaksi sentuh ramah jempol (*thumb-friendly*), dan optimasi akses kamera/geolokasi.

---

## 6. Tech Stack & Command Specifications

### 6.1 Core Stack
* **Backend:** Laravel 13.x (PHP 8.3+)
* **Frontend:** React 19 + Inertia.js v2
* **Styling:** Tailwind CSS v4 + `tw-animate-css`
* **UI Components:** **Shadcn UI (All Components via `npx shadcn@latest add --all`)**
* **Icons:** `lucide-react`
* **Charts:** `recharts` (Radar, Area, Bar, Donut)
* **Document Generation:** `barryvdh/laravel-dompdf`, `maatwebsite/excel`
* **PWA:** `vite-plugin-pwa`

### 6.2 Standard Commands
```bash
# Development
php artisan serve
npm run dev

# Testing & Verification
php artisan test
npm run build

# Code Formatting & Quality
./vendor/bin/pint
npx prettier --write resources/js/
```

---

## 7. Security & Boundary Rules

### 7.1 Always Do:
* Semua query transaksi wajib menggunakan **Tenant Global Scope / filter `company_id`** berdasarkan perusahaan aktif di sesi.
* Enkripsi data sensitif (NIK, nomor rekening bank, besaran gaji pokok, NPWP) di database.
* Terapkan rate-limiting pada endpoint absensi GPS dan klaim token QR kantin.
* Catat setiap aktivitas mutasi data gaji dan presensi ke dalam tabel `audit_logs`.

### 7.2 Ask First:
* Penambahan third-party API berbayar (misal: SMS Gateway, Face Recognition cloud API komersial, Payment Gateway).
* Perubahan skema relasi database `companies`, `branches`, dan `users` inti.

### 7.3 Never Do:
* Menyimpan password, PIN, atau token karyawan dalam plain-text.
* Menjalankan kalkulasi penggajian massal tanpa status verifikasi approval berwenang.
* Mengizinkan absensi GPS lolos jika terdeteksi manipulasi koordinat atau di luar radius geofence kantor.

---

## 8. Success & Acceptance Criteria

1. **Visual Match:** Tampilan dashboard, sidebar, kartu KPI, dan tabel 100% konsisten dengan gaya Crave POS (`oklch` palet biru-putih, Plus Jakarta Sans, sudut membulat 24px, soft shadow).
2. **Complete Component Suite:** Seluruh komponen Shadcn UI terinstal dan berfungsi tanpa error kompilasi Vite/Tailwind.
3. **Multi-Company Scoping:** Admin holding dapat berpindah perusahaan via dropdown, dan data antar anak perusahaan 100% terisolasi tanpa ada kebocoran data.
4. **Attendance Accuracy:** Absensi GPS dengan swafoto berhasil memvalidasi jarak radius meter dan menolak jika berada di luar radius kantor.
5. **Tax & Payroll Precision:** Kalkulasi PPh 21 TER (Kategori A, B, C) dan BPJS menghasilkan angka pemotongan yang presisi sesuai regulasi resmi PP 58/2023.
6. **Canteen Fast Verification:** Pemindaian voucher makan QR dinamis di antarmuka kasir memproses validasi klaim dalam waktu kurang dari 1 detik.
7. **PWA Ready:** Aplikasi dapat di-install di Desktop dan Ponsel melalui browser dengan ikon dan splash screen resmi.
