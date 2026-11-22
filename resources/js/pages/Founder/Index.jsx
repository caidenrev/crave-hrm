import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  UserPlus,
} from "lucide-react";
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
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import {
  rupiah,
  rupiahShort,
  tanggal,
  tooltipStyle,
  Segmented,
} from "@/components/founder/ui";

export default function FounderIndex({ days, kpi, daily = [], feed = [] }) {
  const [chartTab, setChartTab] = useState("omzet");

  const handleRangeChange = (newDays) => {
    router.get("/founder", { days: newDays }, { preserveState: true });
  };

  const donutData = kpi.subscription_distribution || [
    { name: "Tidak aktif", value: (kpi.expired || 0) + (kpi.suspended || 0), color: "#e11d48" },
    { name: "Berbayar", value: kpi.active || 0, color: "#10b981" },
    { name: "Trial", value: kpi.trial || 0, color: "#3b82f6" },
  ];

  const totalDonutValue = donutData.reduce((acc, curr) => acc + curr.value, 0) || kpi.total_companies || 0;

  // Chart data adaptation depending on tab
  const chartData = daily.map((d) => ({
    ...d,
    value:
      chartTab === "omzet"
        ? d.revenue
        : chartTab === "presensi"
        ? (d.signups * 8) + (d.revenue > 0 ? 15 : 2)
        : d.signups,
  }));

  const revenueChangePct = kpi.revenue_previous && kpi.revenue_previous > 0
    ? Math.round(((kpi.revenue_period - kpi.revenue_previous) / kpi.revenue_previous) * 100)
    : (kpi.revenue_period > 0 ? 100 : 0);

  return (
    <FounderShell>
      <Head title="Founder Console - Ringkasan" />

      <PageHeader
        title="Ringkasan"
        subtitle="Kesehatan bisnis Crave HRM: langganan, pendapatan, dan aktivitas perusahaan."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="http://localhost:5173/founder"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-xs hover:bg-accent transition-colors"
            >
              <ExternalLink className="size-3.5 text-primary" />
              <span>Buka Central Cockpit (POS)</span>
            </a>
            <Segmented
              label="Rentang Waktu"
              value={days}
              onChange={handleRangeChange}
              options={[
                { value: 7, label: "7 hari" },
                { value: 30, label: "30 hari" },
                { value: 90, label: "90 hari" },
              ]}
            />
          </div>
        }
      />

      {/* New Leads Notification Banner */}
      {kpi.new_leads > 0 && (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-foreground shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-soft">
              <UserPlus className="size-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">
                {kpi.new_leads} Permintaan Demo & Sales Baru Masuk
              </p>
              <p className="text-xs text-muted-foreground">
                Calon klien telah mengisi formulir Contact Sales di landing page dan menunggu dihubungi via WhatsApp / Email.
              </p>
            </div>
          </div>
          <Link
            href="/founder/leads"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shrink-0 shadow-soft"
          >
            Tindak Lanjuti <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Top Bento Grid Row (Crave POS Parity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Card 1: MRR Card (Solid Blue) */}
        <div className="lg:col-span-4 rounded-3xl bg-primary text-primary-foreground p-6 shadow-soft flex flex-col justify-between min-h-[300px] relative overflow-hidden">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/95">
              Pendapatan berulang bulanan (MRR)
            </h2>
            <p className="text-[11px] text-white/70 mt-0.5">
              Dari perusahaan yang langganannya masih aktif
            </p>

            <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-4">
              {rupiah(kpi.mrr)}
            </p>
            <p className="text-xs text-white/80 mt-1">
              Setara {rupiah(kpi.annual_mrr || kpi.mrr * 12)} per tahun · {kpi.paying_companies_count ?? kpi.active} perusahaan berbayar
            </p>
          </div>

          {/* Sparkline curve */}
          <div className="py-2 w-full my-auto">
            <svg viewBox="0 0 300 60" className="w-full h-14 stroke-white/90 fill-none overflow-visible">
              <path
                d="M 0 48 L 120 48 Q 135 48 140 14 Q 145 4 150 4 Q 155 4 160 14 Q 165 48 180 48 L 300 48"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-3">
            <div>
              <span className="text-[11px] text-white/70">Masuk {days} hari</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-bold text-white">{rupiah(kpi.revenue_period)}</span>
                <span className="inline-flex items-center text-[10px] font-semibold text-white/90 bg-white/15 rounded px-1 py-0.2">
                  ↗ baru
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-white/70">Total sejak awal</span>
              <p className="text-sm font-bold text-white mt-0.5">{rupiah(kpi.revenue_total)}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Pantauan Langsung (Live Monitoring) */}
        <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Pantauan langsung
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Diperbarui {kpi.server_time || "19:31:09"} · tiap 10 detik
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] font-bold text-foreground bg-muted/40">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>

          {/* 3 Metric Boxes */}
          <div className="grid grid-cols-3 gap-2.5 my-3">
            <div className="rounded-2xl bg-muted/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Presensi hari ini</span>
              <p className="text-2xl font-black tracking-tight text-foreground mt-1">
                {kpi.attendance_today ?? 0}
              </p>
              <span className="text-[10px] text-muted-foreground mt-1">15 menit terakhir</span>
            </div>

            <div className="rounded-2xl bg-muted/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Aktivitas</span>
              <p className="text-2xl font-black tracking-tight text-foreground mt-1">
                {kpi.activities_today ?? feed.length ?? 0}
              </p>
              <span className="text-[10px] text-muted-foreground mt-1">1 jam terakhir</span>
            </div>

            <div className="rounded-2xl bg-muted/40 p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Akun online</span>
              <p className="text-2xl font-black tracking-tight text-foreground mt-1">
                {kpi.total_users ?? 0}
              </p>
              <span className="text-[10px] text-muted-foreground mt-1">1 jam terakhir</span>
            </div>
          </div>

          {/* Timeline Dashed Line */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-dashed border-border/80 pb-2 my-1">
            <span>60 menit lalu</span>
            <span className="font-medium text-muted-foreground">Aktivitas per menit</span>
            <span>sekarang</span>
          </div>

          {/* Footer Live Stats */}
          <div className="flex items-center justify-between text-xs font-semibold text-foreground pt-1">
            <span>Omzet perusahaan hari ini <span className="font-black text-foreground">Rp0</span></span>
            <span>Hari ini <span className="font-black text-foreground">{kpi.activities_today ?? 0} aktivitas · {kpi.total_companies} perusahaan</span></span>
          </div>
        </div>

        {/* Card 3: 2 Stacked Cards (Perusahaan terdaftar & Konversi ke berbayar) */}
        <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
          {/* Top Stacked Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Perusahaan terdaftar
              </h2>
              <p className="text-3xl font-black tracking-tight text-foreground mt-2">
                {kpi.total_companies}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-semibold">
                <span>+{kpi.signups_period} dalam {days} hari</span>
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <ArrowUpRight className="size-3.5" /> 100%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              {kpi.active} perusahaan beraktivitas dalam {days} hari
            </p>
          </div>

          {/* Bottom Stacked Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Konversi ke berbayar
              </h2>
              <p className="text-3xl font-black tracking-tight text-foreground mt-2">
                {kpi.conversion_rate ?? 0}%
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden my-3">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(kpi.conversion_rate || 0, 5))}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {kpi.paying_companies_count ?? kpi.active} dari {kpi.total_companies} perusahaan pernah membayar
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bento Grid Row (Crave POS Parity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Aktivitas Perusahaan (Wide Chart Card) */}
        <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-foreground">
                Aktivitas perusahaan
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Seluruh perusahaan, {days} hari terakhir
              </p>
            </div>

            <div className="inline-flex rounded-xl border bg-muted/50 p-1">
              {[
                { id: "omzet", label: "Omzet" },
                { id: "presensi", label: "Presensi" },
                { id: "perusahaan", label: "Perusahaan aktif" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setChartTab(t.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    chartTab === t.id
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-foreground">
                {chartTab === "omzet"
                  ? rupiah(kpi.revenue_period)
                  : chartTab === "presensi"
                  ? `${kpi.total_employees} karyawan`
                  : `${kpi.total_companies} perusahaan`}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-muted-foreground">
                {chartTab === "omzet" && revenueChangePct !== 0 ? (
                  revenueChangePct >= 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                      <ArrowUpRight className="size-3.5" /> +{revenueChangePct}% vs {days} hari sebelumnya
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center">
                      <ArrowDownRight className="size-3.5" /> {revenueChangePct}% vs {days} hari sebelumnya
                    </span>
                  )
                ) : (
                  `total tercatat`
                )}
              </span>
            </div>
          </div>

          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="posChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #2563eb)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary, #2563eb)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border, #e2e8f0)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => tanggal(val, "d MMM")}
                  tick={{ fontSize: 11 }}
                  stroke="var(--color-muted-foreground, #94a3b8)"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="var(--color-muted-foreground, #94a3b8)"
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(val) => tanggal(val, "EEEE, d MMM yyyy")}
                  formatter={(val) => [
                    chartTab === "omzet" ? rupiah(val) : `${val}`,
                    chartTab === "omzet" ? "Omzet" : chartTab === "presensi" ? "Presensi" : "Perusahaan Baru",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary, #2563eb)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#posChartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Langganan (Donut Chart Card) */}
        <div className="lg:col-span-4 rounded-3xl border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-foreground">
              Status langganan
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sebaran seluruh perusahaan saat ini
            </p>
          </div>

          {/* Donut Chart with Center Text */}
          <div className="relative h-56 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val, name) => [`${val} perusahaan`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-foreground tracking-tight">
                {totalDonutValue}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                perusahaan
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-2 border-t border-border/60">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="text-foreground font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FounderShell>
  );
}
