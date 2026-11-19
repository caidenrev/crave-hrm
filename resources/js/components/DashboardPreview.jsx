import React, { useState } from "react";
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
  ChevronDown,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  MoreVertical,
  Bell,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { getEmployeeAvatar } from "@/lib/avatars";

export default function DashboardPreview() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openGroup, setOpenGroup] = useState(null);
  const [chartPeriod, setChartPeriod] = useState("hari");
  const [costPeriod, setCostPeriod] = useState("bulanan");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleGroup = (groupKey) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  };

  // Operational Navigation Items with functional submenus
  const OPERASIONAL_ITEMS = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      hasChildren: false,
    },
    {
      key: "presensi",
      label: "Presensi",
      icon: Clock,
      hasChildren: true,
      children: [
        { key: "presensi-harian", label: "Presensi Harian", icon: Camera },
        { key: "jadwal-shift", label: "Jadwal & Shift", icon: CalendarClock },
        { key: "rekap-kehadiran", label: "Rekap Kehadiran", icon: ClipboardList },
      ],
    },
    {
      key: "cuti",
      label: "Cuti & Libur",
      icon: CalendarDays,
      hasChildren: true,
      children: [
        { key: "cuti-saya", label: "Cuti & Izin Saya", icon: CalendarDays },
        { key: "approval-cuti", label: "Persetujuan Cuti", icon: CheckSquare },
        { key: "kalender-libur", label: "Kalender & Libur", icon: Calendar },
      ],
    },
    {
      key: "klaim",
      label: "Klaim & Lembur",
      icon: Receipt,
      hasChildren: true,
      children: [
        { key: "lembur-spkl", label: "Lembur (SPKL)", icon: Timer },
        { key: "reimbursement", label: "Reimbursement", icon: Receipt },
        { key: "tugas-lapangan", label: "Tugas Lapangan / Visit", icon: MapPin },
      ],
    },
    {
      key: "canteen",
      label: "Crave Canteen",
      icon: UtensilsCrossed,
      hasChildren: true,
      children: [
        { key: "voucher-saya", label: "Voucher QR Saya", icon: QrCode },
        { key: "scanner-merchant", label: "Scanner Merchant", icon: ScanBarcode },
        { key: "rekon-vendor", label: "Rekonsiliasi Vendor", icon: FileSpreadsheet },
      ],
    },
    {
      key: "payroll",
      label: "Payroll Management",
      icon: FileSpreadsheet,
      hasChildren: true,
      children: [
        { key: "proses-payroll", label: "Proses Payroll", icon: Calculator },
        { key: "slip-gaji", label: "Slip Gaji", icon: FileText },
        { key: "ekspor-bank", label: "Ekspor Bank & Rekap", icon: Landmark },
      ],
    },
  ];

  const TALENTA_ITEMS = [
    { key: "karyawan", label: "Data Karyawan", icon: Users },
    { key: "recruitment", label: "Crave E-Recruitment", icon: UserCheck },
    { key: "performance", label: "360 Performance", icon: Compass },
  ];

  // 4 Top Stats (Identical to Image 2)
  const stats = [
    {
      label: "Tingkat Kehadiran",
      value: "100%",
      delta: "+3.2%",
      up: true,
      icon: Clock,
      isPrimary: true,
    },
    {
      label: "Karyawan Aktif",
      value: "148",
      delta: "Terdaftar",
      up: true,
      icon: Users,
      isPrimary: false,
    },
    {
      label: "Approval Pending",
      value: "0",
      delta: "Nihil",
      up: true,
      icon: AlertTriangle,
      isPrimary: false,
    },
    {
      label: "Estimasi Payroll",
      value: "Rp 148.650.000",
      delta: "Payroll November 2026",
      up: true,
      icon: FileSpreadsheet,
      isPrimary: false,
    },
  ];

  // Dummy presensi feed
  const recentPresensi = [
    {
      name: "Siti Nurhaliza",
      role: "UI/UX Designer",
      time: "08:02 WIB",
      location: "Radius 12m • HQ Surabaya",
      status: "Tepat Waktu",
    },
    {
      name: "Budi Santoso",
      role: "Backend Engineer",
      time: "08:14 WIB",
      location: "Radius 18m • HQ Surabaya",
      status: "Tepat Waktu",
    },
  ];

  return (
    <div className="relative z-10 w-full max-w-[1060px] mx-auto bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(27,92,254,0.18)] border border-[#E5E8F0] overflow-hidden text-left flex flex-col md:flex-row transition-all duration-300">
      {/* ================= LEFT SIDEBAR (COMPACT & FULLY FUNCTIONAL DROPDOWNS) ================= */}
      <aside
        className={`shrink-0 border-r border-[#EBF0F5] bg-white flex flex-col justify-between p-3 select-none transition-all duration-300 ${
          sidebarCollapsed ? "hidden md:flex w-[68px]" : "hidden md:flex w-[215px] lg:w-[225px]"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2 px-1 py-1">
            <img src="/light-mode-logo.png" alt="Crave" className="size-6 object-contain shrink-0" />
            {!sidebarCollapsed && (
              <div className="min-w-0 leading-tight">
                <div className="font-extrabold text-[14.5px] text-[#111827] tracking-tight">Crave</div>
                <div className="text-[9px] text-[#6B7280] font-medium truncate">
                  Human Resource Management
                </div>
              </div>
            )}
          </div>

          {/* Company Switcher Pill */}
          {!sidebarCollapsed && (
            <div className="mt-3 p-1.5 rounded-xl bg-[#F8FAFC] border border-[#EBF0F5] flex items-center justify-between cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="size-5 rounded-lg bg-[#E2E8F0] text-[#334155] font-bold text-[10px] flex items-center justify-center shrink-0">
                  C
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-[#111827] truncate leading-tight">
                    PT Crave Mitra Logistik
                  </div>
                  <div className="text-[8.5px] text-[#6B7280] truncate leading-tight">
                    Subsidiary • company admin
                  </div>
                </div>
              </div>
              <ChevronDown className="size-3 text-[#9CA3AF] shrink-0 ml-1" />
            </div>
          )}

          {/* Search Module Box */}
          {!sidebarCollapsed && (
            <div className="mt-2.5 relative">
              <Search className="size-3 text-[#9CA3AF] absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                readOnly
                value=""
                placeholder="Cari modul..."
                className="w-full bg-[#F8FAFC] border border-[#EBF0F5] rounded-xl pl-7 pr-6 py-1 text-[10.5px] text-[#374151] placeholder:text-[#9CA3AF] cursor-default focus:outline-none"
              />
              <SlidersHorizontal className="size-3 text-[#9CA3AF] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          )}

          {/* Navigation Section: OPERASIONAL */}
          <div className="mt-3">
            {!sidebarCollapsed && (
              <div className="text-[9px] font-bold text-[#9CA3AF] tracking-wider uppercase px-2 mb-1">
                Operasional
              </div>
            )}
            <div className="space-y-0.5">
              {OPERASIONAL_ITEMS.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeMenu === item.key;
                const isOpen = openGroup === item.key;

                if (!item.hasChildren) {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveMenu(item.key)}
                      className={`w-full text-left font-bold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                        isItemActive
                          ? "bg-[oklch(0.54_0.19_258)] text-white shadow-xs"
                          : "text-[#4B5563] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                }

                // Collapsible accordion submenu
                return (
                  <div key={item.key} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.key)}
                      className={`w-full text-left text-[11px] font-medium px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        isOpen
                          ? "text-[oklch(0.54_0.19_258)] bg-[#F8FAFC] font-bold"
                          : "text-[#4B5563] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="size-3.5 shrink-0 text-[#6B7280]" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown
                          className={`size-3 text-[#9CA3AF] transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[oklch(0.54_0.19_258)]" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Smooth Animated Submenu Dropdown */}
                    {!sidebarCollapsed && (
                      <div
                        className={`grid transition-all duration-200 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100 mb-1" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-4 pl-2 space-y-0.5 border-l border-[#E2E8F0] pt-0.5">
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildActive = activeMenu === child.key;
                              return (
                                <button
                                  key={child.key}
                                  type="button"
                                  onClick={() => setActiveMenu(child.key)}
                                  className={`w-full text-left text-[10px] px-2 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    isChildActive
                                      ? "bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] font-bold"
                                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                                  }`}
                                >
                                  <ChildIcon className="size-3 shrink-0" />
                                  <span className="truncate">{child.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Section: TALENTA & TIM */}
          <div className="mt-2.5">
            {!sidebarCollapsed && (
              <div className="text-[9px] font-bold text-[#9CA3AF] tracking-wider uppercase px-2 mb-1">
                Talenta & Tim
              </div>
            )}
            <div className="space-y-0.5">
              {TALENTA_ITEMS.map((item) => {
                const Icon = item.icon;
                const isItemActive = activeMenu === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveMenu(item.key)}
                    className={`w-full text-left text-[11px] font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                      isItemActive
                        ? "bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] font-bold"
                        : "text-[#4B5563] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <Icon className="size-3.5 text-[#6B7280] shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Mode Toggle & User Profile */}
        <div className="pt-2 border-t border-[#EBF0F5] space-y-1.5">
          {!sidebarCollapsed && (
            <div className="p-0.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center text-[10px]">
              <div className="flex-1 py-0.5 rounded-lg bg-white shadow-xs text-center font-bold text-[#0F172A] flex items-center justify-center gap-1">
                <Sun className="size-2.5 text-[#F59E0B]" />
                <span>Light</span>
              </div>
              <div className="flex-1 py-0.5 text-center font-medium text-[#64748B] flex items-center justify-center gap-1">
                <Moon className="size-2.5" />
                <span>Dark</span>
              </div>
            </div>
          )}

          <div className="p-1 rounded-xl bg-[#F8FAFC] border border-[#EBF0F5] flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <img
                src={getEmployeeAvatar({ email: "founder@craveservices.my.id", name: "Eka Revandi" })}
                alt="Eka Revandi"
                decoding="async"
                className="size-6 rounded-full object-cover bg-white border border-[#E2E8F0] shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-[#111827] truncate leading-tight">Eka Revandi</div>
                  <div className="text-[8.5px] text-[#6B7280] truncate leading-tight">founder@craveservices.my.id</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && <MoreVertical className="size-3 text-[#9CA3AF] shrink-0" />}
          </div>
        </div>
      </aside>

      {/* ================= RIGHT MAIN CONTENT (STREAMLINED 1:1 TO REFERENCE) ================= */}
      <main className="flex-1 min-w-0 bg-[#F8FAFC] flex flex-col p-3.5 sm:p-4 lg:p-5 space-y-3.5 overflow-hidden">
        {/* Main Header Bar: Exact 1-line alignment */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EBF0F5]">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="size-6 rounded-full bg-[oklch(0.54_0.19_258)] hover:bg-[#1546CC] text-white flex items-center justify-center shadow-xs shrink-0 transition-colors"
              title="Toggle Sidebar"
            >
              <ChevronLeft className={`size-3.5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
            <div className="min-w-0">
              {/* User requested: "dan tulisan dashboard nya ganti jadi Hello HR!" */}
              <h2 className="text-[18px] sm:text-[20px] font-black tracking-tight text-[#111827] leading-tight truncate">
                Hello HR!
              </h2>
              <p className="text-[10.5px] text-[#6B7280] font-medium truncate hidden sm:block">
                Ringkasan metrik SDM, kehadiran real-time dan beban payroll perusahaan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input Bar */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-[10.5px] text-[#94A3B8] w-48">
              <Search className="size-3 text-[#94A3B8]" />
              <span className="truncate">Cari data atau modul...</span>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[#1546CC] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Users className="size-3.5" />
              <span className="hidden sm:inline">Data Karyawan</span>
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative size-7 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#475569] shadow-2xs">
              <Bell className="size-3.5" />
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-[oklch(0.54_0.19_258)] text-white text-[8.5px] font-black flex items-center justify-center">
                3
              </span>
            </div>

            {/* User Avatar */}
            <img
              src={getEmployeeAvatar({ email: "founder@craveservices.my.id", name: "Eka Revandi" })}
              alt="Eka Revandi"
              decoding="async"
              className="size-7 rounded-full object-cover bg-white ring-2 ring-white border border-[#E2E8F0] shadow-2xs shrink-0"
            />
          </div>
        </div>

        {/* 1. TOP 4 KPI CARDS (Matching Image 2) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`p-3 rounded-2xl flex flex-col justify-between transition-all ${
                s.isPrimary
                  ? "bg-gradient-to-br from-[oklch(0.54_0.19_258)] to-[#1E40AF] text-white shadow-md shadow-[oklch(0.54_0.19_258_/_0.25)] border border-[oklch(0.54_0.19_258)]"
                  : "bg-white border border-[#EBF0F5] shadow-xs text-[#0F172A]"
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className={s.isPrimary ? "text-white" : "text-[#1E293B]"}>
                  <s.icon className="size-4" />
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    s.isPrimary
                      ? "text-white bg-white/20"
                      : "text-emerald-700 bg-emerald-50 dark:text-emerald-400"
                  }`}
                >
                  <ArrowUpRight className="size-3 shrink-0" />
                  {s.delta}
                </span>
              </div>
              <div className="mt-2.5">
                <p
                  className={`text-[19px] sm:text-[21px] font-black tracking-tight leading-none truncate ${
                    s.isPrimary ? "text-white" : "text-[#0F172A]"
                  }`}
                >
                  {s.value}
                </p>
                <p
                  className={`text-[10.5px] font-semibold mt-1 truncate ${
                    s.isPrimary ? "text-white/85" : "text-[#64748B]"
                  }`}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. CHARTS SECTION (Tren Kehadiran + Distribusi Divisi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Chart: Tren Kehadiran Staf Mingguan (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EBF0F5] p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-extrabold text-[13px] text-[#0F172A] leading-tight">
                  Tren Kehadiran Staf Mingguan
                </h3>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Agregasi kehadiran GPS & selfie hari kerja
                </p>
              </div>
              <div className="flex items-center p-0.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[10px]">
                <button
                  type="button"
                  onClick={() => setChartPeriod("hari")}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    chartPeriod === "hari"
                      ? "bg-white shadow-xs text-[#0F172A]"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Hari
                </button>
                <button
                  type="button"
                  onClick={() => setChartPeriod("minggu")}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    chartPeriod === "minggu"
                      ? "bg-white shadow-xs text-[#0F172A]"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Minggu
                </button>
              </div>
            </div>

            {/* Spline Area Chart with Y-axis numbers matching Image 2 */}
            <div className="relative w-full h-[145px] flex items-end">
              {/* Y-axis Labels on Left */}
              <div className="flex flex-col justify-between h-[115px] pr-2 text-[9px] font-semibold text-[#94A3B8] pb-4">
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>

              {/* Chart Grid & Spline Area */}
              <div className="relative flex-1 h-[115px] pb-4">
                {/* Horizontal Dashed Grid Lines */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none opacity-30">
                  <div className="border-b border-dashed border-[#94A3B8]" />
                  <div className="border-b border-dashed border-[#94A3B8]" />
                  <div className="border-b border-dashed border-[#94A3B8]" />
                  <div className="border-b border-dashed border-[#94A3B8]" />
                  <div className="border-b border-[#CBD5E1]" />
                </div>

                {/* Spline SVG */}
                <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="liveSplineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.54 0.19 258)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="oklch(0.54 0.19 258)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Exact curve from Image 2: flat at ~1 on Rab-Jum, dips to 0 on Sab-Min, up on Sen-Sel */}
                  <path
                    d="M 10,75 L 140,75 C 170,75 210,98 250,98 C 290,98 330,75 360,75 L 490,75 L 490,100 L 10,100 Z"
                    fill="url(#liveSplineGradient)"
                  />
                  <path
                    d="M 10,75 L 140,75 C 170,75 210,98 250,98 C 290,98 330,75 360,75 L 490,75"
                    fill="none"
                    stroke="oklch(0.54 0.19 258)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Day Labels matching Image 2 */}
                <div className="flex justify-between items-center text-[10px] font-semibold text-[#64748B] pt-1">
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span className="text-[#94A3B8]">Sab</span>
                  <span className="text-[#94A3B8]">Min</span>
                  <span>Sen</span>
                  <span className="font-bold text-[oklch(0.54_0.19_258)]">Sel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Chart: Distribusi Staf per Divisi (5 cols) matching Image 2 */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBF0F5] p-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-[13px] text-[#0F172A] leading-tight">
                Distribusi Staf per Divisi
              </h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Komposisi staf per departemen
              </p>
            </div>

            {/* Donut Chart matching Image 2 */}
            <div className="flex items-center justify-center py-1 relative">
              <svg viewBox="0 0 120 120" className="size-28">
                {/* Clean Primary Blue Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="oklch(0.54 0.19 258)"
                  strokeWidth="15"
                />
                <circle cx="60" cy="60" r="36" fill="white" />
              </svg>
            </div>

            {/* Legend from Image 2 */}
            <div className="pt-2 border-t border-[#F1F5F9] text-[10.5px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                  <span className="size-2 rounded-full bg-[oklch(0.54_0.19_258)] shrink-0" />
                  Warehouse & Fleet Logistics
                </span>
                <span className="font-bold text-[#0F172A]">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ROW 3: TWO SPLIT CARDS (PRESENSI MASUK HARI INI + KOMPOSISI BEBAN SDM PER FUNGSI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Card: Presensi Masuk Hari Ini (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EBF0F5] p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-extrabold text-[13px] text-[#0F172A] leading-tight">
                  Presensi Masuk Hari Ini
                </h3>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Verifikasi GPS geofence & kamera selfie kantor
                </p>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live DB</span>
              </div>
            </div>

            {/* Presensi List with Dummy Records */}
            <div className="divide-y divide-[#F1F5F9] my-auto">
              {recentPresensi.map((row, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-2 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={getEmployeeAvatar({ id: idx + 1, name: row.name })}
                      alt={row.name}
                      decoding="async"
                      className="size-7 rounded-full object-cover bg-white border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#0F172A] leading-tight truncate">
                        {row.name} <span className="text-[9.5px] font-normal text-[#64748B]">• {row.role}</span>
                      </div>
                      <div className="text-[9.5px] text-[#64748B] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="size-2.5 text-[#94A3B8] shrink-0" />
                        <span className="truncate">{row.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-[10.5px] font-bold text-[#0F172A]">{row.time}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Komposisi Beban SDM per Fungsi (5 cols) matching Image 2 */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBF0F5] p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-2">
              <div>
                <h3 className="font-extrabold text-[13px] text-[#0F172A] leading-tight">
                  Komposisi Beban SDM per Fungsi
                </h3>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Alokasi kompensasi & beban operasional tenaga kerja
                </p>
              </div>
              <div className="flex items-center p-0.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[9.5px]">
                <button
                  type="button"
                  onClick={() => setCostPeriod("bulanan")}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    costPeriod === "bulanan" ? "bg-white shadow-xs text-[#0F172A]" : "text-[#64748B]"
                  }`}
                >
                  Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setCostPeriod("divisi")}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    costPeriod === "divisi" ? "bg-white shadow-xs text-[#0F172A]" : "text-[#64748B]"
                  }`}
                >
                  Divisi
                </button>
              </div>
            </div>

            {/* Stacked Bars with Y-Axis matching Image 2 */}
            <div className="flex items-end gap-1.5 pt-1 h-[90px]">
              {/* Y-Axis numbers */}
              <div className="flex flex-col justify-between h-[80px] text-[8.5px] font-semibold text-[#94A3B8] pr-1">
                <span>18jt</span>
                <span>14jt</span>
                <span>9jt</span>
              </div>

              {/* 6 Stacked Bars */}
              <div className="flex-1 flex items-end justify-between gap-1.5 h-[80px] pb-1 border-b border-[#E2E8F0]">
                {[
                  { h: 62, top: 4, mid: 8, btm: 50 },
                  { h: 66, top: 5, mid: 9, btm: 52 },
                  { h: 68, top: 5, mid: 10, btm: 53 },
                  { h: 72, top: 6, mid: 10, btm: 56 },
                  { h: 74, top: 6, mid: 11, btm: 57 },
                  { h: 78, top: 7, mid: 11, btm: 60 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col-reverse rounded-t-[3px] overflow-hidden">
                    <div style={{ height: `${bar.btm}px` }} className="w-full bg-[oklch(0.54_0.19_258)]" />
                    <div style={{ height: `${bar.mid}px` }} className="w-full bg-[#38BDF8]" />
                    <div style={{ height: `${bar.top}px` }} className="w-full bg-[#10B981]" />
                    <div style={{ height: "4px" }} className="w-full bg-[#F59E0B]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}