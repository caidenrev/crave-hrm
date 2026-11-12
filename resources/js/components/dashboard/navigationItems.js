import {
  LayoutDashboard,
  Clock,
  Camera,
  CalendarClock,
  ClipboardList,
  CalendarDays,
  CheckSquare,
  Calendar,
  Receipt,
  Timer,
  MapPin,
  UtensilsCrossed,
  QrCode,
  ScanBarcode,
  FileSpreadsheet,
  Calculator,
  FileText,
  Landmark,
  Users,
  UserCheck,
  Compass,
  Megaphone,
  SlidersHorizontal,
  Building2,
  Network,
} from "lucide-react";

export const MENU_OPERASIONAL = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Presensi",
    href: "/attendance",
    icon: Clock,
    children: [
      { label: "Presensi Harian", href: "/attendance", icon: Camera },
      { label: "Jadwal & Shift", href: "/attendance/shifts", icon: CalendarClock },
      { label: "Rekap Kehadiran", href: "/attendance/recap", icon: ClipboardList },
    ],
  },
  {
    label: "Cuti & Libur",
    href: "/leave",
    icon: CalendarDays,
    children: [
      { label: "Cuti & Izin Saya", href: "/leave", icon: CalendarDays },
      { label: "Persetujuan Cuti", href: "/leave/approvals", icon: CheckSquare },
      { label: "Kalender & Libur", href: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "Klaim & Lembur",
    href: "/claims",
    icon: Receipt,
    children: [
      { label: "Lembur (SPKL)", href: "/claims/overtime", icon: Timer },
      { label: "Reimbursement", href: "/claims/reimbursement", icon: Receipt },
      { label: "Tugas Lapangan / Visit", href: "/claims/visit", icon: MapPin },
    ],
  },
  {
    label: "Crave Canteen",
    href: "/canteen",
    icon: UtensilsCrossed,
    children: [
      { label: "Voucher QR Saya", href: "/canteen", icon: QrCode },
      { label: "Scanner Merchant", href: "/canteen/scanner", icon: ScanBarcode },
      { label: "Rekonsiliasi Vendor", href: "/canteen/settlement", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Payroll Management",
    href: "/payroll",
    icon: FileSpreadsheet,
    children: [
      { label: "Proses Payroll", href: "/payroll", icon: Calculator },
      { label: "Slip Gaji", href: "/payroll/slips", icon: FileText },
      { label: "Ekspor Bank & Rekap", href: "/payroll/export", icon: Landmark },
    ],
  },
];

export const MENU_TALENTA = [
  { label: "Data Karyawan", href: "/employees", icon: Users },
  { label: "Crave E-Recruitment", href: "/recruitment", icon: UserCheck },
  { label: "360 Performance", href: "/performance", icon: Compass },
];

export const MENU_PENGATURAN = [
  { label: "Pengumuman", href: "/announcements", icon: Megaphone },
  {
    label: "Organisasi & Akses",
    href: "/organization",
    icon: SlidersHorizontal,
    children: [
      { label: "Cabang & Geofence", href: "/organization/branches", icon: Building2 },
      { label: "Struktur Organisasi", href: "/organization/chart", icon: Network },
      { label: "Matriks Izin RBAC", href: "/organization/rbac-matrix", icon: SlidersHorizontal },
    ],
  },
];
