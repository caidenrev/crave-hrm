import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
  ShieldCheck, Users, Clock, Calendar, DollarSign, UtensilsCrossed,
  Briefcase, ArrowRight, ChevronRight, Sun, Moon, Building2, FileText,
  MapPin, Laptop, ChevronDown, Menu, X, Check, Star, BarChart3,
  Fingerprint, Bell, Settings, QrCode, ExternalLink, HelpCircle,
  Building, Landmark, Lock, CheckCircle2, RefreshCw, Smartphone,
  Layers, ArrowUpRight, Search, Sparkles, Apple, Monitor, Download, Share2,
  PhoneCall, Mail, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePwaStatus, promptPwaInstall } from "@/lib/pwa";

const NAV_LINKS = [
  { href: "#fitur", label: "Fitur" },
  { href: "#kepatuhan", label: "Kepatuhan" },
  { href: "#integrasi", label: "Integrasi" },
  { href: "/careers", label: "Portal Karir", isPage: true },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

const PARTNER_LOGOS = [
  { name: "Bank Central Asia (BCA)", src: "/Logo BCA_Biru.png", height: "h-7 sm:h-8", alt: "Logo BCA" },
  { name: "Bank Mandiri", src: "/Logo MANDIRI_Biru.png", height: "h-6 sm:h-7", alt: "Logo Mandiri" },
  { name: "Bank Rakyat Indonesia (BRI)", src: "/Logo BRI_Biru.png", height: "h-6 sm:h-7", alt: "Logo BRI" },
  { name: "Bank Negara Indonesia (BNI)", src: "/Logo BNI.png", height: "h-6 sm:h-7", alt: "Logo BNI" },
  { name: "BPJS Kesehatan", src: "/images/partners/bpjs-kesehatan.svg", height: "h-7 sm:h-8", alt: "Logo BPJS Kesehatan" },
  { name: "BPJS Ketenagakerjaan", src: "/images/partners/bpjs-ketenagakerjaan.svg", height: "h-7 sm:h-8", alt: "Logo BPJS Ketenagakerjaan" },
  { name: "Ditjen Pajak RI", src: "/images/partners/ditjen-pajak.svg", height: "h-7 sm:h-8", alt: "Logo Ditjen Pajak" },
  { name: "Bank Syariah Indonesia (BSI)", src: "/images/partners/bsi.svg", height: "h-6 sm:h-7", alt: "Logo BSI" },
  { name: "Bank CIMB Niaga", src: "/images/partners/cimb-niaga.svg", height: "h-6 sm:h-7", alt: "Logo CIMB Niaga" },
];

const CORE_MODULES = [
  {
    icon: DollarSign,
    image3d: "/images/icon-payroll-3d.png",
    tag: "Resmi PP 58/2023",
    title: "Payroll & PPh 21 TER 2024",
    desc: "Kalkulasi tarif efektif rata-rata (TER Kategori A, B, C) terintegrasi otomatis dengan split iuran BPJS Kesehatan (4%:1%) dan BPJS Ketenagakerjaan tanpa rumus Excel manual.",
    metric: "0 Kesalahan Hitung Pajak",
  },
  {
    icon: Clock,
    image3d: "/images/icon-attendance-3d.png",
    tag: "Anti-Fake GPS",
    title: "Smart Attendance Geofence",
    desc: "Presensi mobile selfie dengan radius koordinat presisi tinggi dan verifikasi IP publik kantor cabang. Mencegah manipulasi lokasi dan titip absen secara real-time.",
    metric: "99.8% Presisi Radius Lokasi",
  },
  {
    icon: UtensilsCrossed,
    image3d: "/images/icon-canteen-3d.png",
    tag: "TTL 60 Detik",
    title: "Kantin Sehat Digital & QR Pass",
    desc: "Token voucher makan digital berbasis algoritma HMAC-SHA256 yang berganti setiap 60 detik. Anti-screenshot dan tervalidasi cepat oleh kasir kantin dalam 0.3 detik.",
    metric: "< 0.5s Scan Kasir Merchant",
  },
  {
    icon: Calendar,
    image3d: "/images/icon-leave-3d.png",
    tag: "Kalender Resmi",
    title: "Cuti & Izin SKB 3 Menteri",
    desc: "Otomasi saldo cuti tahunan, sinkronisasi kalender hari libur nasional serta cuti bersama pemerintah. Alur persetujuan digital berjenjang atasan langsung dan HRD.",
    metric: "Approval Cepat 1-Klik",
  },
  {
    icon: FileText,
    image3d: "/images/icon-overtime-3d.png",
    tag: "Formula 1/173",
    title: "Lembur PP 35/2021",
    desc: "Penetapan upah lembur resmi berbasis 1/173 upah sebulan dengan penggandaan proporsional: 1.5x untuk jam pertama dan 2x untuk jam kerja berikutnya.",
    metric: "Kepatuhan Hukum 100%",
  },
  {
    icon: Briefcase,
    image3d: "/images/icon-recruitment-3d.png",
    tag: "6-Tahap Kanban",
    title: "E-Recruitment & ATS Pipeline",
    desc: "Portal karir publik, seleksi berkas pelamar dalam papan Kanban intuitif, scorecard wawancara timbal balik, hingga tombol saklar Onboard to Employee dalam 1 klik.",
    metric: "Siklus Rekrutmen 2x Lebih Cepat",
  },
];

const DARK_ENTERPRISE_FEATURES = [
  {
    icon: Building2,
    title: "Isolasi Multi-Tenant Holding",
    desc: "Struktur multi-company fleksibel untuk holding dan anak perusahaan. Data karyawan, absensi, dan payroll terpisah total melalui Global Scope tenant tanpa risiko kebocoran data.",
  },
  {
    icon: ShieldCheck,
    title: "Enkripsi Data Sensitif AES-256",
    desc: "Perlindungan maksimal pada NIK KTP, nomor rekening bank, dan besaran gaji pokok karyawan. Memenuhi standar kepatuhan regulasi UU Perlindungan Data Pribadi (UU PDP No. 27/2022).",
  },
  {
    icon: Laptop,
    title: "PWA Mobile Self-Service",
    desc: "Karyawan tidak perlu mengunduh aplikasi berat dari Play Store. Cukup akses dari peramban ponsel dengan tampilan aplikasi natif untuk presensi selfie, cuti, dan tiket kantin.",
  },
  {
    icon: FileText,
    title: "Generator Batch Transfer Bank",
    desc: "Ekspor berkas penggajian dalam format standar perbankan nasional: BCA Payroll CSV, Mandiri MCM CSV, BRI CMS TXT, dan BNI Direct untuk eksekusi payroll massal instan.",
  },
  {
    icon: Users,
    title: "360-Degree Performance Review",
    desc: "Penilaian performa talenta komprehensif dari 4 sudut pandang: Evaluasi Diri, Atasan Langsung, Rekan Kerja, dan Anggota Tim dengan spider chart kompetensi visual.",
  },
  {
    icon: Bell,
    title: "Audit Trail & Log Transaksi",
    desc: "Pencatatan riwayat setiap perubahan data master, persetujuan lembur, mutasi jabatan, hingga proses cetak slip gaji untuk kebutuhan audit internal dan kepatuhan finansial.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    badge: "Langkah Pertama",
    title: "Setup Entitas & Import Karyawan",
    desc: "Daftarkan perusahaan atau entitas holding Anda, definisikan lokasi cabang geofence, dan unggah data karyawan via template spreadsheet yang tersedia.",
  },
  {
    step: "02",
    badge: "Langkah Kedua",
    title: "Operasional Harian Mandiri (ESS)",
    desc: "Karyawan melakukan presensi selfie GPS dari ponsel, menukar voucher kantin QR 60 detik, serta mengajukan lembur dan cuti secara transparan.",
  },
  {
    step: "03",
    badge: "Langkah Ketiga",
    title: "1-Klik Hitung Payroll & Export Bank",
    desc: "Sistem mengalkulasi gaji, PPh 21 TER 2024, BPJS, dan lembur secara otomatis. Unduh slip gaji PDF dan berkas batch transfer bank siap kirim.",
  },
];

const FAQS = [
  {
    q: "Apakah perhitungan pajak PPh 21 sudah mematuhi skema TER 2024 terbaru?",
    a: "Ya, 100% patuh dan terverifikasi sesuai Peraturan Pemerintah No. 58 Tahun 2023 dan PMK 168/2023. Crave HRM secara otomatis mengelompokkan karyawan ke Kategori TER A, TER B, atau TER C berdasarkan status PTKP (TK/0 hingga K/3) dan nominal penghasilan bruto per masa pajak bulanan.",
  },
  {
    q: "Bagaimana cara kerja voucher kantin dynamic QR 60 detik mencegah kecurangan?",
    a: "Setiap token QR yang dihasilkan aplikasi dienkripsi menggunakan algoritma cryptographic hash (HMAC-SHA256) dengan Time-To-Live (TTL) tepat 60 detik. Tangkapan layar (screenshot) tidak akan valid saat dipindai kasir karena token telah kadaluwarsa, dan voucher langsung hangus berstatus 'Sudah Digunakan' setelah 1 kali pemindaian.",
  },
  {
    q: "Apakah data antar anak perusahaan dalam satu holding group bisa bocor?",
    a: "Tidak bisa. Arsitektur Crave HRM dibangun di atas prinsip isolasi multi-tenant ketat menggunakan Laravel Eloquent Global Scope (BelongsToCompany). Seluruh kueri data karyawan, presensi, slip gaji, dan saldo cuti selalu terkunci secara absolut pada company_id aktif pengguna.",
  },
  {
    q: "Bagaimana sistem memastikan presensi GPS selfie tidak dimanipulasi dengan fake GPS?",
    a: "Sistem Crave HRM menerapkan pemeriksaan berlapis: validasi lintang dan bujur dengan radius geofence kantor meter-presisi, verifikasi IP publik koneksi internet kantor cabang, serta pengambilan foto selfie langsung dari sensor kamera perangkat tanpa akses upload dari galeri.",
  },
  {
    q: "Apakah format file penggajian kompatibel dengan perbankan nasional Indonesia?",
    a: "Sangat kompatibel. Crave HRM menyediakan fitur generator file batch transfer siap pakai untuk perbankan utama Indonesia, termasuk KlikBCA Bisnis (format CSV payroll), Mandiri Corporate Portal MCM 2.0 (format CSV), BRI CMS TXT, dan BNI Direct TXT.",
  },
  {
    q: "Apakah karyawan diwajibkan menginstal aplikasi berat dari Google Play Store?",
    a: "Tidak wajib. Crave HRM dirancang menggunakan teknologi Progressive Web App (PWA) modern. Karyawan cukup membuka tautan web melalui peramban ponsel pintar dan dapat menyimpannya ke layar utama (Add to Home Screen) dengan konsumsi penyimpanan yang sangat ringan.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rina Sulistyo",
    role: "Head of People & Culture",
    company: "PT Sinergi Abadi Perkasa",
    avatar: "/images/testimonial-rina.png",
    quote: "Sebelum menggunakan Crave HRM, tim payroll kami menghabiskan waktu 4 hari setiap akhir bulan untuk merekonsiliasi TER PPh 21 dan potongan BPJS. Kini seluruh slip gaji 650 karyawan selesai dihitung otomatis dalam kurun waktu kurang dari 2 jam.",
    stat1: "85%",
    stat1Label: "Penghematan Waktu Payroll",
    stat2: "0%",
    stat2Label: "Deviasi Salah Hitung Pajak",
  },
  {
    name: "Budi Hartono",
    role: "Chief Operating Officer",
    company: "Garuda Nusantara Holding",
    avatar: "/images/testimonial-budi.png",
    quote: "Keunggulan utama Crave HRM adalah kemampuan multi-company tenancynya. Kami mengelola 8 anak perusahaan dari satu dasbor terpadu dengan kepastian nol kebocoran data antar entitas, lengkap dengan voucher kantin digital yang sangat disukai karyawan.",
    stat1: "8",
    stat1Label: "Anak Perusahaan Terkelola",
    stat2: "100%",
    stat2Label: "Kepatuhan UU PDP & Pajak",
  },
];

const ARTICLES = [
  {
    title: "Panduan Lengkap PPh 21 Skema TER 2024: Memahami Kategori A, B, dan C Sesuai PP 58/2023",
    author: "Tim Ahli Regulasi Crave",
    date: "14 November 2026",
    tag: "Perpajakan",
    image: "/images/blog-ter2024.png",
    readTime: "5 menit baca",
  },
  {
    title: "Mencegah Titip Absen & Fake GPS pada Operasional Lapangan: Tinjauan Arsitektur Geofence",
    author: "Divisi Keamanan Sistem Crave",
    date: "10 November 2026",
    tag: "Teknologi HR",
    image: "/images/blog-gps.png",
    readTime: "4 menit baca",
  },
  {
    title: "Otomasi Subsidi Makan Karyawan: Mengapa Voucher QR Dinamis Lebih Efektif Dibanding Kupon Fisik",
    author: "Tim Manajemen Fasilitas Crave",
    date: "06 November 2026",
    tag: "Operasional",
    image: "/images/blog-canteen.png",
    readTime: "3 menit baca",
  },
];

export default function Landing({ auth, stats = {} }) {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [activeGrowthTab, setActiveGrowthTab] = useState(0);
  const [qrCountdown, setQrCountdown] = useState(58);

  // PWA Reactive Status & Prompt Hook (Paritas Sistem SIBK)
  const pwaStatus = usePwaStatus(); // "bisa" | "terpasang" | "ios" | "tidak"

  // Dynamic Client Platform Detection (Desktop, iOS, Android, macOS, Windows)
  const [clientPlatform, setClientPlatform] = useState({
    os: "desktop",
    heroLabel: "Install di Desktop",
    icon: Monitor,
  });
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    const platform = window.navigator.platform || "";

    if (/iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      setClientPlatform({
        os: "ios",
        heroLabel: "Install di iPhone / iPad",
        icon: Apple,
      });
    } else if (/Android/i.test(ua)) {
      setClientPlatform({
        os: "android",
        heroLabel: "Install di Android",
        icon: Smartphone,
      });
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua)) {
      setClientPlatform({
        os: "macos",
        heroLabel: "Install di Mac",
        icon: Apple,
      });
    } else if (/Win32|Win64|Windows|WinCE/i.test(ua)) {
      setClientPlatform({
        os: "windows",
        heroLabel: "Install di Windows",
        icon: Monitor,
      });
    } else {
      setClientPlatform({
        os: "desktop",
        heroLabel: "Install Crave HRM",
        icon: Download,
      });
    }
  }, []);

  // Jika dibuka di dalam PWA mode (standalone) setelah di-install: langsung arahkan ke login atau dasbor (jangan di landing)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      if (auth?.user) {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/login");
      }
    }
  }, [auth]);

  const handleDirectInstall = async () => {
    if (pwaStatus === "ios" || clientPlatform.os === "ios") {
      setShowIosGuide(true);
      return;
    }

    const success = await promptPwaInstall();
    if (success) {
      window.location.replace("/login");
      return;
    }

    if (!success && pwaStatus !== "terpasang") {
      setShowDesktopGuide(true);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("crave-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Dynamic 60s countdown ticker for interactive Canteen Pass showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("crave-theme", next ? "dark" : "light");
  };

  const user = auth?.user;

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.006_250)] text-[oklch(0.22_0.03_258)] font-[Plus_Jakarta_Sans,sans-serif] antialiased overflow-x-clip selection:bg-[oklch(0.54_0.19_258_/_0.15)] selection:text-[oklch(0.54_0.19_258)]">
      <Head title="Crave HRM: Platform Manajemen SDM, Pajak PPh 21 TER 2024 dan Payroll Indonesia" />

      {/* S01: MINIMALIST TOP NAVIGATION BAR (Fixed Glassmorphism) */}
      <header className="fixed top-0 inset-x-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-white/70 transition-all">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/light-mode-logo.png"
              alt="Crave Logo"
              className="h-7.5 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-[18px] tracking-[-0.03em] text-[#111827]">
              Crave <span className="text-[#6B7280]">HRM</span>
            </span>
          </Link>

          {/* Minimalist Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#4B5563]">
            {NAV_LINKS.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#111827] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#111827] transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Clean Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center h-[38px] px-4.5 rounded-xl bg-[#161924] hover:bg-[#232738] text-white text-[13px] font-semibold transition-colors shadow-2xs"
              >
                Buka Dasbor
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center h-[38px] px-3.5 text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-[38px] px-4.5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13px] font-semibold shadow-[0_4px_12px_-2px_oklch(0.54_0.19_258_/_0.35)] transition-colors"
                >
                  Mulai Gratis
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#4B5563] hover:text-[#111827]"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Dropdown Menu (Glass Effect) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.04] bg-white/85 backdrop-blur-xl px-6 py-4 space-y-2.5 shadow-lg">
            {NAV_LINKS.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[14px] font-semibold text-[#111827] py-1.5 hover:text-[oklch(0.54_0.19_258)] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[14px] font-semibold text-[#111827] py-1.5 hover:text-[oklch(0.54_0.19_258)] transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="pt-3 border-t border-[#F1F2F6] flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 h-9.5 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[13px] font-semibold text-[#111827]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 h-9.5 rounded-xl bg-[oklch(0.54_0.19_258)] text-white flex items-center justify-center text-[13px] font-bold"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-[64px]">
        {/* S02: HERO SECTION (Refined Typography & Floating Dashboard Matching Qarin Reference) */}
        <section className="w-full pt-[56px] pb-[40px] px-4 sm:px-6">
          <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center">
            {/* Handwriting Eyebrow with Animated Doodle Arrow (Gambar 3 Replaced) */}
            <div className="inline-flex items-center gap-2 mb-4 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
              <span className="text-[22px] sm:text-[25px] font-bold tracking-wide animate-write-in">
                SaaS Human Resource Management Indonesia
              </span>
              <svg
                width="34"
                height="24"
                viewBox="0 0 34 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current animate-draw-stroke shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M2 4C11 3 24 6 28 17M28 17L22 14M28 17L31 10"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Hero Heading: Minimalist, Bold & Executive */}
            <h1 className="font-extrabold text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.14] tracking-[-0.035em] text-[#111827] max-w-[740px] mb-4 text-balance">
              Otomatisasi Manajemen SDM &{" "}
              <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                Payroll Terpadu
                {/* Hand-drawn Double Underline Highlight */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-[12px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                  viewBox="0 0 240 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8C65 2 155 10 237 4M15 11C85 6 175 11 225 8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Hero Subtitle: Crisp, Minimalist & Benefit-Driven */}
            <p className="text-[15px] sm:text-[16.5px] leading-[1.6] text-[#4B5563] max-w-[560px] mb-8 text-balance">
              Dari absensi GPS, cuti, hingga kalkulasi PPh 21 TER 2024 dan BPJS resmi. Semua terkelola otomatis, akurat, dan 100% patuh regulasi.
            </p>

            {/* Hero Single Smart Download Button + Contact Sales */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
              {pwaStatus === "terpasang" ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2.5 h-[50px] px-7 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[14.5px] font-bold shadow-[0_8px_20px_-4px_oklch(0.54_0.19_258_/_0.45)] transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="size-5 shrink-0" />
                  <span>Buka Crave HRM (Aplikasi Terpasang)</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  className="inline-flex items-center justify-center gap-2.5 h-[50px] px-7 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[14.5px] font-bold shadow-[0_8px_20px_-4px_oklch(0.54_0.19_258_/_0.45)] transition-all active:scale-[0.98] cursor-pointer"
                >
                  <clientPlatform.icon className="size-5 shrink-0" />
                  <span>{clientPlatform.heroLabel}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowContactSales(true)}
                className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] text-[14px] font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="size-4" />
                <span>Contact Sales</span>
              </button>
            </div>

            {/* Platform Subline: Pure Clean Reassurance Without Split-Dropdown Clutter */}

            {/* Clean Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[12.5px] sm:text-[13px] font-medium text-[#4B5563] mb-14 relative z-20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#059669]" />
                <span>Kepatuhan PP 58/2023 & BPJS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#059669]" />
                <span>Isolasi Multi-Company Holding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#059669]" />
                <span>PWA Mobile & Desktop Terintegrasi</span>
              </div>
            </div>

            {/* Hero Dashboard Stage with Vertical-Ribbed Blue Gradient Backdrop (Fade di Atas) */}
            <div className="relative w-full max-w-[1240px] mx-auto rounded-3xl overflow-hidden pt-8 sm:pt-12 px-4 sm:px-8 lg:px-[72px] pb-12 sm:pb-16 bg-gradient-to-b from-white via-[#758AFF] to-[#2E4CF1] border border-[#E2E8FF] shadow-xl">
              {/* Vertical Ribbed Stripes Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)" }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={cn("bg-gradient-to-r from-white/10 to-transparent", i < 23 && "border-r border-white/40")} />
                ))}
              </div>

              {/* Top White Soft Fade Overlay */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />

              {/* Main Floating Dashboard Window */}
              <div className="relative z-10 w-full max-w-[1040px] mx-auto bg-white rounded-2xl shadow-[0_24px_60px_-15px_rgba(14,25,77,0.30)] border border-[#E5E7EB] p-5 sm:p-7 text-left">
                {/* Dashboard Top Bar */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2.5">
                    <img src="/light-mode-logo.png" alt="Crave Logo" className="size-6 object-contain" />
                    <span className="font-extrabold text-[14px] text-[#111827]">Crave HRM Workspace</span>
                    <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold">
                      Multi-Tenant Aktif
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <span className="px-3 py-1 rounded-[6px] bg-[#161924] text-white text-[11px] font-semibold">Ringkasan</span>
                    <span className="px-2.5 py-1 text-[11px] font-medium text-[#6B7280]">Payroll & Pajak</span>
                    <span className="px-2.5 py-1 text-[11px] font-medium text-[#6B7280]">Presensi GPS</span>
                    <span className="px-2.5 py-1 text-[11px] font-medium text-[#6B7280]">Kantin QR</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
                      <Bell className="size-3.5" />
                    </span>
                    <div className="flex items-center gap-1.5 pl-1">
                      <span className="size-7 rounded-full bg-[oklch(0.54_0.19_258)] text-white flex items-center justify-center text-[10px] font-bold">
                        ER
                      </span>
                      <span className="hidden md:inline text-[11px] font-semibold text-[#111827]">Eka Revandi</span>
                    </div>
                  </div>
                </div>

                {/* Greeting & Quick Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-[17px] font-bold text-[#111827]">Selamat pagi, Tim HR Holding</h2>
                    <p className="text-[12px] text-[#6B7280]">Ikhtisar real-time kepatuhan PPh 21 TER 2024, presensi GPS, dan operasional talenta.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] font-medium text-[#374151]">
                      Masa Pajak November 2026
                    </span>
                    <span className="px-3 py-1.5 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] font-medium text-[#374151]">
                      Export Batch Bank
                    </span>
                  </div>
                </div>

                {/* 4 KPI Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] text-[oklch(0.54_0.19_258)]">
                    <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                      <span>Tingkat Kehadiran</span>
                      <Clock className="size-3.5" />
                    </div>
                    <div className="text-[18px] font-black text-[#111827]">98.4%</div>
                    <div className="text-[10px] text-[#059669] font-semibold mt-0.5">+3.2% On-Time</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#6B7280] mb-1">
                      <span>Karyawan Aktif</span>
                      <Users className="size-3.5" />
                    </div>
                    <div className="text-[18px] font-black text-[#111827]">650</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Holding Group</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#6B7280] mb-1">
                      <span>Approval Pending</span>
                      <CheckCircle2 className="size-3.5" />
                    </div>
                    <div className="text-[18px] font-black text-[#111827]">0</div>
                    <div className="text-[10px] text-[#059669] font-semibold mt-0.5">Semua Beres</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#6B7280] mb-1">
                      <span>Estimasi Payroll</span>
                      <DollarSign className="size-3.5" />
                    </div>
                    <div className="text-[18px] font-black text-[#111827]">Rp 348.65M</div>
                    <div className="text-[10px] text-[#059669] font-semibold mt-0.5">TER 100% Sesuai</div>
                  </div>
                </div>

                {/* Dashboard Grid: Real Crave HRM Components */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Column (6 cols): The User's Exact "Aksi Cepat Operasional" Widget */}
                  <div className="lg:col-span-6 rounded-2xl border border-[#ECEEF4] bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-extrabold text-[15px] text-[#111827]">Aksi Cepat Operasional</h3>
                          <p className="text-[12px] text-[#6B7280]">Pintasan navigasi modul inti Crave HRM</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full border border-[#E5E7EB] text-[#4B5563] text-[11px] font-medium bg-[#F9FAFB]">
                          SaaS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {/* 1. Proses Payroll */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#F1F2F6] bg-[#FBFBFE] hover:border-[#E2E8FF] transition-colors">
                          <div className="size-9 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                            <FileText className="size-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-[#111827]">Proses Payroll</p>
                            <p className="text-[11px] text-[#6B7280]">PPh 21 & BPJS</p>
                          </div>
                        </div>

                        {/* 2. Recruitment ATS */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#F1F2F6] bg-[#FBFBFE] hover:border-[#E2E8FF] transition-colors">
                          <div className="size-9 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                            <Briefcase className="size-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-[#111827]">Recruitment ATS</p>
                            <p className="text-[11px] text-[#6B7280]">Kanban Pelamar</p>
                          </div>
                        </div>

                        {/* 3. Persetujuan Cuti */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#F1F2F6] bg-[#FBFBFE] hover:border-[#E2E8FF] transition-colors">
                          <div className="size-9 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                            <Calendar className="size-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-[#111827]">Persetujuan Cuti</p>
                            <p className="text-[11px] text-[#6B7280]">Antrean Approval</p>
                          </div>
                        </div>

                        {/* 4. Matriks Izin RBAC */}
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#F1F2F6] bg-[#FBFBFE] hover:border-[#E2E8FF] transition-colors">
                          <div className="size-9 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-[#111827]">Matriks Izin RBAC</p>
                            <p className="text-[11px] text-[#6B7280]">Wewenang 5 Peran</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F1F2F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Crave HRM SaaS v2.0</span>
                      <span className="font-bold text-[oklch(0.54_0.19_258)]">Crave Global Group</span>
                    </div>
                  </div>

                  {/* Right Column (6 cols): Komposisi Beban SDM per Fungsi (Stacked Bar Chart with Distinct Layer Colors) */}
                  <div className="lg:col-span-6 rounded-2xl border border-[#ECEEF4] bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-extrabold text-[15px] text-[#111827]">Komposisi Beban SDM per Fungsi</h3>
                          <p className="text-[11px] text-[#6B7280]">Alokasi kompensasi & beban operasional tenaga kerja</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] text-[10.5px] font-semibold text-[#374151]">
                          Bulanan
                        </span>
                      </div>

                      {/* Multi-Layer Stacked Bar Visualization */}
                      <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#F3F4F6]">
                        {/* Month 1 */}
                        <div className="w-full flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse rounded-t-[4px] overflow-hidden">
                            <div className="w-full h-[48px] bg-[oklch(0.54_0.19_258)]" title="Gaji Pokok" />
                            <div className="w-full h-[18px] bg-[#6982FF]" title="Tunjangan" />
                            <div className="w-full h-[12px] bg-[#10B981]" title="Lembur PP 35" />
                            <div className="w-full h-[8px] bg-[#F59E0B]" title="BPJS" />
                          </div>
                          <span className="text-[10px] text-[#6B7280]">Agt</span>
                        </div>
                        {/* Month 2 */}
                        <div className="w-full flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse rounded-t-[4px] overflow-hidden">
                            <div className="w-full h-[54px] bg-[oklch(0.54_0.19_258)]" title="Gaji Pokok" />
                            <div className="w-full h-[20px] bg-[#6982FF]" title="Tunjangan" />
                            <div className="w-full h-[14px] bg-[#10B981]" title="Lembur PP 35" />
                            <div className="w-full h-[9px] bg-[#F59E0B]" title="BPJS" />
                          </div>
                          <span className="text-[10px] text-[#6B7280]">Sep</span>
                        </div>
                        {/* Month 3 */}
                        <div className="w-full flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse rounded-t-[4px] overflow-hidden">
                            <div className="w-full h-[58px] bg-[oklch(0.54_0.19_258)]" title="Gaji Pokok" />
                            <div className="w-full h-[22px] bg-[#6982FF]" title="Tunjangan" />
                            <div className="w-full h-[16px] bg-[#10B981]" title="Lembur PP 35" />
                            <div className="w-full h-[10px] bg-[#F59E0B]" title="BPJS" />
                          </div>
                          <span className="text-[10px] text-[#6B7280]">Okt</span>
                        </div>
                        {/* Month 4 (Current) */}
                        <div className="w-full flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse rounded-t-[4px] overflow-hidden ring-2 ring-[oklch(0.54_0.19_258)] ring-offset-2">
                            <div className="w-full h-[64px] bg-[oklch(0.54_0.19_258)]" title="Gaji Pokok" />
                            <div className="w-full h-[24px] bg-[#6982FF]" title="Tunjangan" />
                            <div className="w-full h-[18px] bg-[#10B981]" title="Lembur PP 35" />
                            <div className="w-full h-[11px] bg-[#F59E0B]" title="BPJS" />
                          </div>
                          <span className="text-[10px] font-bold text-[#111827]">Nov '26</span>
                        </div>
                      </div>

                      {/* Legend Indicators with Layer Colors */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2">
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="size-2.5 rounded-full bg-[oklch(0.54_0.19_258)]" />
                          <span className="text-[#6B7280] font-medium">Gaji Pokok</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="size-2.5 rounded-full bg-[#6982FF]" />
                          <span className="text-[#6B7280] font-medium">Tunjangan</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="size-2.5 rounded-full bg-[#10B981]" />
                          <span className="text-[#6B7280] font-medium">Lembur PP 35</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="size-2.5 rounded-full bg-[#F59E0B]" />
                          <span className="text-[#6B7280] font-medium">BPJS & Manfaat</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F1F2F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Total Periode Ini: <strong className="text-[#111827]">Rp 348.650.000</strong></span>
                      <span className="text-[#059669] font-bold">TER 100% Sesuai Aturan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S03: INFINITE MARQUEE PARTNER & BANK LOGO LOOP */}
        <section className="w-full py-10 bg-white border-y border-[#F1F2F6] overflow-hidden">
          <div className="max-w-[1240px] mx-auto text-center px-4 mb-7">
            <p className="text-[12.5px] sm:text-[13px] font-bold text-[#6B7280] tracking-wider uppercase">
              Terintegrasi Resmi dengan Ekosistem Perbankan & Lembaga Ketenagakerjaan Indonesia
            </p>
          </div>

          {/* Marquee Wrapper with Left & Right Gradient Fade */}
          <div className="relative w-full overflow-hidden mask-fade-edges">
            {/* Left Edge Gradient Fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-white to-transparent z-10" />

            {/* Right Edge Gradient Fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Seamless Infinite Looping Track */}
            <div className="animate-marquee-infinite flex items-center gap-10 sm:gap-16 py-2">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex items-center justify-center shrink-0 px-2 group cursor-pointer"
                  title={partner.name}
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className={cn(
                      partner.height,
                      "w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105 select-none"
                    )}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S04: BENTO GRID FEATURE SECTION + BLUE KPI BANNER */}
        <section id="fitur" className="w-full py-20 px-4 sm:px-6 bg-[#FBFBFB]">
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center mb-14">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Kenali Fitur Unggulan Crave HRM
                </span>
                <svg
                  width="30"
                  height="22"
                  viewBox="0 0 30 22"
                  fill="none"
                  className="stroke-current animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 20 6 23 15M23 15L18 13M23 15L26 9"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[640px] mb-4 text-balance">
                Semua yang Anda butuhkan untuk kelola talenta &{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  kepatuhan regulasi
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                    viewBox="0 0 180 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7C45 2 110 8 178 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-[15px] leading-[1.6] text-[#6B7280] max-w-[640px] text-balance">
                Crave HRM menyatukan absensi GPS, otomatisasi PPh 21 TER 2024, tiket kantin digital, dan pipeline rekrutmen dalam satu ekosistem tanpa gesekan.
              </p>
            </div>

            {/* Bento Grid (Left 2 Stacked Cards + Right 1 Tall Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Left Column (6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Top-Left: Smart Attendance Geofence */}
                <article className="rounded-2xl bg-[#F4F5FA] border border-[#ECEEF6] p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src="/images/icon-attendance-3d.png" alt="Presensi 3D" className="size-9 object-contain drop-shadow-xs" />
                      <span className="text-[11px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider block">
                        Anti-Titip Absen
                      </span>
                    </div>
                    <h3 className="font-bold text-[19px] leading-[1.3] text-[#111827] mb-2.5">
                      Presensi GPS & Whitelist IP
                    </h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">
                      Validasi lokasi meter-presisi dengan geofence radius kantor dan selfie anti-fake GPS real-time.
                    </p>
                  </div>
                  <div className="sm:col-span-6 bg-white rounded-xl p-4 shadow-xs border border-[#F1F2F6]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11.5px] font-bold text-[#111827]">Tingkat On-Time</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] font-bold">98.6%</span>
                    </div>
                    <div className="flex items-end justify-between gap-1.5 h-[90px] pt-4 px-1">
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full h-[40px] rounded-t-[3px] bg-[#6982FF]" />
                        <span className="text-[9px] text-[#9CA3AF]">Sen</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full h-[65px] rounded-t-[3px] bg-[oklch(0.54_0.19_258)]" />
                        <span className="text-[9px] text-[#9CA3AF]">Sel</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full h-[55px] rounded-t-[3px] bg-[#6982FF]" />
                        <span className="text-[9px] text-[#9CA3AF]">Rab</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full h-[80px] rounded-t-[3px] bg-[oklch(0.48_0.20_258)]" />
                        <span className="text-[9px] font-bold text-[#111827]">Kam</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full h-[70px] rounded-t-[3px] bg-[oklch(0.54_0.19_258)]" />
                        <span className="text-[9px] text-[#9CA3AF]">Jum</span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Bottom-Left: Canteen Pass Dynamic QR 60s */}
                <article className="rounded-2xl bg-[#F4F5FA] border border-[#ECEEF6] p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img src="/images/icon-canteen-3d.png" alt="Kantin 3D" className="size-9 object-contain drop-shadow-xs" />
                      <span className="text-[11px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider block">
                        One-Time Use (HMAC)
                      </span>
                    </div>
                    <h3 className="font-bold text-[19px] leading-[1.3] text-[#111827] mb-2.5">
                      Voucher Kantin QR 60 Detik
                    </h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">
                      Token makan berganti setiap 60 detik anti-screenshot. Scan kasir instan kurang dari 0.5 detik.
                    </p>
                  </div>
                  <div className="sm:col-span-6 bg-white rounded-xl p-4 shadow-xs border border-[#F1F2F6]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="size-4 text-[oklch(0.54_0.19_258)]" />
                        <span className="text-[12px] font-bold text-[#111827]">Voucher Aktif</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] font-mono text-[10.5px] font-bold">
                        {qrCountdown}s
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] text-center">
                      <div className="text-[11px] text-[#6B7280]">Subsidi Makan Siang Karyawan</div>
                      <div className="text-[14px] font-black text-[oklch(0.54_0.19_258)]">Rp 25.000 / porsi</div>
                      <div className="text-[9.5px] text-[#10B981] font-semibold mt-1">Status: Siap Pindai di Merchant</div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Right Column (6 cols): Tall Card - Real-Time Payroll & Tax Compliance */}
              <article className="lg:col-span-6 rounded-2xl bg-[#F4F5FA] border border-[#ECEEF6] p-6 sm:p-8 flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/images/icon-payroll-3d.png" alt="Payroll 3D" className="size-11 object-contain drop-shadow-xs" />
                    <div>
                      <span className="text-[11px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider block">
                        Kepatuhan Perpajakan
                      </span>
                      <h3 className="font-bold text-[20px] leading-[1.3] text-[#111827]">
                        Kalkulator Otomatis PPh 21 TER & BPJS
                      </h3>
                    </div>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-[#6B7280] max-w-[480px]">
                    Klasifikasi Kategori TER A, B, atau C berbasis PTKP secara matematis presisi tanpa salah hitung. Cetak slip gaji dan file batch bank dalam 1 klik.
                  </p>
                </div>

                {/* SVG Smooth Area Line Chart */}
                <div className="bg-white rounded-xl p-5 shadow-xs border border-[#F1F2F6]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#10B981]" />
                      <span className="text-[12.5px] font-bold text-[#111827]">Kepatuhan Payroll Perusahaan</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[11px] font-bold text-[#111827]">100% Sesuai Aturan</span>
                  </div>

                  <div className="w-full h-[180px] relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" fill="none">
                      <defs>
                        <linearGradient id="payrollAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="35" x2="500" y2="35" stroke="#F3F4F6" strokeWidth="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#F3F4F6" strokeWidth="1" />
                      <line x1="0" y1="125" x2="500" y2="125" stroke="#F3F4F6" strokeWidth="1" />
                      <line x1="0" y1="170" x2="500" y2="170" stroke="#F3F4F6" strokeWidth="1" />

                      <path d="M0,140 C50,135 90,150 140,115 C190,80 230,110 280,75 C330,40 380,60 430,35 C465,20 485,30 500,25 L500,170 L0,170 Z" fill="url(#payrollAreaGrad)" />
                      <path d="M0,140 C50,135 90,150 140,115 C190,80 230,110 280,75 C330,40 380,60 430,35 C465,20 485,30 500,25" stroke="#3B5BFF" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="430" cy="35" r="4.5" fill="#3B5BFF" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </article>
            </div>

            {/* Blue KPI Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[oklch(0.54_0.19_258)] via-[#5470FF] to-[#6E86FF] p-8 sm:p-10 text-white overflow-hidden shadow-[0_16px_40px_-12px_rgba(59,91,255,0.4)]">
              <div className="absolute -right-12 -bottom-16 size-[280px] rounded-full bg-[#2544E8]/40 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-white/20">
                <div className="lg:pr-6">
                  <div className="font-black text-[30px] sm:text-[36px] leading-tight mb-2">#1</div>
                  <p className="text-[13.5px] text-white/90 leading-[1.5]">SaaS HRM Kepatuhan Regulasi Ketenagakerjaan Indonesia</p>
                </div>
                <div className="lg:px-6">
                  <div className="font-black text-[30px] sm:text-[36px] leading-tight mb-2">100%</div>
                  <p className="text-[13.5px] text-white/90 leading-[1.5]">Kepatuhan TER PPh 21 (PP 58/2023) & BPJS Kesehatan/TK</p>
                </div>
                <div className="lg:px-6">
                  <div className="font-black text-[30px] sm:text-[36px] leading-tight mb-2">60s</div>
                  <p className="text-[13.5px] text-white/90 leading-[1.5]">TTL Dinamis Token QR Kantin Anti-Screenshot & Kecurangan</p>
                </div>
                <div className="lg:pl-6">
                  <div className="font-black text-[30px] sm:text-[36px] leading-tight mb-2">0-Leak</div>
                  <p className="text-[13.5px] text-white/90 leading-[1.5]">Jaminan Isolasi Data Total pada Struktur Multi-Tenant Holding</p>
                </div>
              </div>
            </div>

            {/* 6 Core Modules 3D Showcase Grid (Generated by Nano Banana) */}
            <div className="mt-14">
              <div className="text-center max-w-[580px] mx-auto mb-10">
                {/* Handwriting Eyebrow with Doodle Arrow */}
                <div className="inline-flex items-center gap-2 mb-2 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                  <span className="text-[20px] sm:text-[22px] font-bold tracking-wide animate-write-in">
                    Modul Terlengkap & Siap Pakai
                  </span>
                  <svg
                    width="26"
                    height="18"
                    viewBox="0 0 26 18"
                    fill="none"
                    className="stroke-current animate-draw-stroke shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 3C8 3 17 5 20 13M20 13L15 11M20 13L23 7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-black text-[24px] sm:text-[28px] text-[#111827] mb-2.5">
                  6 Modul Inti{" "}
                  <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                    Terintegrasi End-to-End
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-[8px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                      viewBox="0 0 200 8"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5C50 1 140 7 198 2"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h3>
                <p className="text-[14px] text-[#6B7280]">
                  Dirancang dengan standar UI modern setara Crave POS, cepat, andal, dan ramah pengguna.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CORE_MODULES.map((mod) => (
                  <article
                    key={mod.title}
                    className="rounded-2xl bg-white border border-[#ECEEF6] p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#D8E0FF] transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-16 rounded-2xl bg-[#F8FAFC] border border-[#F1F2F6] p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <img src={mod.image3d} alt={mod.title} className="size-12 object-contain drop-shadow-sm" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#F5F7FF] border border-[#E2E8FF] text-[oklch(0.54_0.19_258)] text-[11px] font-bold">
                          {mod.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-[18px] text-[#111827] mb-2 group-hover:text-[oklch(0.54_0.19_258)] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-[13.5px] leading-[1.6] text-[#6B7280] mb-4">
                        {mod.desc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#F8F9FA] flex items-center justify-between text-[11.5px] font-bold text-[oklch(0.54_0.19_258)]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-[#10B981]" />
                        <span>{mod.metric}</span>
                      </span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* S05: VISIBILITY / COMPLIANCE DEEP DIVE WITH REAL TEAM PHOTO */}
        <section id="kepatuhan" className="w-full py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 pr-0 lg:pr-4">
              <span className="text-[12px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider block mb-2">
                Kepatuhan Tanpa Kompromi
              </span>
              <h2 className="font-black text-[32px] sm:text-[38px] leading-[1.18] tracking-[-0.025em] text-[#111827] mb-4">
                Visibilitas penuh ke setiap aksi SDM dan penggajian
              </h2>
              <p className="text-[14.5px] leading-[1.6] text-[#6B7280] mb-8">
                Crave HRM meniadakan kebingungan administrasi ketenagakerjaan dengan formula baku terprogram, audit trail lengkap, dan isolasi tenant aman.
              </p>

              <div className="divide-y divide-[#F1F2F6] border-t border-b border-[#F1F2F6]">
                <div className="py-4 flex items-start gap-3">
                  <span className="mt-1 size-5 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937]">
                    Kalkulasi TER A, B, C dan evaluasi PPh 21 Masa Desember secara otomatis
                  </span>
                </div>
                <div className="py-4 flex items-start gap-3">
                  <span className="mt-1 size-5 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937]">
                    Upah lembur resmi PP 35/2021 dengan pengali 1/173 tersinkronisasi presensi
                  </span>
                </div>
                <div className="py-4 flex items-start gap-3">
                  <span className="mt-1 size-5 rounded-full bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </span>
                  <span className="text-[14px] font-medium text-[#1F2937]">
                    Pencegahan manipulasi lokasi dengan proteksi Mock Location & fake GPS
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Column: Operational Efficiency Card with Generated Team Photo */}
            <div className="lg:col-span-3 flex flex-col gap-4 pt-6 lg:pt-10">
              <div className="rounded-2xl overflow-hidden aspect-[18/24] bg-[#E0E7FF] shadow-md relative group">
                <img
                  src="/images/team-collaboration.png"
                  alt="Tim Profesional Crave HRM"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-[oklch(0.54_0.19_258)] to-[#2E4CF1] p-6 text-white shadow-md">
                <div className="font-black text-[32px] leading-none mb-2">72%</div>
                <div className="text-[13.5px] font-bold leading-snug mb-2">Peningkatan Efisiensi Operasional HR</div>
                <p className="text-[11.5px] text-white/80 leading-relaxed">
                  Berdasarkan riset pada perusahaan yang beralih ke Crave HRM sedikitnya 6 bulan.
                </p>
              </div>
            </div>

            {/* Right Column: Striped Blue Panel with Radial Chart Card (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[oklch(0.54_0.19_258)] via-[#6982FF] to-[#D8E0FF] p-6 sm:p-8 min-h-[430px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-25" style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={i < 9 ? "border-r border-white/40" : ""} />
                ))}
              </div>

              {/* White Radial Progress Card */}
              <div className="relative z-10 w-full bg-white rounded-xl p-5 shadow-lg border border-[#F1F2F6]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-[#111827]">Tingkat Kehadiran Kerja</span>
                  <span className="text-[10px] text-[#9CA3AF]">Holding Group</span>
                </div>
                <div className="flex items-center justify-center py-3">
                  <div className="relative size-[150px] flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="46" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                      <circle cx="60" cy="60" r="46" stroke="#38BDF8" strokeWidth="12" strokeDasharray="210 289" strokeLinecap="round" fill="none" />
                      <circle cx="60" cy="60" r="46" stroke="oklch(0.54 0.19 258)" strokeWidth="12" strokeDasharray="140 289" strokeDashoffset="-30" strokeLinecap="round" fill="none" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-black text-[24px] text-[#111827]">98.6%</span>
                      <span className="text-[10px] text-[#6B7280]">Target Tercapai</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 text-[10.5px] text-[#6B7280] border-t border-[#F3F4F6]">
                  <span>Total Karyawan: 1.250</span>
                  <span className="font-bold text-[#111827]">Hadir On-Time: 1.232</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S06: GROWTH ENGINE / INTERACTIVE ANALYTICS SECTION */}
        <section className="w-full py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1240px] mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-12">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Engine Analisis Terpadu Crave
                </span>
                <svg
                  width="30"
                  height="22"
                  viewBox="0 0 30 22"
                  fill="none"
                  className="stroke-current animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 20 6 23 15M23 15L18 13M23 15L26 9"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] mb-3.5 text-balance">
                Struktur Kompensasi &{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  Alokasi Beban SDM
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                    viewBox="0 0 190 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C50 2 130 8 188 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-[15px] leading-[1.6] text-[#6B7280] max-w-[620px] text-balance">
                Pantau distribusi biaya gaji per departemen, kepatuhan potongan pajak, dan proyeksi anggaran tahunan dalam visualisasi intuitif.
              </p>
            </div>

            {/* Ribbed Blue Top Stage with 3 Interactive-Style Pill Tabs */}
            <div className="relative rounded-3xl overflow-hidden pt-8 pb-8 px-4 sm:px-10 bg-gradient-to-b from-[oklch(0.54_0.19_258)] via-[#6982FF]/30 to-white border border-[#ECEEF6]">
              <div className="absolute inset-x-0 top-0 h-[210px] pointer-events-none opacity-30" style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)" }}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={i < 23 ? "border-r border-white/40" : ""} />
                ))}
              </div>

              {/* 3 Pill Tabs */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-8">
                {["Distribusi Beban per Divisi", "Simulasi PPh 21 TER 2024", "Rekap Lembur PP 35/2021"].map((tab, idx) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveGrowthTab(idx)}
                    className={cn(
                      "px-5 py-2 rounded-full text-[13px] font-semibold transition-colors",
                      activeGrowthTab === idx
                        ? "bg-white text-[#111827] shadow-sm"
                        : "bg-white/15 backdrop-blur-xs border border-white/35 text-white hover:bg-white/25"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* White Dashboard Frame */}
              <div className="relative z-10 max-w-[820px] mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(17,24,39,0.14)] border border-[#E5E7EB]">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-[oklch(0.54_0.19_258)]" />
                    <span className="text-[13px] font-bold text-[#111827]">Crave Analytics: Beban SDM per Divisi</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold">
                    Efisiensi Terjaga
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                  {/* Left Donut SVG Chart (5 cols) */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative size-[180px]">
                      <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="44" stroke="#E0E7FF" strokeWidth="20" fill="none" />
                        <circle cx="60" cy="60" r="44" stroke="#6366F1" strokeWidth="20" strokeDasharray="185 276" fill="none" />
                        <circle cx="60" cy="60" r="44" stroke="oklch(0.54 0.19 258)" strokeWidth="20" strokeDasharray="115 276" fill="none" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-bold text-[18px] text-[#111827]">Rp 348M</span>
                        <span className="text-[10px] text-[#6B7280]">Total Gaji Bruto</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Metrics Table (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="grid grid-cols-3 text-[11.5px] py-1.5 border-b border-[#F3F4F6]">
                      <span className="font-semibold text-[#374151] flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[oklch(0.54_0.19_258)]" />Teknologi & IT
                      </span>
                      <span className="text-[#6B7280] text-center">Rp 142.500.000</span>
                      <span className="font-bold text-[#111827] text-right">40.8%</span>
                    </div>
                    <div className="grid grid-cols-3 text-[11.5px] py-1.5 border-b border-[#F3F4F6]">
                      <span className="font-semibold text-[#374151] flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#6366F1]" />Operasional Cabang
                      </span>
                      <span className="text-[#6B7280] text-center">Rp 104.200.000</span>
                      <span className="font-bold text-[#111827] text-right">29.8%</span>
                    </div>
                    <div className="grid grid-cols-3 text-[11.5px] py-1.5 border-b border-[#F3F4F6]">
                      <span className="font-semibold text-[#374151] flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#93C5FD]" />Pemasaran & Sales
                      </span>
                      <span className="text-[#6B7280] text-center">Rp 68.450.000</span>
                      <span className="font-bold text-[#111827] text-right">19.6%</span>
                    </div>
                    <div className="grid grid-cols-3 text-[11.5px] py-1.5">
                      <span className="font-semibold text-[#374151] flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#E0E7FF]" />Finance & GA
                      </span>
                      <span className="text-[#6B7280] text-center">Rp 33.500.000</span>
                      <span className="font-bold text-[#111827] text-right">9.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S07: DARK FEATURES GRID */}
        <section id="keunggulan" className="w-full px-4 sm:px-6 py-6">
          <div className="max-w-[1280px] mx-auto rounded-3xl bg-gradient-to-b from-[#252629] to-[#17181B] text-white py-20 px-6 sm:px-14 shadow-xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-3 text-[#758AFF] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Keamanan & Skalabilitas Enterprise
                </span>
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="stroke-current animate-draw-stroke shrink-0" aria-hidden="true">
                  <path d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-white max-w-[560px] mb-4 text-balance">
                Fondasi teknologi kuat untuk grup perusahaan
              </h2>
              <p className="text-[14.5px] leading-[1.6] text-[#9CA3AF] max-w-[620px] text-balance">
                Dirancang khusus untuk mengelola struktur holding multi-anak perusahaan, kepatuhan hukum ketenagakerjaan, dan perlindungan data sensitif karyawan.
              </p>
            </div>

            {/* 3x2 Dark Feature Grid with Subtle Hairline Borders */}
            <div className="max-w-[1060px] mx-auto grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
              {DARK_ENTERPRISE_FEATURES.map((feat) => (
                <div key={feat.title} className="p-8 border-r border-b border-white/10 flex flex-col justify-between">
                  <div className="size-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-10 text-white">
                    <feat.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-white mb-2.5">{feat.title}</h3>
                    <p className="text-[13.5px] leading-[1.6] text-[#9CA3AF]">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S08: POWER PACK - WORKFLOW YANG EFISIEN */}
        <section className="w-full py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1240px] mx-auto">
            {/* Split Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                  <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                    Alur Kerja Andal & Presisi
                  </span>
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="stroke-current animate-draw-stroke shrink-0" aria-hidden="true">
                    <path d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-black text-[32px] sm:text-[40px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[500px]">
                  Dirancang untuk cara kerja{" "}
                  <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                    tim HR sesungguhnya
                    <svg className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none" viewBox="0 0 210 9" fill="none" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M2 6C55 2 140 8 208 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pl-10">
                <p className="text-[15px] leading-[1.6] text-[#6B7280] max-w-[500px]">
                  Crave HRM menyederhanakan alur kerja kompleks melalui otomatisasi cerdas, delegasi wewenang aman, dan kemudahan akses bagi seluruh karyawan.
                </p>
              </div>
            </div>

            {/* Content Grid: Left 3 Cards + Right Dashboard Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left 3 Cards (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-4">
                  <span className="size-9 rounded-xl bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[16.5px] text-[#111827] mb-1.5">Kalkulasi Otomatis Gaji & Pajak</h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">
                      Hitung slip gaji ribuan karyawan dalam hitungan detik tanpa rumus Excel manual yang rawan keliru.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#F1F2F6] flex items-start gap-4">
                  <span className="size-9 rounded-xl bg-[#F3F4F6] text-[#374151] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[16.5px] text-[#111827] mb-1.5">Approval Cuti & Izin Berjenjang</h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">
                      Validasi berjenjang dari Supervisor hingga HRD dengan kalender cuti bersama SKB 3 Menteri resmi.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#F1F2F6] flex items-start gap-4">
                  <span className="size-9 rounded-xl bg-[#161924] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Laptop className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[16.5px] text-[#111827] mb-1.5">Employee Self-Service (ESS PWA)</h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">
                      Akses mudah dari smartphone tanpa download aplikasi Play Store untuk absensi selfie dan unduh slip gaji.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Preview (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-[#F5F7FB] border border-[#ECEEF6] p-6 sm:p-8 flex flex-col justify-between">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#F3F4F6]">
                    <span className="font-bold text-[13px] text-[#111827]">Ringkasan Operasional Bulan Berjalan</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#161924] text-white text-[10.5px]">Masa Pajak Aktif</span>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-[oklch(0.54_0.19_258)] text-white p-3 text-center">
                      <span className="text-[10px] text-white/80 block">Karyawan Aktif</span>
                      <span className="text-[16px] font-bold">1.250</span>
                    </div>
                    <div className="rounded-xl bg-[#6982FF] text-white p-3 text-center">
                      <span className="text-[10px] text-white/80 block">Slip Terbit</span>
                      <span className="text-[16px] font-bold">1.250</span>
                    </div>
                    <div className="rounded-xl bg-[#10B981] text-white p-3 text-center">
                      <span className="text-[10px] text-white/80 block">Akurasi Pajak</span>
                      <span className="text-[16px] font-bold">100%</span>
                    </div>
                  </div>

                  {/* Bottom Row Mini Charts */}
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <div className="rounded-lg border border-[#F1F2F6] p-3 text-center">
                      <span className="text-[10px] text-[#6B7280] block mb-1">Presensi Hari Ini</span>
                      <span className="text-[14px] font-black text-[#111827]">98.6%</span>
                    </div>
                    <div className="rounded-lg border border-[#F1F2F6] p-3 text-center">
                      <span className="text-[10px] text-[#6B7280] block mb-1">Kantin Terklaim</span>
                      <span className="text-[14px] font-black text-[#111827]">948 Kupon</span>
                    </div>
                    <div className="rounded-lg border border-[#F1F2F6] p-3 text-center">
                      <span className="text-[10px] text-[#6B7280] block mb-1">Lembur Tervalidasi</span>
                      <span className="text-[14px] font-black text-[#111827]">42 Jam</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S09: HOW IT WORKS — ALUR 3 LANGKAH */}
        <section className="w-full py-20 px-4 sm:px-6 bg-[#FBFBFB]">
          <div className="max-w-[1240px] mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Implementasi Cepat & Praktis
                </span>
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="stroke-current animate-draw-stroke shrink-0" aria-hidden="true">
                  <path d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[520px] mb-3.5 text-balance">
                Mulai otomasi SDM dalam{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  3 langkah mudah
                  <svg className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none" viewBox="0 0 170 9" fill="none" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 7C45 2 105 8 168 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
              <p className="text-[15px] leading-[1.6] text-[#6B7280] max-w-[580px] text-balance">
                Semua data mengalir terintegrasi dalam satu platform tanpa instalasi rumit atau konfigurasi berbelit-belit.
              </p>
            </div>

            {/* Connector Tree Bracket */}
            <div className="hidden md:block max-w-[820px] mx-auto mb-6">
              <div className="w-1/2 mx-auto h-3 border-b border-[#E5E7EB]" />
              <div className="grid grid-cols-2 h-4 border-t border-l border-r border-[#E5E7EB] rounded-t-[8px]">
                <div className="border-r border-[#E5E7EB]" />
                <div />
              </div>
            </div>

            {/* 3 Step Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {HOW_IT_WORKS.map((item) => (
                <article key={item.step} className="flex flex-col">
                  <div className="rounded-2xl bg-white border border-[#ECEEF6] p-6 mb-5 flex-1 flex flex-col justify-center items-center text-center shadow-xs">
                    <span className="size-12 rounded-full bg-[oklch(0.54_0.19_258)] text-white font-black text-[18px] flex items-center justify-center mb-3 shadow-sm">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-[18px] text-[#111827] mb-1.5">{item.title}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-[#6B7280]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* S10: TESTIMONIALS WITH REAL EXECUTIVE PORTRAITS */}
        <section className="w-full py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col items-center text-center mb-14">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-2 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Kisah Sukses Kemitraan Kami
                </span>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="stroke-current animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[12.5px] font-bold text-[#111827]">Kepuasan Klien</span>
                <div className="flex items-center gap-0.5 text-[#00B67A]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="size-4 rounded-[2px] bg-[#00B67A] text-white text-[10px] flex items-center justify-center">
                      <Star className="size-2.5 fill-current" />
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11.5px] text-[#6B7280] mb-4">Skor Kepuasan 4.9 dari 1.200+ Manajer HR & Finansial di Indonesia</p>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] text-balance">
                Dipercaya oleh para{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  pimpinan HR terkemuka
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                    viewBox="0 0 230 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C65 2 155 8 228 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              {TESTIMONIALS.map((t) => (
                <article key={t.name} className="rounded-2xl bg-white border border-[#F1F2F6] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs">
                  <div className="md:col-span-3">
                    <div className="rounded-2xl overflow-hidden aspect-[23/26] bg-[#E0E7FF] shadow-sm border border-[#E5E7EB]">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="md:col-span-6 flex flex-col justify-between h-full py-1">
                    <blockquote className="font-medium text-[17px] sm:text-[19px] leading-[1.5] text-[#111827] mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                      <div>
                        <div className="font-bold text-[14.5px] text-[#111827]">{t.name}</div>
                        <div className="text-[12px] text-[#6B7280]">{t.role}</div>
                      </div>
                      <span className="font-black text-[14px] text-[#374151]">{t.company}</span>
                    </div>
                  </div>
                  <div className="md:col-span-3 md:border-l md:border-[#F1F2F6] md:pl-8 flex flex-col justify-between gap-6 text-right">
                    <div>
                      <div className="font-black text-[28px] sm:text-[32px] text-[#111827] leading-none mb-1">{t.stat1}</div>
                      <div className="text-[11.5px] text-[#6B7280]">{t.stat1Label}</div>
                    </div>
                    <div>
                      <div className="font-black text-[28px] sm:text-[32px] text-[#111827] leading-none mb-1">{t.stat2}</div>
                      <div className="text-[11.5px] text-[#6B7280]">{t.stat2Label}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* S11: INTEGRATIONS HUB */}
        <section id="integrasi" className="w-full py-20 px-4 sm:px-6 bg-white border-t border-[#F1F2F6]">
          <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center">
            {/* Handwriting Badge with Doodle Arrow */}
            <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
              <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                Ekosistem Integrasi Perbankan & Lembaga
              </span>
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="stroke-current animate-draw-stroke shrink-0" aria-hidden="true">
                <path d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[640px] mb-3.5 text-balance">
              Terhubung langsung dengan{" "}
              <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                sistem perbankan & instansi resmi
                <svg className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none" viewBox="0 0 260 9" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 6C70 2 180 8 258 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-[15px] leading-[1.6] text-[#6B7280] max-w-[580px] mb-7 text-balance">
              Sinkronisasi data penggajian dengan bank utama, BPJS Kesehatan e-Dabu, BPJS Ketenagakerjaan SIPP, dan e-Bupot Ditjen Pajak tanpa konversi manual.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center justify-center h-[42px] px-6 rounded-xl bg-[#161924] hover:bg-[#232738] text-white text-[13.5px] font-semibold mb-14 transition-colors gap-2"
            >
              <span>Jelajahi Format Integrasi Perbankan</span>
              <ArrowRight className="size-4" />
            </Link>

            {/* Hub Diagram with Center Royal Blue Crave Node and 10 Connected Nodes */}
            <div className="relative w-full max-w-[1060px] h-[260px] sm:h-[300px] flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 280" fill="none">
                <path d="M80,45 L260,45 L390,140" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M160,140 L440,140" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M80,235 L260,235 L390,140" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M920,45 L740,45 L610,140" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M840,140 L560,140" stroke="#E5E7EB" strokeWidth="1.5" />
                <path d="M920,235 L740,235 L610,140" stroke="#E5E7EB" strokeWidth="1.5" />
              </svg>

              {/* Left Bank Nodes with Official Logos */}
              {/* 1. BCA */}
              <div className="absolute left-[2%] sm:left-[3%] top-[6%] sm:top-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="KlikBCA Bisnis Batch">
                <img src="/Logo BCA_Biru.png" alt="Logo Bank BCA" className="h-4 sm:h-6 w-auto object-contain" />
              </div>

              {/* 2. Mandiri */}
              <div className="absolute left-[20%] sm:left-[22%] top-[6%] sm:top-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Bank Mandiri MCM 2.0">
                <img src="/Logo MANDIRI_Biru.png" alt="Logo Bank Mandiri" className="h-3.5 sm:h-5 w-auto object-contain" />
              </div>

              {/* 3. BRI */}
              <div className="absolute left-[10%] sm:left-[12%] top-[40%] sm:top-[42%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Bank BRI CMS Direct">
                <img src="/Logo BRI_Biru.png" alt="Logo Bank BRI" className="h-3.5 sm:h-5 w-auto object-contain" />
              </div>

              {/* 4. BNI */}
              <div className="absolute left-[2%] sm:left-[3%] bottom-[6%] sm:bottom-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Bank BNI Direct Payroll">
                <img src="/Logo BNI.png" alt="Logo Bank BNI" className="h-3.5 sm:h-5 w-auto object-contain" />
              </div>

              {/* 5. BSI */}
              <div className="absolute left-[20%] sm:left-[22%] bottom-[6%] sm:bottom-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Bank Syariah Indonesia (BSI)">
                <img src="/images/partners/bsi.svg" alt="Logo BSI" className="h-4 sm:h-5.5 w-auto object-contain" />
              </div>

              {/* Center Crave Hub Icon (Seamless Solid Blue, No White Border) */}
              <div className="relative z-10 size-[80px] sm:size-[88px] rounded-[22px] sm:rounded-[26px] bg-gradient-to-br from-[#3B66FF] to-[oklch(0.54_0.19_258)] shadow-[0_18px_40px_-8px_rgba(59,91,255,0.50)] flex items-center justify-center">
                <img src="/dark-mode-logo.png" alt="Crave HRM Hub" className="h-9 sm:h-11 object-contain brightness-0 invert" />
              </div>

              {/* Right Agency & Ecosystem Nodes with Official Logos */}
              {/* 6. BPJS Kesehatan */}
              <div className="absolute right-[20%] sm:right-[22%] top-[6%] sm:top-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="BPJS Kesehatan e-Dabu">
                <img src="/images/partners/bpjs-kesehatan.svg" alt="Logo BPJS Kesehatan" className="h-4 sm:h-6 w-auto object-contain" />
              </div>

              {/* 7. BPJS Ketenagakerjaan */}
              <div className="absolute right-[2%] sm:right-[3%] top-[6%] sm:top-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="BPJS Ketenagakerjaan SIPP">
                <img src="/images/partners/bpjs-ketenagakerjaan.svg" alt="Logo BPJS Ketenagakerjaan" className="h-4 sm:h-6 w-auto object-contain" />
              </div>

              {/* 8. Ditjen Pajak RI */}
              <div className="absolute right-[10%] sm:right-[12%] top-[40%] sm:top-[42%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Ditjen Pajak RI e-Bupot & PP 58/2023">
                <img src="/images/partners/ditjen-pajak.svg" alt="Logo Ditjen Pajak" className="h-4 sm:h-6 w-auto object-contain" />
              </div>

              {/* 9. Bank CIMB Niaga */}
              <div className="absolute right-[20%] sm:right-[22%] bottom-[6%] sm:bottom-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center justify-center" title="Bank CIMB Niaga BizChannel">
                <img src="/images/partners/cimb-niaga.svg" alt="Logo CIMB Niaga" className="h-4 sm:h-5.5 w-auto object-contain" />
              </div>

              {/* 10. Google Workspace */}
              <div className="absolute right-[2%] sm:right-[3%] bottom-[6%] sm:bottom-[8%] h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex items-center gap-1.5 sm:gap-2" title="Google Workspace Single Sign-On">
                <svg className="size-3.5 sm:size-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span className="font-extrabold text-[10.5px] sm:text-[12px] text-[#374151]">Workspace</span>
              </div>
            </div>
          </div>
        </section>

        {/* S12: PRICING SECTION */}
        <section id="harga" className="w-full px-4 sm:px-6 py-8">
          <div className="max-w-[1280px] mx-auto rounded-3xl bg-gradient-to-b from-[#3A59FF] via-[#4E6BFF] to-[#8396FF] py-20 px-6 sm:px-12 shadow-lg">
            <div className="flex flex-col items-center text-center mb-12">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-white font-handwriting select-none">
                <span className="text-[22px] sm:text-[25px] font-bold tracking-wide animate-write-in">
                  Paket Harga Transparan & Terjangkau
                </span>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="stroke-white animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-white mb-7 text-balance">
                Investasi cerdas untuk{" "}
                <span className="relative inline-block">
                  efisiensi SDM
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-white/90 animate-draw-stroke pointer-events-none"
                    viewBox="0 0 170 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7C45 2 105 8 168 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>

              {/* Monthly / Yearly Switcher */}
              <div className="inline-flex items-center p-1.5 rounded-full bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsYearlyBilling(false)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[12.5px] font-bold transition-colors",
                    !isYearlyBilling ? "bg-[oklch(0.54_0.19_258)] text-white" : "text-[#111827]"
                  )}
                >
                  Bayar Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setIsYearlyBilling(true)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[12.5px] font-bold transition-colors",
                    isYearlyBilling ? "bg-[oklch(0.54_0.19_258)] text-white" : "text-[#111827]"
                  )}
                >
                  Bayar Tahunan (Diskon 20%)
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards */}
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Starter Tier */}
              <article className="rounded-2xl bg-white p-7 sm:p-8 text-[#111827] flex flex-col justify-between shadow-md">
                <div>
                  <div className="text-[14px] font-bold text-[#4B5563] mb-3">Starter UMKM</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-black text-[36px] text-[#111827]">Rp 0</span>
                    <span className="text-[12.5px] text-[#6B7280]">/ gratis selamanya</span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] mb-6">
                    Solusi esensial untuk bisnis baru dengan jumlah karyawan hingga 10 orang.
                  </p>
                  <ul className="space-y-3 text-[13px] text-[#374151] mb-8">
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Hingga 10 Karyawan Aktif</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Presensi GPS Mobile Selfie</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Hitung PPh 21 TER Otomatis</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Cetak Slip Gaji PDF Standar</li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827] text-[13.5px] font-bold flex items-center justify-center transition-colors"
                >
                  Mulai Gratis Sekarang
                </Link>
              </article>

              {/* Growth Tier (Featured) */}
              <article className="rounded-2xl bg-[#141824] p-7 sm:p-8 text-white flex flex-col justify-between shadow-2xl relative border-2 border-white/20">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[oklch(0.54_0.19_258)] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                  Paling Populer
                </span>
                <div>
                  <div className="text-[14px] font-bold text-white/80 mb-3">Professional Bisnis</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-black text-[36px] text-white">
                      {isYearlyBilling ? "Rp 12.000" : "Rp 15.000"}
                    </span>
                    <span className="text-[12.5px] text-white/70">/ karyawan / bln</span>
                  </div>
                  <p className="text-[13px] text-white/80 mb-6">
                    Otomasi menyeluruh untuk perusahaan berkembang yang butuh kepatuhan penuh.
                  </p>
                  <ul className="space-y-3 text-[13px] text-white/90 mb-8">
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#38BDF8]" />Semua Fitur Starter UMKM</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#38BDF8]" />Voucher Kantin Digital QR 60s</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#38BDF8]" />Lembur Formula Resmi PP 35/2021</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#38BDF8]" />Generator Batch Transfer Bank (BCA, Mandiri)</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#38BDF8]" />Cuti & Izin Kalender SKB 3 Menteri</li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="w-full h-11 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13.5px] font-bold flex items-center justify-center transition-colors shadow-lg"
                >
                  Coba 14 Hari Gratis
                </Link>
              </article>

              {/* Enterprise Tier */}
              <article className="rounded-2xl bg-white p-7 sm:p-8 text-[#111827] flex flex-col justify-between shadow-md">
                <div>
                  <div className="text-[14px] font-bold text-[#4B5563] mb-3">Enterprise & Holding</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-black text-[36px] text-[#111827]">Custom</span>
                    <span className="text-[12.5px] text-[#6B7280]">/ penawaran khusus</span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] mb-6">
                    Solusi holding multi-anak perusahaan dengan SLA dedikasi dan dukungan khusus.
                  </p>
                  <ul className="space-y-3 text-[13px] text-[#374151] mb-8">
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Semua Fitur Professional</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Multi-Company Holding Tenancy</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />E-Recruitment ATS Pipeline Lengkap</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Dedicated Account Manager & SLA 99.9%</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4 text-[#059669]" />Custom Integration & On-Premise Sinkron</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactSales(true)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827] text-[13.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Contact Sales Enterprise
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* S13: FAQ WITH REAL HR CONSULTANT PHOTO */}
        <section id="faq" className="w-full py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (5 cols): Specialist Support Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                {/* Handwriting Badge with Doodle Arrow */}
                <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                  <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                    Jawaban Lengkap Pertanyaan Anda
                  </span>
                  <svg
                    width="28"
                    height="20"
                    viewBox="0 0 28 20"
                    fill="none"
                    className="stroke-current animate-draw-stroke shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="font-black text-[32px] sm:text-[40px] leading-[1.16] tracking-[-0.025em] text-[#111827] mb-3 text-balance">
                  Masih memiliki pertanyaan seputar{" "}
                  <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                    Crave HRM
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                      viewBox="0 0 140 9"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 6C35 2 95 8 138 3"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  ?
                </h2>
                <p className="text-[14.5px] leading-[1.6] text-[#6B7280]">
                  Berikut jawaban atas pertanyaan yang paling sering diajukan oleh pemilik bisnis dan pimpinan HR di Indonesia.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[37/26] bg-[#1F2937] shadow-md relative p-6 flex flex-col justify-end text-white">
                <img
                  src="/images/support-agent.png"
                  alt="Konsultan HR Crave"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="font-bold text-[16px] text-white mb-2">Butuh konsultasi implementasi untuk perusahaan Anda?</h4>
                  <p className="text-[12.5px] text-white/80 leading-relaxed mb-4">
                    Tim konsultan HR & regulasi Crave siap membantu proses migrasi data dari sistem lama Anda.
                  </p>
                  <Link href="/register" className="inline-flex items-center gap-2 text-[13px] font-bold text-white underline underline-offset-4">
                    <span>Konsultasi Gratis Sekarang</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Accordion List */}
            <div className="lg:col-span-7 space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-2xl border transition-all",
                    activeFaq === idx ? "bg-[#F8F9FC] border-[#ECEEF6] p-6 shadow-2xs" : "border-[#F1F2F6] py-4 px-5 hover:border-[#E5E7EB]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className={cn("text-[15.5px] font-bold text-[#111827]")}>{faq.q}</span>
                    <span className="text-[#6B7280] text-[18px] leading-none shrink-0 ml-3">
                      {activeFaq === idx ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <p className="text-[13.5px] leading-[1.6] text-[#6B7280] mt-3 pt-3 border-t border-[#ECEEF6]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S14: BLOG & INSIGHTS ARTIKEL */}
        <section className="w-full py-20 px-4 sm:px-6 bg-[#FBFBFB] border-t border-[#F1F2F6]">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Wawasan Regulasi & Pajak Terkini
                </span>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="stroke-current animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-black text-[32px] sm:text-[40px] leading-[1.16] tracking-[-0.025em] text-[#111827] text-balance">
                Artikel & Berita{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  Ketenagakerjaan
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                    viewBox="0 0 190 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C50 2 120 8 188 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {ARTICLES.map((art, idx) => (
                <article key={idx} className="group flex flex-col bg-white rounded-2xl border border-[#F1F2F6] p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all">
                  <div className="rounded-xl overflow-hidden aspect-[23/16] bg-[#E5E7EB] mb-4">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#6B7280] mb-2.5">
                    <span className="font-bold text-[oklch(0.54_0.19_258)]">{art.tag}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-[16.5px] leading-[1.38] text-[#111827] mb-3 group-hover:text-[oklch(0.54_0.19_258)] transition-colors">
                    {art.title}
                  </h3>
                  <div className="mt-auto pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[12px] text-[#6B7280]">
                    <span>{art.author}</span>
                    <span>{art.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* S15: BOTTOM ROYAL BLUE CTA BANNER */}
        <section className="w-full py-10 px-4 sm:px-6 bg-white">
          <div className="max-w-[1060px] mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#3354FF] to-[#2F4AE0] py-16 px-6 sm:px-12 text-center text-white shadow-[0_20px_50px_-12px_rgba(51,84,255,0.45)]">
            {/* Vertical Ribbed Stripes Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)" }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={i < 19 ? "border-r border-white/35" : ""} />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-white font-handwriting select-none">
                <span className="text-[22px] sm:text-[25px] font-bold tracking-wide animate-write-in">
                  Mulai Transformasi Digital Sekarang
                </span>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="stroke-white animate-draw-stroke shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C9 3 19 6 22 14M22 14L17 12M22 14L25 8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="font-black text-[30px] sm:text-[40px] leading-[1.18] tracking-[-0.025em] max-w-[620px] mb-4 text-balance">
                Otomatisasi Manajemen SDM &{" "}
                <span className="relative inline-block">
                  Payroll Perusahaan
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[9px] text-white/90 animate-draw-stroke pointer-events-none"
                    viewBox="0 0 220 9"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C60 2 150 8 218 3"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                Anda Sekarang.
              </h2>
              <p className="text-[14.5px] text-white/85 max-w-[520px] mb-8 text-balance">
                Crave HRM memberikan kendali penuh, akurasi perhitungan pajak 100%, dan kenyamanan kerja bagi seluruh tim Anda.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-[46px] px-8 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#111827] text-[13.5px] font-bold shadow-sm transition-colors gap-2"
              >
                <span>Mulai Uji Coba 14 Hari Gratis</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* S16: FOOTER WITH GIANT WATERMARK (High-Contrast Logo Always Visible) */}
      <footer className="w-full pt-12 pb-16 px-4 sm:px-6 bg-[#FBFBFB] border-t border-[#F1F2F6]">
        <div className="max-w-[1240px] mx-auto">
          {/* Top Watermark & Copyright */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 mb-10 border-b border-[#ECEEF4]">
            <div className="font-black text-[72px] sm:text-[118px] leading-[0.88] tracking-[-0.04em] text-[#EFEFF3] select-none">
              CRAVE
            </div>
            <div className="text-[12px] text-[#9CA3AF] md:text-right">
              Hak Cipta © 2026 Crave HRM by Crave Services. Hak Cipta Dilindungi Undang-Undang.
            </div>
          </div>

          {/* Bottom Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3.5">
                <img
                  src="/light-mode-logo.png"
                  alt="Crave HRM Logo"
                  className="h-9 w-auto object-contain"
                />
                <span className="font-extrabold text-[20px] tracking-[-0.03em] text-[#111827]">
                  Crave <span className="text-[#6B7280]">HRM</span>
                </span>
              </Link>
              <p className="text-[13.5px] leading-[1.6] text-[#6B7280] max-w-[340px] mb-4">
                Sistem SaaS Human Resource Management terlengkap di Indonesia dengan integrasi PPh 21 TER 2024, BPJS resmi, presensi GPS, dan voucher kantin digital.
              </p>
              <div className="text-[12px] font-semibold text-[#374151]">
                Target Domain: <span className="text-[oklch(0.54_0.19_258)] font-bold">hrm.craveservices.my.id</span>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-[13.5px] text-[#111827] mb-4">Modul Solusi</h3>
                <ul className="space-y-2.5 text-[13px] text-[#6B7280]">
                  <li><a href="#fitur" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Payroll & TER 2024</a></li>
                  <li><a href="#fitur" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Presensi GPS Geofence</a></li>
                  <li><a href="#fitur" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Kantin Digital QR 60s</a></li>
                  <li><a href="#fitur" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Cuti SKB 3 Menteri</a></li>
                  <li><a href="#fitur" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">ATS Rekrutmen Pelamar</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px] text-[#111827] mb-4">Ekosistem & Karir</h3>
                <ul className="space-y-2.5 text-[13px] text-[#6B7280]">
                  <li><Link href="/careers" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Portal Karir Publik</Link></li>
                  <li><a href="#integrasi" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Integrasi Perbankan</a></li>
                  <li><a href="#harga" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Paket Harga</a></li>
                  <li><Link href="/login" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Masuk Akun</Link></li>
                  <li><Link href="/register" className="hover:text-[oklch(0.54_0.19_258)] transition-colors">Daftar Perusahaan</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px] text-[#111827] mb-4">Kepatuhan Hukum</h3>
                <ul className="space-y-2.5 text-[13px] text-[#6B7280]">
                  <li><span>PP No. 58 Tahun 2023</span></li>
                  <li><span>PMK 168/2023 (PPh 21 TER)</span></li>
                  <li><span>PP No. 35 Tahun 2021 (Lembur)</span></li>
                  <li><span>UU PDP No. 27 Tahun 2022</span></li>
                  <li><span>Kebijakan Privasi</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL GUIDE: INSTALASI DI IOS (IPHONE / IPAD) */}
      {showIosGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="relative w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="absolute top-5 right-5 size-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors"
              aria-label="Tutup jendela"
            >
              <X className="size-4.5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Apple className="size-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Install di iPhone / iPad</h3>
                <p className="text-[12px] text-[#6B7280]">3 Langkah mudah pasang ke Layar Utama</p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5">
              Crave HRM berjalan langsung dari layar iPhone atau iPad Anda dengan performa aplikasi native tanpa perlu mengunduh dari App Store:
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Buka halaman ini menggunakan peramban <strong>Safari</strong> di perangkat iOS Anda.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah mengarah ke atas <Share2 className="inline size-3.5 mx-1 text-[#2563EB]" />) di bilah bawah Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama), lalu tekan <strong>"Add"</strong>.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F2F6] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin);
                  alert("Tautan Crave HRM telah disalin! Buka di Safari iPhone / iPad Anda.");
                }}
                className="h-10 px-4 rounded-xl border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[13px] font-semibold text-[#111827] transition-colors"
              >
                Salin Tautan Safari
              </button>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="h-10 px-5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13px] font-bold transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GUIDE: INSTALASI DI DESKTOP (WINDOWS & MACOS) */}
      {showDesktopGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowDesktopGuide(false)}
        >
          <div
            className="relative w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDesktopGuide(false)}
              className="absolute top-5 right-5 size-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors"
              aria-label="Tutup jendela"
            >
              <X className="size-4.5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-2xl bg-[#161924] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Monitor className="size-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Pasang di Komputer Desktop</h3>
                <p className="text-[12px] text-[#6B7280]">Aplikasi Desktop Mandiri untuk Windows & Mac</p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5">
              Crave HRM dapat dipasang langsung sebagai aplikasi desktop mandiri tanpa peramban dengan integrasi notifikasi sistem operasi:
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Pada peramban <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>, perhatikan ikon <strong>Install</strong> di ujung kanan address bar.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Atau klik menu titik tiga di pojok kanan atas peramban &rarr; Pilih <strong>"Simpan & Bagikan"</strong> / <strong>"Aplikasi"</strong> &rarr; Klik <strong>"Install Crave HRM"</strong>.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F2F6] flex items-center justify-between">
              <Link
                href="/register"
                onClick={() => setShowDesktopGuide(false)}
                className="h-10 px-4 rounded-xl border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[13px] font-semibold text-[#111827] flex items-center transition-colors"
              >
                Buka Versi Web Saja
              </Link>
              <button
                type="button"
                onClick={() => setShowDesktopGuide(false)}
                className="h-10 px-5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13px] font-bold transition-colors"
              >
                Siap, Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S19: CONTACT SALES DIALOG MODAL */}
      {showContactSales && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowContactSales(false)}
        >
          <div
            className="relative w-full max-w-[490px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowContactSales(false)}
              className="absolute top-5 right-5 size-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              aria-label="Tutup jendela"
            >
              <X className="size-4.5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-2xl bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0 shadow-2xs">
                <PhoneCall className="size-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Hubungi Tim Sales Crave</h3>
                <p className="text-[12px] text-[#6B7280]">Konsultasi Solusi & Demo Khusus Perusahaan</p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5">
              Diskusikan implementasi sistem manajemen SDM, kepatuhan PPh 21 TER 2024, integrasi multi-holding, atau penawaran harga khusus perusahaan Anda:
            </p>

            <div className="space-y-3 mb-6">
              {/* Option 1: WhatsApp Instant Chat */}
              <a
                href="https://wa.me/6281234567890?text=Halo%20Tim%20Sales%20Crave%20HRM,%20saya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20solusi%20Crave%20HRM%20untuk%20perusahaan%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] hover:border-[#86EFAC] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13.5px] text-[#111827] group-hover:text-[#15803D] transition-colors flex items-center gap-2">
                      <span>Chat WhatsApp Sales</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[10px] font-bold">Fast Response</span>
                    </div>
                    <div className="text-[11.5px] text-[#6B7280]">Respon langsung dalam hitungan menit</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-[#166534] group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Option 2: Official Enterprise Email */}
              <a
                href="mailto:sales@craveservices.my.id?subject=Inquiry%20Solusi%20Enterprise%20Crave%20HRM"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#CBD5E1] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-[oklch(0.54_0.19_258)] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13.5px] text-[#111827] group-hover:text-[oklch(0.54_0.19_258)] transition-colors">
                      Email Sales & Enterprise
                    </div>
                    <div className="text-[11.5px] text-[#6B7280]">sales@craveservices.my.id</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-[#6B7280] group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Option 3: Schedule 1-on-1 Demo */}
              <Link
                href="/register"
                onClick={() => setShowContactSales(false)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[oklch(0.54_0.19_258)] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-[#161924] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[13.5px] text-[#111827] group-hover:text-[oklch(0.54_0.19_258)] transition-colors">
                      Daftar Akun & Coba Langsung
                    </div>
                    <div className="text-[11.5px] text-[#6B7280]">Uji coba gratis 14 hari tanpa komitmen</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-[#6B7280] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="pt-4 border-t border-[#F1F2F6] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowContactSales(false)}
                className="h-10 px-5 rounded-xl border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[13px] font-semibold text-[#111827] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
