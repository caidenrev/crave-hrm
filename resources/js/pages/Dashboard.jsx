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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRupiah, getInitials } from "@/lib/formatters";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState("hari");

  const stats = [
    {
      label: "Tingkat Kehadiran",
      value: "96.4%",
      delta: "+3.2%",
      up: true,
      icon: Clock,
    },
    {
      label: "Karyawan Aktif",
      value: "102",
      delta: "+4 bulan ini",
      up: true,
      icon: Users,
    },
    {
      label: "Cuti & Lembur Pending",
      value: "7",
      delta: "Perlu approval",
      up: false,
      icon: AlertTriangle,
    },
    {
      label: "Estimasi Payroll",
      value: "Rp 485.2 Jt",
      delta: "Periode Nov 2026",
      up: true,
      icon: FileSpreadsheet,
    },
  ];

  const attendanceData = [
    { label: "Sen", hadir: 98, telat: 4 },
    { label: "Sel", hadir: 99, telat: 2 },
    { label: "Rab", hadir: 101, telat: 1 },
    { label: "Kam", hadir: 97, telat: 5 },
    { label: "Jum", hadir: 100, telat: 2 },
    { label: "Sab", hadir: 45, telat: 0 },
    { label: "Min", hadir: 0, telat: 0 },
  ];

  const employeeShare = [
    { name: "Engineering", value: 38 },
    { name: "Product & UI", value: 24 },
    { name: "Operations", value: 22 },
    { name: "HR & Finance", value: 16 },
  ];

  const recentAttendances = [
    {
      name: "Eka Revandi",
      dept: "Engineering",
      time: "08:14 WIB",
      type: "WFO · Sudirman HQ",
      onTime: true,
    },
    {
      name: "Egi Witra Aditya",
      dept: "Product",
      time: "08:25 WIB",
      type: "WFO · Sudirman HQ",
      onTime: true,
    },
    {
      name: "Aufa",
      dept: "Engineering",
      time: "08:42 WIB",
      type: "WFO · Sudirman HQ",
      onTime: true,
    },
    {
      name: "Rian Pratama",
      dept: "Engineering",
      time: "09:05 WIB",
      type: "Cabang Bandung",
      onTime: false,
    },
  ];

  const pendingApprovals = [
    {
      name: "Budi Santoso",
      type: "Cuti Tahunan",
      period: "14 - 16 Nov (3 Hari)",
      status: "Menunggu HR",
    },
    {
      name: "Hendra Wijaya",
      type: "Klaim Lembur SPKL",
      period: "4 Jam (10 Nov)",
      status: "Menunggu Lead",
    },
    {
      name: "Dinda Kirana",
      type: "Cuti Sakit",
      period: "1 Hari + Surat Dokter",
      status: "Menunggu HR",
    },
  ];

  return (
    <AuthenticatedLayout
      title="Dasbor"
      subtitle="Ringkasan operasional SDM, kehadiran real-time dan status kepegawaian"
      actions={
        <Button asChild className="rounded-xl">
          <Link href="/employees">
            <Users className="size-4" />
            <span className="hidden sm:inline">Data Karyawan</span>
          </Link>
        </Button>
      }
    >
      <Head title="Dasbor" />

      <div className="space-y-4">
        {/* 1. TOP METRICS CARDS */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                "p-3 flex flex-col justify-between rounded-2xl sm:rounded-3xl sm:p-4 " +
                (i === 0 || i === 3 ? "col-span-2 md:col-span-1 " : "") +
                (i === 0
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary"
                  : "bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className={i === 0 ? "text-white" : "text-foreground"}>
                  <s.icon className="size-5 sm:size-6" />
                </span>
                <span
                  className={
                    "flex items-center gap-1 text-[12px] font-bold " +
                    (i === 0
                      ? "text-white"
                      : s.up
                      ? "text-success"
                      : "text-destructive")
                  }
                >
                  {s.up ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
                  {s.delta}
                </span>
              </div>
              <div className="mt-4">
                <p
                  className={
                    "text-xl font-black tracking-tight sm:text-2xl " +
                    (i === 0 ? "text-white" : "text-foreground")
                  }
                >
                  {s.value}
                </p>
                <p
                  className={
                    "text-[13px] font-medium mt-0.5 " +
                    (i === 0
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground")
                  }
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. CHARTS SECTION */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Main Chart */}
          <div className="card-soft p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">
                  Tren Kehadiran Staf Mingguan
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Diperbarui otomatis setiap presensi GPS & selfie
                </p>
              </div>
              <Tabs
                value={chartPeriod}
                onValueChange={setChartPeriod}
                className="relative"
              >
                <TabsList className="rounded-xl">
                  <TabsTrigger value="hari" className="text-xs">
                    Hari
                  </TabsTrigger>
                  <TabsTrigger value="minggu" className="text-xs">
                    Minggu
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hadir"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#fillAttendance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="card-soft p-4">
            <p className="text-sm font-extrabold">Distribusi Staf per Divisi</p>
            <p className="text-[11px] text-muted-foreground">
              Persentase total karyawan aktif
            </p>
            <div className="mt-2 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employeeShare}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {employeeShare.map((_, i) => (
                      <Cell
                        key={i}
                        fill={chartColors[i % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{ borderRadius: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {employeeShare.map((c, i) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: chartColors[i % 4] }}
                    />
                    {c.name}
                  </span>
                  <span className="font-bold text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. RECENT ACTIVITY LISTS */}
        <div className="grid gap-4 xl:grid-cols-2">
          {/* Presensi Hari Ini */}
          <div className="card-soft p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-extrabold">Presensi Masuk Hari Ini</p>
                <p className="text-[11px] text-muted-foreground">
                  Verifikasi GPS kantor & kamera selfie
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full text-[10px]">
                Realtime
              </Badge>
            </div>
            <div className="space-y-2">
              {recentAttendances.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.dept} · {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono text-muted-foreground">
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
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="card-soft p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-extrabold">Menunggu Persetujuan</p>
                <p className="text-[11px] text-muted-foreground">
                  Permohonan izin, cuti, dan klaim lembur
                </p>
              </div>
              <Badge variant="destructive" className="rounded-full text-[10px]">
                3 Pending
              </Badge>
            </div>
            <div className="space-y-2">
              {pendingApprovals.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.type} · {item.period}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
