import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatTanggal } from "@/lib/formatters";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CalendarDays,
  Sparkles,
  Info,
  Clock,
  Building,
  Flag,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const TYPE_CONFIG = {
  national: {
    label: "Libur Nasional",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    icon: Flag,
  },
  collective_leave: {
    label: "Cuti Bersama",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: Coffee,
  },
  company_holiday: {
    label: "Libur Perusahaan",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    icon: Building,
  },
};

export default function HolidayCalendar({ holidays = [], selectedYear = 2026, stats = {} }) {
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleDelete = (id) => {
    if (confirm("Hapus jadwal hari libur ini?")) {
      router.delete(`/calendar/${id}`, { preserveScroll: true });
    }
  };

  // Group holidays by month (0 = Jan, 11 = Dec)
  const groupedByMonth = {};
  for (let m = 0; m < 12; m++) {
    groupedByMonth[m] = [];
  }

  holidays.forEach((item) => {
    const d = new Date(item.date);
    if (!isNaN(d.getTime())) {
      const monthIdx = d.getMonth();
      if (groupedByMonth[monthIdx]) {
        groupedByMonth[monthIdx].push(item);
      }
    }
  });

  // Calculate upcoming holidays
  const today = new Date().toISOString().split("T")[0];
  const upcomingHolidays = holidays
    .filter((h) => h.date >= today)
    .slice(0, 3);

  return (
    <AuthenticatedLayout
      title="Kalender & Hari Libur"
      subtitle="Jadwal hari libur nasional resmi SKB 3 Menteri dan cuti bersama operasional perusahaan"
      actions={
        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm text-xs sm:text-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Tambah Libur Khusus</span>
          <span className="sm:hidden">Tambah Libur</span>
        </Button>
      }
    >
      <Head title={`Kalender Hari Libur ${selectedYear}`} />

      {/* 1. TOP METRICS CARDS (Dashboard-Consistent Signature Look) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 mb-6">
        {/* Card 0: Hero Card */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary">
          <div className="flex items-start justify-between gap-2">
            <span className="text-white">
              <CalendarIcon className="size-5 sm:size-6" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-white">
              <ArrowUpRight className="size-4" />
              Tahun {selectedYear}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-white">
              {stats.total ?? holidays.length}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-primary-foreground/80">
              Total Hari Libur Resmi
            </p>
          </div>
        </div>

        {/* Card 1: Libur Nasional */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Flag className="size-5 sm:size-6 text-rose-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-rose-600">
              <ArrowUpRight className="size-4" />
              SKB 3 Menteri
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.national ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Libur Nasional Resmi
            </p>
          </div>
        </div>

        {/* Card 2: Cuti Bersama SKB */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Coffee className="size-5 sm:size-6 text-amber-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-amber-600">
              <ArrowUpRight className="size-4" />
              Pemerintah
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.collective ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Cuti Bersama SKB
            </p>
          </div>
        </div>

        {/* Card 3: Libur Khusus Perusahaan */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Building className="size-5 sm:size-6 text-indigo-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-indigo-600">
              <ArrowUpRight className="size-4" />
              Internal
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.company ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Libur Khusus Internal
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Toolbar: Year Selector & Legend */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-card p-3 rounded-2xl border border-border/60 shadow-xs text-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-foreground">Tahun Kalender:</span>
          <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
            {[2025, 2026, 2027].map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-card text-foreground font-bold shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Libur Nasional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Cuti Bersama</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>Khusus Internal</span>
          </div>
        </div>
      </div>

      {/* Upcoming Holidays Spotlight */}
      {upcomingHolidays.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Hari Libur Terdekat Berikutnya</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingHolidays.map((item) => {
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.national;
              const Icon = cfg.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm flex items-center gap-3.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-muted/60 border border-border/60 text-center shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {new Date(item.date).toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                    <span className="text-base font-black text-foreground leading-tight">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                      <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 12 Months Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MONTH_NAMES.map((monthName, idx) => {
          const monthHolidays = groupedByMonth[idx] || [];
          const hasHolidays = monthHolidays.length > 0;

          return (
            <Card
              key={monthName}
              className={`rounded-2xl border transition-all ${
                hasHolidays
                  ? "border-border/80 bg-card shadow-sm"
                  : "border-border/40 bg-card/50 opacity-75"
              }`}
            >
              <CardHeader className="p-4 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>{monthName}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {selectedYear}
                  </span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold rounded-full ${
                    hasHolidays
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "text-muted-foreground"
                  }`}
                >
                  {monthHolidays.length} libur
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-2.5">
                {!hasHolidays ? (
                  <p className="text-xs text-muted-foreground/70 italic py-2 text-center">
                    Tidak ada hari libur di bulan ini
                  </p>
                ) : (
                  monthHolidays.map((holiday) => {
                    const cfg = TYPE_CONFIG[holiday.type] || TYPE_CONFIG.national;
                    const dateObj = new Date(holiday.date);
                    const dayNum = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString("id-ID", { weekday: "short" });
                    const isCompanyHoliday = holiday.company_id !== null;

                    return (
                      <div
                        key={holiday.id}
                        className="group flex items-start gap-3 p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-card border border-border/70 text-center shrink-0 shadow-2xs">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
                            {dayName}
                          </span>
                          <span className="text-sm font-black text-foreground leading-tight mt-0.5">
                            {dayNum}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground leading-snug">
                            {holiday.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${cfg.badge}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          {holiday.description && (
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                              {holiday.description}
                            </p>
                          )}
                        </div>

                        {isCompanyHoliday && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(holiday.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            title="Hapus jadwal libur perusahaan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Dialog Tambah Libur Khusus Perusahaan */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              Tambah Hari Libur Khusus
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tambahkan hari libur internal, peringatan hari jadi perusahaan, atau cuti massal khusus tim Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateHoliday} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Nama Hari Libur / Agenda <span className="text-rose-500">*</span>
              </label>
              <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Contoh: HUT Perusahaan / Family Gathering Day"
                className="rounded-xl"
                required
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Tanggal Libur <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => setData("date", e.target.value)}
                  className="rounded-xl"
                  required
                />
                {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
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
                placeholder="Catatan opsional mengenai ketentuan operasional..."
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
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {processing ? "Menyimpan..." : "Simpan Hari Libur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
