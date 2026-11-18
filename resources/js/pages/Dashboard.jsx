import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
  Receipt,
  Megaphone,
  Briefcase,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { formatRupiah, getInitials } from "@/lib/formatters";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export default function Dashboard({
  role = "company_admin",
  isManagerial = true,
  metrics = {},
  attendanceWeekly = [],
  departmentShare = [],
  recentAttendances = [],
  payrollCostMonthly = [],
  payrollCostByDept = [],
  employeeSelfService = {},
  announcements = [],
  upcomingHolidays = [],
}) {
  const [chartPeriod, setChartPeriod] = useState("hari");
  const [costViewMode, setCostViewMode] = useState("bulanan");

  // Format payroll value safely
  const formattedPayroll = metrics.estimated_payroll
    ? formatRupiah(metrics.estimated_payroll)
    : "Rp 0";

  const adminStats = [
    {
      label: "Tingkat Kehadiran",
      value: metrics.attendance_rate || "100%",
      delta: "+3.2%",
      up: true,
      icon: Clock,
    },
    {
      label: "Karyawan Aktif",
      value: String(metrics.active_employees || 0),
      delta: "Terdaftar",
      up: true,
      icon: Users,
    },
    {
      label: "Approval Pending",
      value: String(metrics.pending_approvals || 0),
      delta: (metrics.pending_approvals || 0) > 0 ? "Perlu tindakan" : "Nihil",
      up: (metrics.pending_approvals || 0) === 0,
      icon: AlertTriangle,
    },
    {
      label: "Estimasi Payroll",
      value: formattedPayroll,
      delta: metrics.period_name || "Periode Berjalan",
      up: true,
      icon: FileSpreadsheet,
    },
  ];

  // Employee Self-Service Cards
  const empAtt = employeeSelfService.attendanceToday;
  const empVoucher = employeeSelfService.voucherToday;
  const empLeave = employeeSelfService.leaveQuota ?? 12;
  const empPayslip = employeeSelfService.latestPayslip;

  const employeeStats = [
    {
      label: "Presensi Hari Ini",
      value: empAtt?.clock_in_time
        ? empAtt.clock_in_time.substring(0, 5) + " WIB"
        : "Belum Masuk",
      delta: empAtt?.clock_in_time
        ? ((empAtt.late_minutes || 0) === 0 ? "Tepat Waktu" : `${empAtt.late_minutes}m Terlambat`)
        : "Klik untuk Absen",
      up: empAtt ? (empAtt.late_minutes || 0) === 0 : false,
      icon: Clock,
      href: "/attendance",
    },
    {
      label: "Sisa Kuota Cuti",
      value: `${empLeave} Hari`,
      delta: "Cuti Tahunan",
      up: empLeave > 0,
      icon: CalendarDays,
      href: "/leave",
    },
    {
      label: "Voucher Kantin",
      value: empVoucher ? "Klaim Selesai" : "Tersedia Hari Ini",
      delta: empVoucher ? "Terpakai" : "Siap Ditukar",
      up: !empVoucher,
      icon: UtensilsCrossed,
      href: "/canteen",
    },
    {
      label: "Slip Gaji Terakhir",
      value: empPayslip ? formatRupiah(empPayslip.take_home_pay || empPayslip.gaji_bersih || 0) : "Tersedia",
      delta: empPayslip?.payroll_period?.name || empPayslip?.period?.name || "Bulan Lalu",
      up: true,
      icon: Receipt,
      href: "/payroll/slips",
    },
  ];

  const currentStats = isManagerial ? adminStats : employeeStats;

  return (
    <AuthenticatedLayout
      title={isManagerial ? "Dasbor Operasional" : "Dasbor Karyawan"}
      subtitle={
        isManagerial
          ? "Ringkasan metrik SDM, kehadiran real-time dan beban payroll perusahaan"
          : "Portal layanan mandiri karyawan: presensi, kuota cuti, voucher makan dan slip gaji"
      }
      actions={
        isManagerial ? (
          <Button asChild size="sm" className="rounded-xl text-xs font-bold gap-1.5 shadow-soft">
            <Link href="/employees">
              <Users className="size-4" />
              <span className="hidden sm:inline">Data Karyawan</span>
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" className="rounded-xl text-xs font-bold gap-1.5 shadow-soft">
            <Link href="/attendance">
              <Clock className="size-4" />
              <span>Presensi Masuk</span>
            </Link>
          </Button>
        )
      }
    >
      <Head title={isManagerial ? "Dasbor Operasional | Crave HRM" : "Dasbor Karyawan | Crave HRM"} />

      <div className="space-y-4 sm:space-y-5">
        {/* 1. TOP METRICS CARDS (Hero Blue + 3 Card-Soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {currentStats.map((s, i) => (
            <div
              key={s.label}
              className={
                "p-3 flex flex-col justify-between rounded-2xl sm:rounded-3xl sm:p-4 transition-all " +
                (i === 0
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary"
                  : "bg-card border border-border/50 shadow-soft text-card-foreground")
              }
            >
              <div className="flex items-start justify-between gap-1.5">
                <span className={i === 0 ? "text-white" : "text-foreground"}>
                  <s.icon className="size-4.5 sm:size-5" />
                </span>
                <span
                  className={
                    "flex items-center gap-1 text-[11px] sm:text-xs font-bold truncate " +
                    (i === 0
                      ? "text-white/90"
                      : s.up
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive")
                  }
                >
                  {s.up ? (
                    <ArrowUpRight className="size-3.5 shrink-0" />
                  ) : (
                    <ArrowDownRight className="size-3.5 shrink-0" />
                  )}
                  {s.delta}
                </span>
              </div>
              <div className="mt-3">
                <p
                  className={
                    "text-lg font-black tracking-tight sm:text-2xl truncate " +
                    (i === 0 ? "text-white" : "text-foreground")
                  }
                >
                  {s.value}
                </p>
                <p
                  className={
                    "text-[11px] sm:text-xs font-medium mt-0.5 truncate " +
                    (i === 0 ? "text-primary-foreground/80" : "text-muted-foreground")
                  }
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. MAIN SECTION (Adaptive: Managerial vs Employee) */}
        {isManagerial ? (
          <>
            {/* CHARTS SECTION (Tren Kehadiran & Sebaran Divisi) */}
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              {/* Main Chart */}
              <div className="card-soft p-4 bg-card border border-border/50">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-foreground">
                      Tren Kehadiran Staf Mingguan
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Agregasi kehadiran GPS & selfie hari kerja
                    </p>
                  </div>
                  <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                    <TabsList className="rounded-xl h-8">
                      <TabsTrigger value="hari" className="text-xs px-2.5">
                        Hari
                      </TabsTrigger>
                      <TabsTrigger value="minggu" className="text-xs px-2.5">
                        Minggu
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceWeekly}>
                      <defs>
                        <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--color-border)" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                      <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-card)",
                          color: "var(--color-foreground)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hadir"
                        stroke="var(--color-primary)"
                        strokeWidth={2.5}
                        fill="url(#fillAttendance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="card-soft p-4 bg-card border border-border/50">
                <p className="text-sm font-extrabold text-foreground">Distribusi Staf per Divisi</p>
                <p className="text-[11px] text-muted-foreground">Komposisi staf per departemen</p>
                <div className="mt-2 h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentShare}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={46}
                        outerRadius={68}
                        paddingAngle={3}
                      >
                        {departmentShare.map((_, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {departmentShare.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground truncate">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ background: chartColors[i % 4] }}
                        />
                        <span className="truncate">{c.name}</span>
                      </span>
                      <span className="font-bold text-foreground">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT ATTENDANCE ACTIVITY LIST */}
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="card-soft p-4 bg-card border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Presensi Masuk Hari Ini</p>
                    <p className="text-[11px] text-muted-foreground">
                      Verifikasi GPS geofence & kamera selfie kantor
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    Live DB
                  </Badge>
                </div>
                <div className="space-y-2">
                  {recentAttendances.length > 0 ? (
                    recentAttendances.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/40 p-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <EmployeeAvatar
                            person={item}
                            name={item.name}
                            className="size-8"
                            fallbackClassName="text-[10px] font-black"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-foreground">{item.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">
                              {item.dept} · {item.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            {item.time}
                          </span>
                          <Badge
                            variant={item.onTime ? "secondary" : "destructive"}
                            className="rounded-full text-[10px]"
                          >
                            {item.onTime ? "Tepat Waktu" : "Terlambat"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      Belum ada catatan presensi hari ini.
                    </div>
                  )}
                </div>
              </div>

              {/* Komposisi Beban SDM per Fungsi (Stacked BarChart) */}
              <div className="card-soft p-4 bg-card border border-border/50 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-foreground">
                        Komposisi Beban SDM per Fungsi
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Alokasi kompensasi & beban operasional tenaga kerja
                      </p>
                    </div>
                    <Tabs value={costViewMode} onValueChange={setCostViewMode}>
                      <TabsList className="rounded-xl h-8">
                        <TabsTrigger value="bulanan" className="text-xs px-2.5">
                          Bulanan
                        </TabsTrigger>
                        <TabsTrigger value="divisi" className="text-xs px-2.5">
                          Divisi
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="mt-3 h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={costViewMode === "bulanan" ? payrollCostMonthly : payrollCostByDept}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="4 4"
                          stroke="var(--color-border)"
                        />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                          width={38}
                        />
                        <Tooltip
                          formatter={(value, name) => [formatRupiah(value), name]}
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-card)",
                            color: "var(--color-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Bar
                          dataKey="gajiPokok"
                          name="Gaji Pokok"
                          stackId="a"
                          fill="var(--color-chart-1)"
                          radius={[0, 0, 4, 4]}
                        />
                        <Bar
                          dataKey="tunjangan"
                          name="Tunjangan"
                          stackId="a"
                          fill="var(--color-chart-2)"
                        />
                        <Bar
                          dataKey="lembur"
                          name="Lembur PP 35"
                          stackId="a"
                          fill="var(--color-chart-3)"
                        />
                        <Bar
                          dataKey="bpjs"
                          name="BPJS & Manfaat"
                          stackId="a"
                          fill="var(--color-chart-4)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend Indicators with Layer Colors per Function */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--color-chart-1)" }} />
                      <span className="text-muted-foreground truncate font-medium">Gaji Pokok</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--color-chart-2)" }} />
                      <span className="text-muted-foreground truncate font-medium">Tunjangan</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--color-chart-3)" }} />
                      <span className="text-muted-foreground truncate font-medium">Lembur PP 35</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--color-chart-4)" }} />
                      <span className="text-muted-foreground truncate font-medium">BPJS & Manfaat</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Crave HRM SaaS v2.0</span>
                  <span className="font-semibold text-primary">Crave Global Group</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* EMPLOYEE SELF-SERVICE VIEW */
          <div className="grid gap-4 xl:grid-cols-2">
            {/* Pengumuman Terbaru */}
            <div className="card-soft p-4 bg-card border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-extrabold text-foreground">Pengumuman Internal</p>
                  <p className="text-[11px] text-muted-foreground">Edaran dan kebijakan resmi perusahaan</p>
                </div>
                <Megaphone className="size-4 text-primary" />
              </div>

              <div className="space-y-2.5">
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-foreground">{a.title}</p>
                        <Badge variant="secondary" className="text-[10px]">
                          {a.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {a.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada pengumuman baru.
                  </div>
                )}
              </div>
            </div>

            {/* Kalender Libur & Shift Saya */}
            <div className="card-soft p-4 bg-card border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-extrabold text-foreground">Hari Libur Terdekat (SKB 3 Menteri)</p>
                  <p className="text-[11px] text-muted-foreground">Agenda libur nasional mendatang</p>
                </div>
                <Calendar className="size-4 text-primary" />
              </div>

              <div className="space-y-2">
                {upcomingHolidays.length > 0 ? (
                  upcomingHolidays.map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                      <div>
                        <p className="text-xs font-bold text-foreground">{h.name}</p>
                        <p className="text-[10px] text-muted-foreground">{h.date}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {h.type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Tidak ada jadwal libur dalam waktu dekat.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
