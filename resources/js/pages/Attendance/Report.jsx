import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Area,
  AreaChart,
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
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Search,
  Filter,
  Eye,
  Edit3,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DONUT_COLORS = ["#1B5CFE", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export default function Report({
  attendances = { data: [], links: [] },
  branches = [],
  shifts = [],
  filters = {},
  stats = {},
  charts = { dailyTrend: [], shiftComposition: [] },
}) {
  const [filterState, setFilterState] = useState({
    date_from: filters.date_from || "",
    date_to: filters.date_to || "",
    branch_id: filters.branch_id || "all",
    shift_id: filters.shift_id || "all",
    status: filters.status || "all",
    search: filters.search || "",
  });

  // Modal State for Selfie Preview
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);
  const [previewAttendance, setPreviewAttendance] = useState(null);

  // Modal State for Manual Correction
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctingAttendance, setCorrectingAttendance] = useState(null);
  const [correctionData, setCorrectionData] = useState({
    status: "present",
    clock_in_time: "",
    clock_out_time: "",
    correction_reason: "",
  });
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    const str = String(dateStr).substring(0, 10);
    const parts = str.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const mIdx = parseInt(m, 10) - 1;
    return `${parseInt(d, 10)} ${monthNames[mIdx] || m} ${y}`;
  };

  const applyFilters = (newFilters) => {
    const updated = { ...filterState, ...newFilters };
    setFilterState(updated);
    router.get("/attendance/recap", updated, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({});
  };

  const openSelfiePreview = (attendance) => {
    setPreviewAttendance(attendance);
    setSelfieModalOpen(true);
  };

  const openCorrection = (attendance) => {
    setCorrectingAttendance(attendance);
    setCorrectionData({
      status: attendance.status || "present",
      clock_in_time: attendance.clock_in_time || "08:00:00",
      clock_out_time: attendance.clock_out_time || "17:00:00",
      correction_reason: attendance.correction_reason || "",
    });
    setCorrectionModalOpen(true);
  };

  const submitCorrection = (e) => {
    e.preventDefault();
    if (!correctingAttendance) return;

    setIsSubmittingCorrection(true);
    router.patch(
      `/attendance/recap/${correctingAttendance.id}/correct`,
      correctionData,
      {
        preserveScroll: true,
        onSuccess: () => {
          setCorrectionModalOpen(false);
          setIsSubmittingCorrection(false);
        },
        onError: () => setIsSubmittingCorrection(false),
      }
    );
  };

  return (
    <AuthenticatedLayout
      title="Rekap Kehadiran"
      subtitle="Dashboard audit log presensi harian karyawan, validasi GPS & IP, serta penyesuaian koreksi absensi."
      actions={
        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold border-primary/30 bg-primary/5 text-primary">
          {stats.total_records || 0} Log Kehadiran
        </Badge>
      }
    >
      <Head title="Rekap Kehadiran — Crave HRM" />

      <div className="space-y-5">
        {/* 4 KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <ClipboardList className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Periode Terpilih
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.total_records || 0}
              </div>
              <div className="text-[12px] text-white/80">Total Log Presensi</div>
            </div>
          </div>

          {/* Card 1: Tepat Waktu */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CheckCircle2 className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                {stats.total_records > 0
                  ? `${Math.round((stats.on_time_count / stats.total_records) * 100)}% Rasio Tepat`
                  : "100% Rasio Tepat"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.on_time_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Tepat Waktu</div>
            </div>
          </div>

          {/* Card 2: Terlambat */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <AlertTriangle className="size-5 sm:size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-bold",
                  (stats.late_count || 0) > 0 ? "text-destructive" : "text-success"
                )}
              >
                {(stats.late_count || 0) > 0 ? (
                  <ArrowDownRight className="size-3.5" />
                ) : (
                  <ArrowUpRight className="size-3.5" />
                )}
                {(stats.late_count || 0) > 0 ? "Perlu perhatian" : "Nihil telat"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.late_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Karyawan Terlambat</div>
            </div>
          </div>

          {/* Card 3: Geofence Valid */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <MapPin className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                Radius Valid
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.geofence_valid_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Sesuai Radius Kantor</div>
            </div>
          </div>
        </div>

        {/* 2:1 Analytics Section: Trend (2fr) + Shift Donut (1fr) */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Trend Kehadiran Harian */}
          <div className="card-soft p-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-foreground">Tren Kehadiran Harian</h3>
                <p className="text-xs text-muted-foreground">Sebaran karyawan tepat waktu vs terlambat</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Tepat Waktu
                </span>
                <span className="flex items-center gap-1 font-medium text-amber-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Terlambat
                </span>
              </div>
            </div>

            <div className="mt-4 h-64 w-full">
              {charts.dailyTrend && charts.dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      charts.dailyTrend.length >= 2
                        ? charts.dailyTrend
                        : [
                            { date: "15 Nov", tepat_waktu: 0, terlambat: 0, total: 0 },
                            { date: "16 Nov", tepat_waktu: 0, terlambat: 0, total: 0 },
                            { date: "17 Nov", tepat_waktu: 0, terlambat: 0, total: 0 },
                            { date: "18 Nov", tepat_waktu: 0, terlambat: 0, total: 0 },
                            charts.dailyTrend[0],
                          ]
                    }
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B5CFE" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1B5CFE" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                    <Tooltip
                      formatter={(val, name) => [
                        `${val} Karyawan`,
                        name === "tepat_waktu" ? "Tepat Waktu" : "Terlambat",
                      ]}
                      labelFormatter={(label) => `Tanggal: ${label}`}
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "10px 14px",
                        backgroundColor: "#FFFFFF",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tepat_waktu"
                      name="tepat_waktu"
                      stroke="#1B5CFE"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorOnTime)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: "#FFFFFF" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="terlambat"
                      name="terlambat"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorLate)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: "#FFFFFF" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Belum cukup data untuk membuat grafik tren kehadiran.
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart: Komposisi Shift */}
          <div className="card-soft p-5">
            <div className="border-b pb-3">
              <h3 className="font-bold text-foreground">Distribusi Shift</h3>
              <p className="text-xs text-muted-foreground">Komposisi kehadiran per shift</p>
            </div>

            <div className="mt-4 flex h-64 flex-col items-center justify-center">
              {charts.shiftComposition && charts.shiftComposition.length > 0 ? (
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={charts.shiftComposition}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {charts.shiftComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-muted-foreground">Belum ada data shift</div>
              )}

              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
                {charts.shiftComposition?.map((entry, i) => (
                  <span key={entry.name} className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    {entry.name}: {entry.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Crave POS Card-Soft) */}
        <div className="card-soft p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama karyawan atau NIK..."
                value={filterState.search}
                onChange={(e) => setFilterState((prev) => ({ ...prev, search: e.target.value }))}
                className="rounded-xl pl-9 text-xs"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <select
                value={filterState.branch_id}
                onChange={(e) => applyFilters({ branch_id: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Cabang Kantor</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Filter */}
            <div>
              <select
                value={filterState.shift_id}
                onChange={(e) => applyFilters({ shift_id: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Master Shift</option>
                {shifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterState.status}
                onChange={(e) => applyFilters({ status: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Status</option>
                <option value="present">Tepat Waktu</option>
                <option value="late">Terlambat</option>
                <option value="early_leave">Pulang Cepat</option>
                <option value="absent">Absen / Mangkir</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="w-full rounded-xl text-xs font-bold">
                Terapkan
              </Button>
            </div>
          </form>
        </div>

        {/* ATTENDANCE RECAP TABLE */}
        <div className="card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                  <TableHead className="font-bold text-foreground py-3.5 pl-4">Karyawan</TableHead>
                  <TableHead className="font-bold text-foreground py-3.5">Cabang &amp; Shift</TableHead>
                  <TableHead className="font-bold text-foreground py-3.5">Tanggal &amp; Waktu</TableHead>
                  <TableHead className="font-bold text-foreground py-3.5">Status Kehadiran</TableHead>
                  <TableHead className="font-bold text-foreground py-3.5">Verifikasi Lokasi</TableHead>
                  <TableHead className="text-center font-bold text-foreground py-3.5">Swafoto</TableHead>
                  <TableHead className="text-right font-bold text-foreground py-3.5 pr-4">Aksi HR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      Tidak ada rekaman presensi pada periode ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.data.map((att) => (
                    <TableRow key={att.id} className="hover:bg-muted/30 transition-colors border-b border-border/40">
                      {/* Stacked Employee Cell (EmployeeAvatar + Name + Department/NIK) */}
                      <TableCell className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <EmployeeAvatar
                            employee={att.employee}
                            className="size-10 rounded-xl shrink-0 border border-border/50 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-foreground text-sm hover:text-primary transition-colors truncate">
                              {att.employee?.nama_lengkap || "Karyawan"}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                              <span className="font-mono font-medium">{att.employee?.nik || "HLD-000"}</span>
                              <span>•</span>
                              <span className="truncate">{att.employee?.department?.name || "-"}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Cabang & Shift */}
                      <TableCell className="py-3">
                        <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{att.branch?.name || "Kantor Pusat"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Clock className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{att.shift?.name || "Shift Reguler"}</span>
                        </div>
                      </TableCell>

                      {/* Tanggal & Waktu In/Out */}
                      <TableCell className="py-3">
                        <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-primary shrink-0" />
                          <span>{formatDisplayDate(att.date)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono">
                          <span>In: <strong className="text-foreground">{att.clock_in_time ? att.clock_in_time.substring(0, 5) : "--:--"}</strong></span>
                          <span>•</span>
                          <span>Out: <strong className="text-foreground">{att.clock_out_time ? att.clock_out_time.substring(0, 5) : "--:--"}</strong></span>
                        </div>
                      </TableCell>

                      {/* Status Kehadiran */}
                      <TableCell className="py-3">
                        <div className="space-y-1">
                          <Badge
                            className={cn(
                              "rounded-full text-[11px] font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 border",
                              att.status === "present"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                : att.status === "late"
                                ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                                : att.status === "early_leave"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                : "bg-muted text-muted-foreground border-border/60"
                            )}
                          >
                            {att.status === "present" ? (
                              <>
                                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Tepat Waktu</span>
                              </>
                            ) : att.status === "late" ? (
                              <>
                                <AlertTriangle className="size-3 text-rose-600 dark:text-rose-400 shrink-0" />
                                <span>Terlambat {att.late_minutes}m</span>
                              </>
                            ) : att.status === "early_leave" ? (
                              <>
                                <Clock className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>Pulang Cepat</span>
                              </>
                            ) : (
                              <span>{att.status || "Absen"}</span>
                            )}
                          </Badge>
                          {att.is_corrected && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                              (Dikoreksi HR)
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Verifikasi Lokasi */}
                      <TableCell className="py-3">
                        <div className="text-xs">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full text-[10px] font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 border",
                              att.geofence_status === "valid_geofence"
                                ? "bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : att.geofence_status === "valid_ip"
                                ? "bg-primary/5 text-primary border-primary/30"
                                : "bg-destructive/5 text-destructive border-destructive/30"
                            )}
                          >
                            {att.geofence_status === "valid_geofence" ? (
                              <>
                                <MapPin className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>GPS Valid ({att.clock_in_distance_meters || 0}m)</span>
                              </>
                            ) : att.geofence_status === "valid_ip" ? (
                              <>
                                <ShieldCheck className="size-3 shrink-0 text-primary" />
                                <span>IP Jaringan Kantor</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="size-3 shrink-0 text-destructive" />
                                <span>Di Luar Radius</span>
                              </>
                            )}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Swafoto */}
                      <TableCell className="py-3 text-center">
                        {att.clock_in_selfie_url || att.clock_out_selfie_url ? (
                          <button
                            type="button"
                            onClick={() => openSelfiePreview(att)}
                            className="relative group size-10 rounded-xl overflow-hidden border border-border/70 shadow-xs hover:ring-2 hover:ring-primary transition-all mx-auto block cursor-pointer"
                            title="Klik untuk melihat bukti swafoto"
                          >
                            <img
                              src={att.clock_in_selfie_url || att.clock_out_selfie_url}
                              alt="Swafoto"
                              className="size-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera className="size-3.5 text-white" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">-</span>
                        )}
                      </TableCell>

                      {/* Aksi HR (Koreksi) */}
                      <TableCell className="py-3 text-right pr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCorrection(att)}
                          className="rounded-xl text-xs font-semibold h-8 gap-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          <Edit3 className="size-3.5" /> Koreksi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* DIALOG: SELFIE PREVIEW */}
        <Dialog open={selfieModalOpen} onOpenChange={setSelfieModalOpen}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Bukti Swafoto Presensi
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2 space-y-4">
              {previewAttendance?.clock_in_selfie_url && (
                <div>
                  <div className="mb-1 text-xs font-bold text-foreground">
                    Swafoto Masuk ({previewAttendance.clock_in_time})
                  </div>
                  <div className="overflow-hidden rounded-xl border">
                    <img
                      src={previewAttendance.clock_in_selfie_url}
                      alt="Selfie In"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {previewAttendance?.clock_out_selfie_url && (
                <div>
                  <div className="mb-1 text-xs font-bold text-foreground">
                    Swafoto Pulang ({previewAttendance.clock_out_time})
                  </div>
                  <div className="overflow-hidden rounded-xl border">
                    <img
                      src={previewAttendance.clock_out_selfie_url}
                      alt="Selfie Out"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={() => setSelfieModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG: MANUAL HR CORRECTION */}
        <Dialog open={correctionModalOpen} onOpenChange={setCorrectionModalOpen}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Koreksi Manual Log Absensi
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={submitCorrection} className="space-y-4 pt-2">
              <div className="rounded-xl bg-muted/40 p-3 text-xs">
                <div className="font-bold text-foreground">
                  {correctingAttendance?.employee?.nama_lengkap}
                </div>
                <div className="text-muted-foreground">
                  Tanggal: {correctingAttendance?.date} • Status Asli: {correctingAttendance?.status}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status Kehadiran Baru *</label>
                <select
                  value={correctionData.status}
                  onChange={(e) => setCorrectionData((prev) => ({ ...prev, status: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs"
                >
                  <option value="present">Tepat Waktu (Hadir)</option>
                  <option value="late">Terlambat</option>
                  <option value="early_leave">Pulang Cepat</option>
                  <option value="absent">Absen / Mangkir</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Jam Masuk</label>
                  <Input
                    type="time"
                    value={correctionData.clock_in_time}
                    onChange={(e) => setCorrectionData((prev) => ({ ...prev, clock_in_time: e.target.value }))}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Jam Pulang</label>
                  <Input
                    type="time"
                    value={correctionData.clock_out_time}
                    onChange={(e) => setCorrectionData((prev) => ({ ...prev, clock_out_time: e.target.value }))}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alasan Koreksi Resmi *</label>
                <Input
                  placeholder="Misal: Kendala GPS / Approval dinas luar..."
                  value={correctionData.correction_reason}
                  onChange={(e) => setCorrectionData((prev) => ({ ...prev, correction_reason: e.target.value }))}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCorrectionModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingCorrection}
                  className="rounded-xl text-xs font-bold"
                >
                  {isSubmittingCorrection ? "Menyimpan..." : "Simpan Koreksi"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
