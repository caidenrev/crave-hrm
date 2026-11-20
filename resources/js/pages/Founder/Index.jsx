import { Head, Link, router } from "@inertiajs/react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import {
  Tile,
  TileTitle,
  Delta,
  StateBadge,
  angka,
  rupiah,
  rupiahShort,
  tanggal,
  tooltipStyle,
  Segmented,
} from "@/components/founder/ui";
import { Button } from "@/components/ui/button";

export default function FounderIndex({ days, kpi, daily, expiring, feed }) {
  const handleRangeChange = (newDays) => {
    router.get("/founder", { days: newDays }, { preserveState: true });
  };

  return (
    <FounderShell>
      <Head title="Founder Console - Ringkasan SaaS" />

      <PageHeader
        title="Ringkasan SaaS Crave HRM"
        subtitle="Pantau pertumbuhan perusahaan tenant, status langganan, dan arus pendapatan."
        actions={
          <div className="flex items-center gap-2">
            <Segmented
              label="Rentang Waktu"
              value={days}
              onChange={handleRangeChange}
              options={[
                { value: 7, label: "7 Hari" },
                { value: 30, label: "30 Hari" },
                { value: 90, label: "90 Hari" },
              ]}
            />
          </div>
        }
      />

      {/* New Leads Notification Banner */}
      {kpi.new_leads > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-amber-950 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <UserPlus className="size-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold">
                {kpi.new_leads} Permintaan Demo & Sales Baru Masuk!
              </p>
              <p className="text-xs text-amber-800">
                Calon klien telah mengisi formulir Contact Sales di landing page dan menunggu dihubungi via WhatsApp / Email.
              </p>
            </div>
          </div>
          <Link
            href="/founder/leads"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            Tindak Lanjuti <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Primary Hero Bento KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* MRR Card (Royal Electric Indigo Tone) */}
        <Tile tone="primary" className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
              Estimasi MRR
            </span>
            <TrendingUp className="size-4 text-primary-foreground/80" />
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight">{rupiahShort(kpi.mrr)}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-primary-foreground/90">
            <span>Omzet {days} Hari:</span>
            <span className="font-extrabold">{rupiahShort(kpi.revenue_period)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-primary-foreground/75">
            <span>Total Pendapatan:</span>
            <span className="font-bold">{rupiahShort(kpi.revenue_total)}</span>
          </div>
        </Tile>

        {/* Total Perusahaan */}
        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Perusahaan Aktif & Tenant
            </span>
            <Building2 className="size-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight">{kpi.total_companies}</p>
            <span className="text-xs text-muted-foreground">perusahaan</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <span className="size-2 rounded-full bg-emerald-500" />
              {kpi.active} Aktif
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-blue-600">
              <span className="size-2 rounded-full bg-blue-500" />
              {kpi.trial} Trial
            </span>
            {kpi.suspended > 0 && (
              <span className="inline-flex items-center gap-1 font-bold text-red-500">
                <span className="size-2 rounded-full bg-red-500" />
                {kpi.suspended} Suspend
              </span>
            )}
          </div>
        </Tile>

        {/* Total Karyawan & User */}
        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tenaga Kerja Terkelola
            </span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight">{angka(kpi.total_employees)}</p>
            <span className="text-xs text-muted-foreground">karyawan aktif</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Akun Login HR:</span>
            <span className="font-extrabold text-foreground">{angka(kpi.total_users)} user</span>
          </div>
        </Tile>

        {/* Signups Baru */}
        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pendaftaran Baru
            </span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight">+{kpi.signups_period}</p>
            <span className="text-xs text-muted-foreground">dalam {days} hari</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Konversi Berbayar:</span>
            <span className="font-extrabold text-foreground">
              {kpi.total_companies > 0 ? Math.round((kpi.active / kpi.total_companies) * 100) : 0}%
            </span>
          </div>
        </Tile>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        {/* Daily Signups & Revenue Trends */}
        <Tile className="lg:col-span-2">
          <TileTitle
            title="Tren Pendaftaran & Arus Kas Langganan"
            hint={`Grafik pertumbuhan pendaftaran perusahaan baru dan pembayaran langganan ${days} hari terakhir.`}
          />
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.0} />
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
                  formatter={(val, name) => [
                    name === "signups" ? `${val} Perusahaan` : rupiah(val),
                    name === "signups" ? "Pendaftaran Baru" : "Pendapatan",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  name="signups"
                  stroke="var(--color-primary, #2563eb)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#signupGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Tile>

        {/* Live Activity Feed */}
        <Tile>
          <TileTitle title="Aktivitas SaaS Langsung" hint="Pendaftaran dan pembayaran terbaru." />
          <div className="mt-3 flex-1 overflow-y-auto space-y-3 max-h-72 pr-1">
            {feed.length === 0 ? (
              <p className="text-center py-10 text-xs text-muted-foreground">Belum ada aktivitas.</p>
            ) : (
              feed.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-muted/40 p-2.5">
                  <div
                    className={`size-7 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === "payment"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : item.type === "lead"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    }`}
                  >
                    {item.type === "payment" ? (
                      <CreditCard className="size-3.5" />
                    ) : item.type === "lead" ? (
                      <UserPlus className="size-3.5" />
                    ) : (
                      <Building2 className="size-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground">{item.who}</p>
                    <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                    {item.amount && (
                      <p className="text-[11px] font-extrabold text-emerald-600">{rupiah(item.amount)}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {tanggal(item.at, "HH:mm")}
                  </span>
                </div>
              ))
            )}
          </div>
        </Tile>
      </div>

      {/* Expiring Companies Alert Section */}
      <Tile className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4.5 text-amber-500" />
              <h2 className="text-base font-extrabold tracking-tight">
                Perusahaan Berakhir Dalam 7 Hari ({expiring.length})
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hubungi admin HR atau tawarkan perpanjangan paket sebelum akses terkunci otomatis.
            </p>
          </div>
          <Link
            href="/founder/companies"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Lihat Semua Perusahaan <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          {expiring.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Tidak ada perusahaan yang akan kedaluwarsa dalam 7 hari ke depan. Semua status aman!
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2.5 font-bold">Perusahaan</th>
                  <th className="pb-2.5 font-bold">Admin HR</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Sisa Hari</th>
                  <th className="pb-2.5 font-bold">Kedaluwarsa</th>
                  <th className="pb-2.5 font-bold text-right">Karyawan</th>
                  <th className="pb-2.5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expiring.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{c.name}</td>
                    <td className="py-3 text-xs">
                      <p className="font-medium text-foreground">{c.hr_name}</p>
                      <p className="text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="py-3">
                      <StateBadge state={c.state} />
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                        {c.days_left} hari lagi
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{c.ends_at}</td>
                    <td className="py-3 text-xs text-right font-bold tabular-nums">
                      {c.total_employees} orang
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/founder/companies?q=${encodeURIComponent(c.name)}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                      >
                        Kelola
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Tile>
    </FounderShell>
  );
}
