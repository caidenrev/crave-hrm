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
import BlurText from "@/components/BlurText";
import GradualBlur from "@/components/GradualBlur";
import LandingNavbar from "@/components/LandingNavbar";
import DashboardPreview from "@/components/DashboardPreview";
import CraveServiceCards from "../../../../CraveCards/CraveServiceCards";
import { FeatureGrid, FeatureBento } from "@/components/FeatureSections";
import FeatureShowcase from "@/components/FeatureShowcase";
import TestimonialSlider from "@/components/landing/TestimonialSlider";

const NAV_LINKS = [
  { href: "#fitur", label: "Fitur" },
  { href: "#kepatuhan", label: "Kepatuhan" },
  { href: "#integrasi", label: "Integrasi" },
  { href: "/careers", label: "Portal Karir", isPage: true },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

const PARTNER_LOGOS = [
  { name: "Bank Central Asia (BCA)", src: "/images/partners/Logo BCA_Biru.png", height: "h-6 sm:h-7", alt: "Logo BCA" },
  { name: "Bank Mandiri", src: "/images/partners/Logo MANDIRI_Biru.png", height: "h-5 sm:h-6", alt: "Logo Mandiri" },
  { name: "Bank Rakyat Indonesia (BRI)", src: "/images/partners/Logo BRI_Biru.png", height: "h-5 sm:h-6", alt: "Logo BRI" },
  { name: "Bank Negara Indonesia (BNI)", src: "/images/partners/Logo BNI.png", height: "h-5 sm:h-6", alt: "Logo BNI" },
  { name: "BPJS Kesehatan", src: "/images/partners/Logo BPJS KESEHATAN_Biru.png", height: "h-8 sm:h-9", alt: "Logo BPJS Kesehatan" },
  { name: "BPJS Ketenagakerjaan", src: "/images/partners/Logo BPJS KETENAGAKERJAAN_Biru.png", height: "h-6 sm:h-7", alt: "Logo BPJS Ketenagakerjaan" },
  { name: "Direktorat Jenderal Pajak (DJP)", src: "/images/partners/Logo DJP_Biru.png", height: "h-6 sm:h-7", alt: "Logo Ditjen Pajak" },
  { name: "Kementerian Ketenagakerjaan RI", src: "/images/partners/Logo KEMNAKER.png", height: "h-7 sm:h-8", alt: "Logo Kemnaker RI" },
  { name: "Bank Syariah Indonesia (BSI)", src: "/images/partners/Logo BSI_Hijau.png", height: "h-6 sm:h-7", alt: "Logo BSI" },
  { name: "Bank CIMB Niaga", src: "/images/partners/Logo CIMB_Merah.png", height: "h-4.5 sm:h-5.5", alt: "Logo CIMB Niaga" },
  { name: "PermataBank", src: "/images/partners/Logo PERMATA_Biru.png", height: "h-6 sm:h-7", alt: "Logo PermataBank" },
  { name: "Bank Danamon", src: "/images/partners/Logo DANAMON.png", height: "h-5 sm:h-6", alt: "Logo Bank Danamon" },
  { name: "Bank Tabungan Negara (BTN)", src: "/images/partners/Logo BTN_Biru.png", height: "h-5.5 sm:h-6.5", alt: "Logo Bank BTN" },
  { name: "Google Workspace", src: "/images/partners/Logo WORKSPACE.png", height: "h-4.5 sm:h-5.5", alt: "Logo Google Workspace" },
  { name: "Microsoft 365", src: "/images/partners/Logo MC365.png", height: "h-5.5 sm:h-6.5", alt: "Logo Microsoft 365" },
];

const INTEGRATION_HUB_NODES = [
  {
    id: "bca",
    name: "Bank Central Asia (BCA)",
    category: "Perbankan",
    src: "/images/partners/Logo BCA_Biru.png",
    logoClass: "h-4 sm:h-5",
    detail: "Ekspor massal format KlikBCA Bisnis Batch CSV siap unggah untuk pencairan gaji otomatis.",
    desktopPos: "left-[2%] lg:left-[3%] top-[7%]",
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    category: "Perbankan",
    src: "/images/partners/Logo MANDIRI_Biru.png",
    logoClass: "h-3.5 sm:h-4.5",
    detail: "Kompatibel dengan Mandiri Cash Management (MCM 2.0) untuk transfer payroll korporat multi-entitas.",
    desktopPos: "left-[20%] lg:left-[22%] top-[7%]",
  },
  {
    id: "bri",
    name: "Bank Rakyat Indonesia (BRI)",
    category: "Perbankan",
    src: "/images/partners/Logo BRI_Biru.png",
    logoClass: "h-3.5 sm:h-4.5",
    detail: "Mendukung format BRI CMS Direct untuk distribusi gaji karyawan cabang di seluruh Indonesia.",
    desktopPos: "left-[10%] lg:left-[12%] top-[42%]",
  },
  {
    id: "bni",
    name: "Bank Negara Indonesia (BNI)",
    category: "Perbankan",
    src: "/images/partners/Logo BNI.png",
    logoClass: "h-3.5 sm:h-4.5",
    detail: "Rekap file BNI Direct Payroll tervalidasi dengan nomor rekening terenkripsi AES-256.",
    desktopPos: "left-[2%] lg:left-[3%] bottom-[7%]",
  },
  {
    id: "bsi",
    name: "Bank Syariah Indonesia (BSI)",
    category: "Perbankan",
    src: "/images/partners/Logo BSI_Hijau.png",
    logoClass: "h-4 sm:h-5",
    detail: "Dukungan format transfer massal Bank Syariah Indonesia untuk payroll syariah perusahaan.",
    desktopPos: "left-[20%] lg:left-[22%] bottom-[7%]",
  },
  {
    id: "bpjs-kes",
    name: "BPJS Kesehatan",
    category: "Regulasi",
    src: "/images/partners/Logo BPJS KESEHATAN_Biru.png",
    logoClass: "h-6 sm:h-7",
    detail: "Split iuran otomatis 4% perusahaan : 1% karyawan dengan batas upah Rp 12 juta & rekap e-Dabu.",
    desktopPos: "right-[20%] lg:right-[22%] top-[7%]",
  },
  {
    id: "bpjs-tk",
    name: "BPJS Ketenagakerjaan",
    category: "Regulasi",
    src: "/images/partners/Logo BPJS KETENAGAKERJAAN_Biru.png",
    logoClass: "h-4.5 sm:h-5.5",
    detail: "Kalkulasi presisi JHT, JKK, JKM, dan JP (batas plafon JP otomatis) siap lapor ke portal SIPP.",
    desktopPos: "right-[2%] lg:right-[3%] top-[7%]",
  },
  {
    id: "djp",
    name: "Direktorat Jenderal Pajak (DJP)",
    category: "Regulasi",
    src: "/images/partners/Logo DJP_Biru.png",
    logoClass: "h-4.5 sm:h-5.5",
    detail: "Kalkulator PPh 21 TER 2024 (Kategori A, B, C sesuai PP 58/2023) dan rekap e-Bupot 21/26.",
    desktopPos: "right-[10%] lg:right-[12%] top-[42%]",
  },
  {
    id: "cimb",
    name: "Bank CIMB Niaga",
    category: "Perbankan",
    src: "/images/partners/Logo CIMB_Merah.png",
    logoClass: "h-3.5 sm:h-4",
    detail: "Format batch transfer BizChannel@CIMB untuk pencairan gaji dan reimbursement karyawan.",
    desktopPos: "right-[20%] lg:right-[22%] bottom-[7%]",
  },
  {
    id: "workspace",
    name: "Google Workspace",
    category: "Ekosistem",
    src: "/images/partners/Logo WORKSPACE.png",
    logoClass: "h-3.5 sm:h-4",
    detail: "Sinkronisasi email korporat, notifikasi slip gaji, dan undangan wawancara rekrutmen otomatis.",
    desktopPos: "right-[2%] lg:right-[3%] bottom-[7%]",
  },
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
  {
    name: "Dian Anggraini",
    role: "VP of People Operations",
    company: "PT Cipta Integrasi Digital",
    avatar: "/images/support-agent.png",
    quote: "Fitur presensi GPS dengan validasi radius geofence kantor dan voucher kantin digital QR dinamis 60 detik berhasil mengeliminasi titip absen secara total. Seluruh klaim reimbursement kini terselesaikan secara transparan dan 100% paperless.",
    stat1: "99.8%",
    stat1Label: "Akurasi Presensi & Geofence",
    stat2: "100%",
    stat2Label: "Paperless Operasional",
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
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [activeIntegrationNode, setActiveIntegrationNode] = useState(null);

  const renderHeroPlatformIcon = (os) => {
    if (os === "ios" || os === "macos") {
      return (
        <img
          src="/images/partners/Logo APPLE_Putih.png"
          alt=""
          aria-hidden="true"
          className="h-4.5 w-auto object-contain shrink-0"
        />
      );
    }
    if (os === "windows") {
      return (
        <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2 3.8 10.8 2.6v8.7H2V3.8zm9.8-1.3L22 1v10.3H11.8V2.5zM2 12.7h8.8v8.7L2 20.2v-7.5zm9.8 0H22V23l-10.2-1.5v-8.8z" />
        </svg>
      );
    }
    if (os === "android") {
      return (
        <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.52 9.43l1.39-2.4a.42.42 0 0 0-.15-.57.42.42 0 0 0-.57.15l-1.42 2.45a8.56 8.56 0 0 0-9.54 0L5.81 6.61a.42.42 0 0 0-.57-.15.42.42 0 0 0-.15.57l1.39 2.4A7.97 7.97 0 0 0 3 16h18a7.97 7.97 0 0 0-3.48-6.57zM8.5 13.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
      );
    }
    return <Download className="size-4.5 shrink-0" aria-hidden="true" />;
  };

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
      if (clientPlatform.os === "android") {
        setShowAndroidGuide(true);
      } else {
        setShowDesktopGuide(true);
      }
    }
  };

  const handlePlatformChipClick = async (targetOs) => {
    if (targetOs === "apple") {
      setShowIosGuide(true);
      return;
    }
    if (targetOs === "android") {
      if (clientPlatform.os === "android") {
        const success = await promptPwaInstall();
        if (success) {
          window.location.replace("/login");
          return;
        }
      }
      setShowAndroidGuide(true);
      return;
    }
    if (clientPlatform.os === "windows" || clientPlatform.os === "desktop") {
      const success = await promptPwaInstall();
      if (success) {
        window.location.replace("/login");
        return;
      }
    }
    setShowDesktopGuide(true);
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

      {/* =========================================================================
          FIXED VIEWPORT GRADUAL BLUR OVERLAYS (TOP & BOTTOM)
          Progressive frosted glass blur pinned to the top and bottom edges of the viewport
      ========================================================================= */}
      <GradualBlur
        target="page"
        position="top"
        height="6rem"
        strength={2}
        layers={8}
        curve="linear"
        exponential={true}
        autoHide={true}
        zIndex={40}
        tint="rgba(250, 250, 252, 0.65)"
      />

      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        layers={8}
        curve="linear"
        exponential={true}
        autoHide={true}
        zIndex={40}
        tint="rgba(250, 250, 252, 0.65)"
      />

      {/* S01: FLOATING CAPSULE NAVIGATION BAR */}
      <LandingNavbar auth={auth} />

      <main className="pt-[76px] sm:pt-[84px]">
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

            {/* Hero Heading: Minimalist, Bold & Executive with BlurText */}
            <h1 className="font-extrabold text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.14] tracking-[-0.035em] text-[#111827] max-w-[760px] mx-auto mb-4 text-center text-balance">
              <BlurText
                text="Otomatisasi Manajemen SDM &"
                effect="blur"
                animateBy="letters"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={40}
                stepDuration={0.35}
                blur={10}
                distance={40}
                className="inline text-[#111827]"
              />{" "}
              <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                <BlurText
                  text="Payroll Terpadu"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={40}
                  stepDuration={0.35}
                  blur={10}
                  distance={40}
                  className="inline text-[oklch(0.54_0.19_258)]"
                />
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
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-5">
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
                  {renderHeroPlatformIcon(clientPlatform.os)}
                  <span>{clientPlatform.heroLabel}</span>
                </button>
              )}

              <Link
                href="/contact-sales"
                className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] text-[14px] font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="size-4" />
                <span>Contact Sales</span>
              </Link>
            </div>

            {/* Platform Availability Strip (Windows, Apple, Android - Minimalist Black Logos) */}
            <div className="flex items-center justify-center gap-3.5 sm:gap-4 mb-7 relative z-20">
              <span className="text-[12.5px] sm:text-[13px] font-semibold text-[#6B7280]">
                Tersedia untuk:
              </span>
              <svg
                viewBox="0 0 24 24"
                className="size-4.5 sm:size-5 fill-black hover:opacity-70 transition-opacity cursor-pointer shrink-0"
                onClick={() => handlePlatformChipClick("windows")}
                aria-label="Windows"
                title="Windows"
              >
                <path d="M0 0h11.377v11.377H0zm12.623 0H24v11.377H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="size-4.5 sm:size-5 fill-black hover:opacity-70 transition-opacity cursor-pointer shrink-0"
                onClick={() => handlePlatformChipClick("apple")}
                aria-label="Apple (macOS & iOS)"
                title="Apple (macOS & iOS)"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.14c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.73 1.4-.59.68-1.11 1.77-.97 2.83 1.04.08 2.1-.51 2.74-1.29z" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="size-4.5 sm:size-5 fill-black hover:opacity-70 transition-opacity cursor-pointer shrink-0"
                onClick={() => handlePlatformChipClick("android")}
                aria-label="Android"
                title="Android"
              >
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002s.4482-1.0002.9993-1.0002c.5516 0 .9997.4486.9997 1.0002s-.4481 1.0002-.9997 1.0002m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0002s.4482-1.0002.9993-1.0002c.5516 0 .9997.4486.9997 1.0002s-.4481 1.0002-.9997 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0818 12 8.0818c-1.8533 0-3.5902.3298-5.1368.8679L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
            </div>

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

            {/* Hero Dashboard Stage with Blue Gradient Backdrop */}
            <div className="relative w-full max-w-[1240px] mx-auto rounded-3xl overflow-hidden pt-6 sm:pt-10 px-3 sm:px-6 lg:px-8 pb-10 sm:pb-14 bg-gradient-to-b from-transparent via-[#758AFF] to-[#2E4CF1]">
              {/* Full Desktop Dashboard Preview matching the real app UI */}
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* S03: INFINITE MARQUEE PARTNER & BANK LOGO LOOP */}
        <section className="w-full py-10 bg-white border-y border-[#F1F2F6] overflow-hidden">
          <div className="max-w-[1240px] mx-auto text-center px-4 mb-7">
            <p className="text-[12.5px] sm:text-[13px] font-bold text-[#6B7280] tracking-wider uppercase">
              Di Percaya oleh Perusahaan di Seluruh Indonesia
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
                      "w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-all duration-300 opacity-85 group-hover:opacity-100 group-hover:scale-105 select-none"
                    )}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S04: BENTO GRID FEATURE SECTION + BLUE KPI BANNER */}
        <section id="fitur" className="w-full py-20 px-4 sm:px-6 bg-[#FBFBFB] scroll-mt-20 sm:scroll-mt-24">
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
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[640px] mx-auto mb-4 text-center text-balance">
                <BlurText
                  text="Semua yang Anda butuhkan untuk kelola talenta &"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  <BlurText
                    text="kepatuhan regulasi"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[oklch(0.54_0.19_258)]"
                  />
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
            <div className="mb-8">
              <FeatureBento />
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

              <FeatureGrid />
            </div>
          </div>
        </section>

        {/* S05: VISIBILITY / COMPLIANCE DEEP DIVE WITH REAL TEAM PHOTO */}
        <section id="kepatuhan" className="w-full py-20 px-4 sm:px-6 bg-white scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 pr-0 lg:pr-4">
              <span className="text-[12px] font-bold text-[oklch(0.54_0.19_258)] uppercase tracking-wider block mb-2">
                Kepatuhan Tanpa Kompromi
              </span>
              <h2 className="font-black text-[32px] sm:text-[38px] leading-[1.18] tracking-[-0.025em] text-[#111827] mb-4">
                <BlurText
                  text="Visibilitas penuh ke setiap aksi SDM dan penggajian"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={30}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />
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
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] mb-3.5 text-center text-balance mx-auto">
                <BlurText
                  text="Struktur Kompensasi &"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  <BlurText
                    text="Alokasi Beban SDM"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[oklch(0.54_0.19_258)]"
                  />
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
        <section id="keunggulan" className="w-full px-4 sm:px-6 py-6 scroll-mt-20 sm:scroll-mt-24">
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
                <BlurText
                  text="Fondasi teknologi kuat untuk grup perusahaan"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={30}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-white"
                />
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
                  <BlurText
                    text="Dirancang untuk cara kerja"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[#111827]"
                  />{" "}
                  <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                    <BlurText
                      text="tim HR sesungguhnya"
                      effect="blur"
                      animateBy="letters"
                      direction="top"
                      staggerFrom="start"
                      trigger="view"
                      delay={35}
                      stepDuration={0.3}
                      blur={10}
                      distance={35}
                      className="inline text-[oklch(0.54_0.19_258)]"
                    />
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

            {/* Interactive Feature Showcase Tabs (Remake) */}
            <FeatureShowcase embedded={true} />
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
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] max-w-[520px] mx-auto mb-3.5 text-center text-balance">
                <BlurText
                  text="Mulai otomasi SDM dalam"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  <BlurText
                    text="3 langkah mudah"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[oklch(0.54_0.19_258)]"
                  />
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
        <section id="testimoni" className="w-full py-20 px-4 sm:px-6 bg-white scroll-mt-20 sm:scroll-mt-24">
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
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-[#111827] text-center text-balance mx-auto">
                <BlurText
                  text="Dipercaya oleh para"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  <BlurText
                    text="pimpinan HR terkemuka"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[oklch(0.54_0.19_258)]"
                  />
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

            <TestimonialSlider testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* S11: INTEGRATIONS HUB */}
        <section id="integrasi" className="w-full py-20 px-4 sm:px-6 bg-white border-t border-[#F1F2F6] scroll-mt-20 sm:scroll-mt-24">
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
            <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.2] tracking-[-0.025em] text-[#111827] max-w-[640px] mx-auto mb-3.5 text-center">
              <BlurText
                text="Terhubung langsung dengan"
                effect="blur"
                animateBy="letters"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={35}
                stepDuration={0.3}
                blur={10}
                distance={35}
                className="inline text-[#111827]"
              />
              <br />
              <span className="text-[oklch(0.54_0.19_258)]">
                <BlurText
                  text="sistem perbankan"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[oklch(0.54_0.19_258)]"
                />
              </span>
              <br />
              <span className="relative inline-block text-[oklch(0.54_0.19_258)] whitespace-nowrap">
                <BlurText
                  text="& instansi resmi"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[oklch(0.54_0.19_258)]"
                />
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-[9px] text-[oklch(0.54_0.19_258)] animate-draw-stroke pointer-events-none"
                  viewBox="0 0 200 9"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 6C50 2 130 8 198 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
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

            {/* Responsive Integration Hub: Mobile Clean Grid (< md) + Desktop Interactive Hub & Spoke (md+) */}
            <div className="w-full max-w-[1060px]">
              {/* Mobile & Small Tablet Layout (< md): Zero overlap, spacious touch targets */}
              <div className="md:hidden flex flex-col items-center gap-5">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[oklch(0.54_0.19_258)] text-white shadow-[0_14px_30px_-8px_rgba(59,91,255,0.45)]">
                  <img
                    src="/dark-mode-logo.png"
                    alt="Crave HRM Hub"
                    className="h-7 w-auto object-contain brightness-0 invert"
                    decoding="async"
                  />
                  <div className="text-left">
                    <div className="text-[13px] font-black leading-tight">Crave HRM Hub</div>
                    <div className="text-[10.5px] text-white/80 font-medium">10 Integrasi Aktif</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full">
                  {INTEGRATION_HUB_NODES.map((node) => {
                    const isSelected = activeIntegrationNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveIntegrationNode(isSelected ? null : node)}
                        aria-pressed={isSelected}
                        className={cn(
                          "min-h-[54px] px-3 py-2.5 rounded-2xl bg-white border flex items-center justify-center transition-all cursor-pointer",
                          isSelected
                            ? "border-[oklch(0.54_0.19_258)] ring-2 ring-[oklch(0.54_0.19_258)]/15 shadow-sm"
                            : "border-[#E5E7EB] hover:border-[#CBD5E1] shadow-2xs"
                        )}
                        title={node.name}
                      >
                        <img
                          src={node.src}
                          alt={`Logo ${node.name}`}
                          loading="lazy"
                          decoding="async"
                          className={cn(node.logoClass, "w-auto max-w-[120px] object-contain")}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Interactive Hub & Spoke Diagram (md+) */}
              <div className="hidden md:flex relative w-full h-[300px] items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 280" fill="none">
                  {/* Left Bank Stream (BCA -> Mandiri -> Crave Hub) */}
                  <path
                    d="M 80 44 C 135 42, 195 46, 260 44 C 320 44, 355 140, 400 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 75 236 C 135 238, 195 234, 265 236 C 320 236, 355 140, 400 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 153 140 C 235 138, 335 142, 456 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />

                  {/* Right Agency & Ecosystem Stream (BPJS, Ditjen Pajak & Google -> Crave Hub) */}
                  <path
                    d="M 915 44 C 860 42, 800 46, 735 44 C 675 44, 640 140, 595 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 915 236 C 860 238, 800 234, 735 236 C 675 236, 640 140, 595 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 825 140 C 745 138, 655 142, 544 140"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.85"
                  />
                </svg>

                {/* Center Crave Hub Icon (Seamless Solid Blue) */}
                <div className="relative z-10 size-[88px] rounded-[26px] bg-gradient-to-br from-[#3B66FF] to-[oklch(0.54_0.19_258)] shadow-[0_18px_40px_-8px_rgba(59,91,255,0.50)] flex items-center justify-center">
                  <img
                    src="/dark-mode-logo.png"
                    alt="Crave HRM Hub"
                    className="h-11 object-contain brightness-0 invert"
                    decoding="async"
                  />
                </div>

                {/* 10 Interactive Official Partner Nodes */}
                {INTEGRATION_HUB_NODES.map((node) => {
                  const isSelected = activeIntegrationNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onMouseEnter={() => setActiveIntegrationNode(node)}
                      onFocus={() => setActiveIntegrationNode(node)}
                      onClick={() => setActiveIntegrationNode(isSelected ? null : node)}
                      aria-pressed={isSelected}
                      title={`${node.name} — ${node.detail}`}
                      className={cn(
                        "absolute h-11 px-3.5 rounded-2xl bg-white border transition-all duration-200 flex items-center justify-center cursor-pointer",
                        node.desktopPos,
                        isSelected
                          ? "border-[oklch(0.54_0.19_258)] ring-4 ring-[oklch(0.54_0.19_258)]/12 shadow-md scale-[1.04] z-20"
                          : "border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#CBD5E1] hover:scale-[1.03] z-10"
                      )}
                    >
                      <img
                        src={node.src}
                        alt={`Logo ${node.name}`}
                        loading="lazy"
                        decoding="async"
                        className={cn(node.logoClass, "w-auto max-w-[115px] object-contain select-none")}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Interactive Integration Detail Strip (Reveals concrete integration specs on hover/tap) */}
              <div className="mt-6 max-w-[680px] mx-auto min-h-[58px] px-4 py-3 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF4] flex items-center justify-center transition-all">
                {activeIntegrationNode ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <div className="h-8 px-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <img
                        src={activeIntegrationNode.src}
                        alt={activeIntegrationNode.name}
                        className="h-4.5 w-auto max-w-[90px] object-contain"
                      />
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] leading-snug text-[#374151]">
                      <span className="font-bold text-[#111827]">{activeIntegrationNode.name}</span>
                      <span className="mx-1.5 text-[#CBD5E1]">•</span>
                      <span>{activeIntegrationNode.detail}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12.5px] text-[#6B7280] font-medium">
                    Arahkan kursor atau ketuk salah satu logo mitra di atas untuk melihat rincian integrasi Crave HRM.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* S12: PRICING SECTION */}
        <section id="harga" className="w-full px-4 sm:px-6 py-8 scroll-mt-20 sm:scroll-mt-24">
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
              <h2 className="font-black text-[32px] sm:text-[42px] leading-[1.16] tracking-[-0.025em] text-white mb-7 text-center text-balance mx-auto">
                <BlurText
                  text="Investasi cerdas untuk"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-white"
                />{" "}
                <span className="relative inline-block">
                  <BlurText
                    text="efisiensi SDM"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-white"
                  />
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
                <Link
                  href="/contact-sales"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827] text-[13.5px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Contact Sales Enterprise
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* S13: FAQ WITH REAL HR CONSULTANT PHOTO */}
        <section id="faq" className="w-full py-20 px-4 sm:px-6 bg-white scroll-mt-20 sm:scroll-mt-24">
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
                  <BlurText
                    text="Masih memiliki pertanyaan seputar"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[#111827]"
                  />{" "}
                  <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                    <BlurText
                      text="Crave HRM"
                      effect="blur"
                      animateBy="letters"
                      direction="top"
                      staggerFrom="start"
                      trigger="view"
                      delay={35}
                      stepDuration={0.3}
                      blur={10}
                      distance={35}
                      className="inline text-[oklch(0.54_0.19_258)]"
                    />
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
                  <span className="text-[#111827]">?</span>
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

        {/* S14: CRAVE SERVICE CARDS */}
        <section id="ekosistem" className="w-full py-20 px-4 sm:px-6 bg-[#FBFBFB] border-t border-[#F1F2F6] scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              {/* Handwriting Badge with Doodle Arrow */}
              <div className="inline-flex items-center gap-2 mb-3 text-[oklch(0.54_0.19_258)] font-handwriting select-none">
                <span className="text-[21px] sm:text-[23px] font-bold tracking-wide animate-write-in">
                  Satu ekosistem untuk UMKM
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
              <h2 className="font-black text-[32px] sm:text-[40px] leading-[1.16] tracking-[-0.025em] text-[#111827] text-center text-balance mx-auto">
                <BlurText
                  text="Layanan Crave untuk"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-[#111827]"
                />{" "}
                <span className="relative inline-block text-[oklch(0.54_0.19_258)]">
                  <BlurText
                    text="usahamu"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-[oklch(0.54_0.19_258)]"
                  />
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

            <CraveServiceCards />
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
              <h2 className="font-black text-[30px] sm:text-[40px] leading-[1.18] tracking-[-0.025em] max-w-[620px] mx-auto mb-4 text-center text-balance">
                <BlurText
                  text="Otomatisasi Manajemen SDM &"
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-white"
                />{" "}
                <span className="relative inline-block">
                  <BlurText
                    text="Payroll Perusahaan"
                    effect="blur"
                    animateBy="letters"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={35}
                    stepDuration={0.3}
                    blur={10}
                    distance={35}
                    className="inline text-white"
                  />
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
                <BlurText
                  text="Anda Sekarang."
                  effect="blur"
                  animateBy="letters"
                  direction="top"
                  staggerFrom="start"
                  trigger="view"
                  delay={35}
                  stepDuration={0.3}
                  blur={10}
                  distance={35}
                  className="inline text-white"
                />
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
            className="relative w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
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
              <div className="size-11 rounded-2xl bg-[#111827] flex items-center justify-center shrink-0 shadow-2xs p-2.5">
                <img
                  src="/images/partners/Logo APPLE_Putih.png"
                  alt="Apple"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Install di Apple (iOS &amp; macOS)</h3>
                <p className="text-[12px] text-[#6B7280]">3 Langkah mudah pasang ke Layar Utama atau Dock</p>
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
            className="relative w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
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
              <div className="h-11 px-3 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/images/partners/Logo WINDOWS.png"
                  alt="Windows"
                  className="h-5.5 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Pasang di Windows &amp; Desktop</h3>
                <p className="text-[12px] text-[#6B7280]">Aplikasi desktop mandiri tanpa address bar browser</p>
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
                className="h-10 px-5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13px] font-bold transition-colors cursor-pointer"
              >
                Siap, Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GUIDE: INSTALASI DI ANDROID */}
      {showAndroidGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowAndroidGuide(false)}
        >
          <div
            className="relative w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAndroidGuide(false)}
              className="absolute top-5 right-5 size-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              aria-label="Tutup jendela"
            >
              <X className="size-4.5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 px-3 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/images/partners/Logo Android.png"
                  alt="Android"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] text-[#111827]">Install di Android</h3>
                <p className="text-[12px] text-[#6B7280]">Langsung dari Chrome tanpa perlu Play Store</p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5">
              Pasang Crave HRM di ponsel Android Anda untuk presensi GPS cepat, voucher QR kantin, dan notifikasi slip gaji real-time:
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Buka <strong>hrm.craveservices.my.id</strong> melalui browser <strong>Google Chrome</strong> di Android Anda.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Ketuk ikon <strong>titik tiga (⋮)</strong> di pojok kanan atas Chrome.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F1F2F6]">
                <div className="size-7 rounded-lg bg-[oklch(0.54_0.19_258)] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-[13px] text-[#111827] leading-relaxed">
                  Pilih <strong>&quot;Install app&quot;</strong> atau <strong>&quot;Tambahkan ke layar utama&quot;</strong> lalu konfirmasi <strong>Install</strong>.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F2F6] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin);
                  alert("Tautan Crave HRM telah disalin! Buka di Chrome Android Anda.");
                }}
                className="h-10 px-4 rounded-xl border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[13px] font-semibold text-[#111827] transition-colors cursor-pointer"
              >
                Salin Tautan Chrome
              </button>
              <button
                type="button"
                onClick={() => setShowAndroidGuide(false)}
                className="h-10 px-5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-[13px] font-bold transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
