import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatTanggal } from "@/lib/formatters";
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
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CalendarDays,
  Building,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const TYPE_CONFIG = {
  national: {
    label: "Libur Nasional",
    source: "SKB 3 Menteri",
    variant: "secondary",
  },
  collective_leave: {
    label: "Cuti Bersama",
    source: "Pemerintah RI",
    variant: "secondary",
  },
  company_holiday: {
    label: "Libur Internal",
    source: "Perusahaan",
    variant: "outline",
  },
};

export default function HolidayCalendar({ holidays = [], selectedYear = 2026, stats = {} }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" | "grid"
  const [chartPeriod, setChartPeriod] = useState("all"); // "all" | "s1" | "s2"
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "national" | "collective_leave" | "company_holiday"
  const [searchQuery, setSearchQuery] = useState("");

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    date: `${selectedYear}-01-01`,
    type: "company_holiday",
    description: "",
  });

  const handleYearChange = (year) => {
    router.get("/calendar", { year }, { preserveState: true });
  };

  const handleCreateHoliday = (e) => {
    e.preventDefault();
    post("/calendar", {
      onSuccess: () => {
        setModalOpen(false);
        reset();
      },
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    router.delete(`/calendar/${deleteTarget.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setDeleteLoading(false);
        setDeleteTarget(null);
      },
    });
  };

  // 1. KPI Stats
  const topStats = [
    {
      label: "Total Hari Libur Resmi",
      value: String(stats.total ?? holidays.length),
      delta: `Tahun ${selectedYear}`,
      up: true,
      icon: CalendarIcon,
    },
    {
      label: "Libur Nasional Resmi",
      value: String(stats.national ?? holidays.filter((h) => h.type === "national").length),
      delta: "SKB 3 Menteri",
      up: true,
      icon: Flag,
    },
    {
      label: "Cuti Bersama SKB",
      value: String(stats.collective ?? holidays.filter((h) => h.type === "collective_leave").length),
      delta: "Pemerintah",
      up: true,
      icon: CalendarDays,
    },
    {
      label: "Libur Khusus Internal",
      value: String(stats.company ?? holidays.filter((h) => h.type === "company_holiday").length),
      delta: "Perusahaan",
      up: true,
      icon: Building,
    },
  ];

  // 2. Chart: Monthly Holiday Distribution
  const fullMonthlyData = useMemo(() => {
    return MONTH_SHORT.map((label, idx) => {
      const monthHolidays = holidays.filter((h) => {
        const d = new Date(h.date);
        return !isNaN(d.getTime()) && d.getMonth() === idx;
      });
      return {
        label,
        total: monthHolidays.length,
        national: monthHolidays.filter((h) => h.type === "national").length,
        collective: monthHolidays.filter((h) => h.type === "collective_leave").length,
        company: monthHolidays.filter((h) => h.type === "company_holiday").length,
      };
    });
  }, [holidays]);

  const displayChartData = useMemo(() => {
    if (chartPeriod === "s1") return fullMonthlyData.slice(0, 6);
    if (chartPeriod === "s2") return fullMonthlyData.slice(6, 12);
    return fullMonthlyData;
  }, [fullMonthlyData, chartPeriod]);

  // 3. Chart: Category Composition (Pie)
  const categoryShare = useMemo(() => {
    const total = holidays.length || 1;
    const n = stats.national ?? holidays.filter((h) => h.type === "national").length;
    const c = stats.collective ?? holidays.filter((h) => h.type === "collective_leave").length;
    const comp = stats.company ?? holidays.filter((h) => h.type === "company_holiday").length;

    return [
      {
        name: "Libur Nasional",
        count: n,
        value: Math.round((n / total) * 100),
      },
      {
        name: "Cuti Bersama",
        count: c,
        value: Math.round((c / total) * 100),
      },
      {
        name: "Libur Internal",
        count: comp,
        value: Math.round((comp / total) * 100),
      },
    ].filter((item) => item.count > 0);
  }, [holidays, stats]);

  // 4. Upcoming Holidays (Sorted by closest date to today)
  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return holidays
      .map((h) => {
        const d = new Date(h.date);
        d.setHours(0, 0, 0, 0);
        const diffTime = d.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...h, diffDays };
      })
      .filter((h) => h.diffDays >= 0)
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 5);
  }, [holidays]);

  // 5. Filtered Full Agenda
  const filteredHolidays = useMemo(() => {
    return holidays.filter((item) => {
      const matchCat = categoryFilter === "all" || item.type === categoryFilter;
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [holidays, categoryFilter, searchQuery]);

  // Group holidays by month for 12-month Grid View
  const groupedByMonth = useMemo(() => {
    const grouped = {};
    for (let m = 0; m < 12; m++) grouped[m] = [];
    holidays.forEach((item) => {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        const m = d.getMonth();
        if (grouped[m]) grouped[m].push(item);
      }
    });
    return grouped;
  }, [holidays]);

  const getCountdownBadge = (diffDays) => {
    if (diffDays === 0) return "Hari Ini";
    if (diffDays === 1) return "Besok";
    return `${diffDays} Hari Lagi`;
  };

  return (
    <AuthenticatedLayout
      title="Kalender & Hari Libur"
      subtitle="Jadwal hari libur nasional resmi SKB 3 Menteri dan cuti bersama operasional perusahaan"
      actions={
        <div className="flex items-center gap-2">
          {/* Year Switcher */}
          <div className="inline-flex items-center rounded-xl bg-muted p-1 border border-border/50 text-xs">
            {[2025, 2026, 2027].map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-card text-foreground font-bold shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="rounded-xl font-semibold shadow-xs text-xs sm:text-sm"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Tambah Libur Khusus</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      }
    >
      <Head title={`Kalender Hari Libur ${selectedYear}`} />

      <div className="space-y-4">
        {/* 1. TOP METRICS CARDS (Exact Crave POS / Dashboard Style) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {topStats.map((s, i) => (
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
                    (i === 0 ? "text-white" : "text-success")
                  }
                >
                  <ArrowUpRight className="size-4" />
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

        {/* View Mode Bar */}
        <div className="flex items-center justify-between gap-3">
          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className="relative"
          >
            <TabsList className="rounded-xl">
              <TabsTrigger value="dashboard" className="text-xs gap-1.5">
                <LayoutList className="size-3.5" />
                Widget Dasbor
              </TabsTrigger>
              <TabsTrigger value="grid" className="text-xs gap-1.5">
                <LayoutGrid className="size-3.5" />
                Grid 12 Bulan
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-muted-foreground hidden sm:inline">
            Tahun Kerja: <strong className="text-foreground">{selectedYear}</strong> · Total {holidays.length} Hari Libur
          </span>
        </div>

        {viewMode === "dashboard" ? (
          <>
            {/* 2. CHARTS SECTION (Exact Crave POS Dashboard 2:1 Ratio) */}
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              {/* Main Chart: Distribusi Bulanan */}
              <div className="card-soft p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      Sebaran Hari Libur per Bulan
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Total hari libur & cuti bersama tahun {selectedYear}
                    </p>
                  </div>
                  <Tabs
                    value={chartPeriod}
                    onValueChange={setChartPeriod}
                    className="relative"
                  >
                    <TabsList className="rounded-xl">
                      <TabsTrigger value="all" className="text-xs">
                        Semua
                      </TabsTrigger>
                      <TabsTrigger value="s1" className="text-xs">
                        Sem. 1
                      </TabsTrigger>
                      <TabsTrigger value="s2" className="text-xs">
                        Sem. 2
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayChartData}>
                      <defs>
                        <linearGradient id="fillHolidays" x1="0" y1="0" x2="0" y2="1">
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
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        width={28}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--color-border)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Hari Libur"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2.5}
                        fill="url(#fillHolidays)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Chart: Komposisi Hari Libur */}
              <div className="card-soft p-4">
                <p className="text-sm font-extrabold">Komposisi Hari Libur</p>
                <p className="text-[11px] text-muted-foreground">
                  Persentase berdasarkan kategori resmi
                </p>
                <div className="mt-2 h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryShare}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {categoryShare.map((_, i) => (
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
                  {categoryShare.map((c, i) => (
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
                      <span className="font-bold text-foreground">
                        {c.value}% ({c.count} hari)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. RECENT ACTIVITY & SCHEDULE SECTION (Exact Crave POS Dashboard 2-Column Grid) */}
            <div className="grid gap-4 xl:grid-cols-2">
              {/* Left Column: Hari Libur Terdekat Berikutnya */}
              <div className="card-soft p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-extrabold">Hari Libur Terdekat Berikutnya</p>
                    <p className="text-[11px] text-muted-foreground">
                      Agenda libur nasional dan cuti operasional terdekat
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    Mendatang
                  </Badge>
                </div>

                <div className="space-y-2">
                  {upcomingHolidays.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      Tidak ada jadwal hari libur mendatang yang tersisa di tahun {selectedYear}.
                    </div>
                  ) : (
                    upcomingHolidays.map((item) => {
                      const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.national;
                      const dateObj = new Date(item.date);
                      const dayNum = dateObj.getDate();
                      const monthName = dateObj.toLocaleDateString("id-ID", { month: "short" });

                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex flex-col items-center justify-center size-10 rounded-xl bg-card border border-border/70 text-center shrink-0 shadow-2xs">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
                                {monthName}
                              </span>
                              <span className="text-sm font-black text-foreground leading-tight mt-0.5">
                                {dayNum}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-foreground">
                                {item.name}
                              </p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {formatTanggal(item.date)} · {cfg.label}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full text-[10px]"
                            >
                              {getCountdownBadge(item.diffDays)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Daftar Lengkap Agenda Hari Libur */}
              <div className="card-soft p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-extrabold">Agenda Lengkap Hari Libur</p>
                    <p className="text-[11px] text-muted-foreground">
                      Daftar seluruh agenda hari libur tahun {selectedYear}
                    </p>
                  </div>
                  <Tabs
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    className="relative"
                  >
                    <TabsList className="rounded-xl h-8">
                      <TabsTrigger value="all" className="text-[11px] px-2.5">
                        Semua
                      </TabsTrigger>
                      <TabsTrigger value="national" className="text-[11px] px-2.5">
                        Nasional
                      </TabsTrigger>
                      <TabsTrigger value="collective_leave" className="text-[11px] px-2.5">
                        Cuti Bersama
                      </TabsTrigger>
                      <TabsTrigger value="company_holiday" className="text-[11px] px-2.5">
                        Internal
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Filter Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama hari libur atau keterangan..."
                    className="pl-9 h-8 text-xs rounded-xl"
                  />
                </div>

                <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                  {filteredHolidays.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      Tidak ada jadwal libur yang sesuai dengan pencarian.
                    </div>
                  ) : (
                    filteredHolidays.map((item) => {
                      const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.national;
                      const dateObj = new Date(item.date);
                      const dayNum = dateObj.getDate();
                      const monthName = dateObj.toLocaleDateString("id-ID", { month: "short" });
                      const isCompany = item.company_id !== null;

                      return (
                        <div
                          key={item.id}
                          className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3 hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex flex-col items-center justify-center size-10 rounded-xl bg-card border border-border/70 text-center shrink-0 shadow-2xs">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
                                {monthName}
                              </span>
                              <span className="text-sm font-black text-foreground leading-tight mt-0.5">
                                {dayNum}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-foreground">
                                {item.name}
                              </p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {formatTanggal(item.date)}
                                {item.description && ` · ${item.description}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={cfg.variant}
                              className="rounded-full text-[10px]"
                            >
                              {cfg.label}
                            </Badge>

                            {isCompany && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTarget(item)}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                                title="Hapus jadwal libur perusahaan"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 4. GRID 12 BULAN (Refined Crave POS Clean Style) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTH_NAMES.map((monthName, idx) => {
              const monthHolidays = groupedByMonth[idx] || [];
              const hasHolidays = monthHolidays.length > 0;

              return (
                <div
                  key={monthName}
                  className="card-soft p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <p className="text-sm font-extrabold text-foreground">
                      {monthName} <span className="text-xs text-muted-foreground font-normal">{selectedYear}</span>
                    </p>
                    <Badge
                      variant="secondary"
                      className="rounded-full text-[10px]"
                    >
                      {monthHolidays.length} libur
                    </Badge>
                  </div>

                  <div className="space-y-2 mt-3 flex-1">
                    {!hasHolidays ? (
                      <p className="text-xs text-muted-foreground/70 italic py-6 text-center">
                        Tidak ada hari libur resmi di bulan ini
                      </p>
                    ) : (
                      monthHolidays.map((holiday) => {
                        const cfg = TYPE_CONFIG[holiday.type] || TYPE_CONFIG.national;
                        const dateObj = new Date(holiday.date);
                        const dayNum = dateObj.getDate();
                        const dayName = dateObj.toLocaleDateString("id-ID", { weekday: "short" });
                        const isCompany = holiday.company_id !== null;

                        return (
                          <div
                            key={holiday.id}
                            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl bg-muted/50 p-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex flex-col items-center justify-center size-9 rounded-lg bg-card border border-border/70 text-center shrink-0 shadow-2xs">
                                <span className="text-[8px] font-bold text-muted-foreground uppercase leading-none">
                                  {dayName}
                                </span>
                                <span className="text-xs font-black text-foreground leading-tight mt-0.5">
                                  {dayNum}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-foreground">
                                  {holiday.name}
                                </p>
                                <p className="truncate text-[10px] text-muted-foreground">
                                  {cfg.label}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isCompany && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteTarget(holiday)}
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-lg opacity-60 group-hover:opacity-100 transition-opacity"
                                  title="Hapus"
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Dialog: Tambah Libur Khusus Perusahaan */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              Tambah Hari Libur Khusus
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tambahkan hari libur internal, peringatan hari jadi perusahaan, atau cuti bersama khusus tim Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateHoliday} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Nama Hari Libur / Agenda <span className="text-destructive">*</span>
              </label>
              <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Contoh: HUT Perusahaan / Family Gathering Day"
                className="rounded-xl"
                required
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Tanggal Libur <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => setData("date", e.target.value)}
                  className="rounded-xl"
                  required
                />
                {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Kategori
                </label>
                <select
                  value={data.type}
                  onChange={(e) => setData("type", e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="company_holiday">Libur Perusahaan</option>
                  <option value="collective_leave">Cuti Bersama Tambahan</option>
                  <option value="national">Libur Nasional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Keterangan / Catatan
              </label>
              <Input
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Catatan opsional mengenai operasional kerja..."
                className="rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl font-semibold"
              >
                {processing ? "Menyimpan..." : "Simpan Hari Libur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Hari Libur Khusus"
        description={`Apakah Anda yakin ingin menghapus jadwal "${deleteTarget?.name}" dari kalender kerja perusahaan? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Jadwal"
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </AuthenticatedLayout>
  );
}
