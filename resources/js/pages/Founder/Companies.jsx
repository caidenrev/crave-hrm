import { Head, Link, router, usePage } from "@inertiajs/react";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MoreVertical,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import {
  Tile,
  TileTitle,
  StateBadge,
  angka,
  rupiah,
  tanggal,
  Segmented,
} from "@/components/founder/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function FounderCompanies({ companies, counts, filters }) {
  const [q, setQ] = useState(filters.q || "");
  const [filter, setFilter] = useState(filters.filter || "all");
  const [selectedId, setSelectedId] = useState(null);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    router.get(
      "/founder/companies",
      { q: q.trim(), filter: newFilter },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      "/founder/companies",
      { q: q.trim(), filter },
      { preserveState: true, replace: true }
    );
  };

  const selected = companies.find((c) => c.id === selectedId) || null;

  return (
    <FounderShell>
      <Head title="Founder Console - Daftar Perusahaan" />

      <PageHeader
        title="Perusahaan"
        subtitle="Semua akun perusahaan, status langganan, dan aktivitasnya."
        actions={
          <a
            href="/founder/companies/export"
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm font-semibold shadow-soft hover:bg-accent transition-colors"
          >
            <Download className="size-4" /> Ekspor CSV
          </a>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari email, nama, atau nama perusahaan"
            className="rounded-xl pl-10 h-10 text-sm"
          />
        </form>

        <Segmented
          label="Saring status"
          value={filter}
          onChange={handleFilterChange}
          options={[
            { value: "all", label: `Semua ${counts.all}` },
            { value: "active", label: `Berbayar ${counts.active}` },
            { value: "trial", label: `Trial ${counts.trial}` },
            { value: "inactive", label: `Tidak aktif ${counts.inactive}` },
          ]}
        />
      </div>

      {/* Companies Table (Crave POS Parity) */}
      <div className="overflow-x-auto rounded-3xl border bg-card shadow-soft">
        <table className="w-full min-w-[950px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground bg-muted/20">
              <th className="px-5 py-3.5 font-bold">Perusahaan</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold">Berakhir</th>
              <th className="px-5 py-3.5 font-bold">Karyawan 30 hari</th>
              <th className="px-5 py-3.5 font-bold">Omzet 30 hari</th>
              <th className="px-5 py-3.5 font-bold">Login terakhir</th>
              <th className="px-5 py-3.5 font-bold">Daftar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Tidak ada perusahaan yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-foreground text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StateBadge state={c.state} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-foreground font-medium">
                    {c.ends_at || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold tabular-nums text-foreground">
                    {c.employees_count || 0}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold tabular-nums text-foreground">
                    {rupiah(c.total_paid || 0)}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    sekitar 1 bulan yang lalu
                  </td>
                  <td className="px-5 py-3.5 text-xs text-foreground font-medium">
                    {c.registered_at || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Sheet for Company Management */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl p-6">
          {selected && <CompanyPanel company={selected} onClose={() => setSelectedId(null)} />}
        </SheetContent>
      </Sheet>
    </FounderShell>
  );
}

function CompanyPanel({ company: c, onClose }) {
  const [note, setNote] = useState(c.founder_note || "");
  const [trialDays, setTrialDays] = useState("7");
  const [suspendReason, setSuspendReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postAction = (action, payload = {}) => {
    setIsSubmitting(true);
    router.post(
      `/founder/companies/${c.id}/subscription`,
      { action, ...payload },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Tindakan berhasil diproses!");
        },
        onError: (errors) => {
          setIsSubmitting(false);
          toast.error("Gagal memproses tindakan.");
        },
      }
    );
  };

  const handleSaveNote = () => {
    postAction("set_note", { note });
  };

  const handleExtendTrial = () => {
    const days = parseInt(trialDays, 10);
    if (!days || days < 1) {
      toast.error("Masukkan jumlah hari yang valid.");
      return;
    }
    postAction("extend_trial", { value: days, note });
  };

  const handleAddMonths = (months) => {
    if (confirm(`Tambah masa aktif ${months} bulan untuk perusahaan ${c.name}?`)) {
      postAction("add_months", { value: months, note });
    }
  };

  const handleSuspend = () => {
    const reason = prompt(
      `Masukkan alasan penangguhan untuk ${c.name}:`,
      "Pelanggaran ketentuan penggunaan atau permintaan penutupan sementara."
    );
    if (reason) {
      postAction("suspend", { reason, note });
    }
  };

  const handleUnsuspend = () => {
    if (confirm(`Aktifkan kembali akses HRM untuk ${c.name}?`)) {
      postAction("unsuspend", { note });
    }
  };

  return (
    <div className="space-y-6">
      <SheetHeader className="text-left border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shrink-0">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <SheetTitle className="text-xl font-black">{c.name}</SheetTitle>
            <SheetDescription className="text-xs">
              ID: {c.id} · Terdaftar {c.registered_at}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* Status Bar */}
      <div className="rounded-2xl bg-muted/40 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">Status Langganan</span>
          <StateBadge state={c.state} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Berakhir Pada:</span>
          <span className="font-extrabold text-foreground">{c.ends_at || "Belum diatur"}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Sisa Waktu:</span>
          <span className="font-bold text-primary">{c.days_left} hari</span>
        </div>
        {c.suspended_at && (
          <div className="rounded-xl bg-red-100 p-2 text-xs text-red-800 dark:bg-red-950 dark:text-red-300">
            <p className="font-bold">Ditangguhkan pada: {c.suspended_at}</p>
            <p className="text-[11px] mt-0.5">Alasan: {c.suspended_reason}</p>
          </div>
        )}
      </div>

      {/* Contact & Tenant Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border p-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Admin HR</p>
          <p className="text-sm font-extrabold text-foreground mt-1 truncate">{c.hr_name}</p>
          <p className="text-xs text-muted-foreground truncate">{c.hr_email}</p>
        </div>
        <div className="rounded-2xl border p-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Karyawan</p>
          <p className="text-sm font-extrabold text-foreground mt-1">
            {c.employees_count} / {c.max_employees}
          </p>
          <p className="text-xs text-muted-foreground">Paket {c.plan_name}</p>
        </div>
      </div>

      {/* Founder Action Controls */}
      <div className="space-y-4 rounded-2xl border p-4 bg-card">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
          <ShieldAlert className="size-4 text-primary" />
          Kontrol Langganan Founder
        </h3>

        {/* Private Note */}
        <div className="space-y-1.5">
          <Label htmlFor="founder-note" className="text-xs font-bold">
            Catatan Khusus (Hanya Terlihat Founder)
          </Label>
          <div className="flex gap-2">
            <Input
              id="founder-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Pembayaran transfer langsung BCA 15 Nov"
              className="rounded-xl text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold shrink-0"
              disabled={isSubmitting || note === (c.founder_note || "")}
              onClick={handleSaveNote}
            >
              Simpan
            </Button>
          </div>
        </div>

        {/* Add Months Manual Activation */}
        <div className="space-y-1.5 pt-2 border-t">
          <Label className="text-xs font-bold">Aktivasi Berbayar Manual</Label>
          <p className="text-[11px] text-muted-foreground">
            Menambah masa aktif resmi dan otomatis mencatat invoice manual lunas.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold"
              disabled={isSubmitting}
              onClick={() => handleAddMonths(1)}
            >
              +1 Bulan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold"
              disabled={isSubmitting}
              onClick={() => handleAddMonths(6)}
            >
              +6 Bulan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold"
              disabled={isSubmitting}
              onClick={() => handleAddMonths(12)}
            >
              +12 Bulan
            </Button>
          </div>
        </div>

        {/* Extend Trial */}
        <div className="space-y-1.5 pt-2 border-t">
          <Label htmlFor="extend-trial" className="text-xs font-bold">
            Perpanjang Masa Trial (+Hari)
          </Label>
          <div className="flex gap-2">
            <Input
              id="extend-trial"
              type="number"
              min="1"
              max="365"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              className="rounded-xl text-xs w-28"
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold flex-1"
              disabled={isSubmitting}
              onClick={handleExtendTrial}
            >
              Perpanjang Trial
            </Button>
          </div>
        </div>

        {/* Suspend / Unsuspend */}
        <div className="pt-2 border-t">
          {c.state === "suspended" ? (
            <Button
              variant="outline"
              className="w-full rounded-xl text-xs font-bold text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              disabled={isSubmitting}
              onClick={handleUnsuspend}
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              Aktifkan Kembali Akun (Unsuspend)
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full rounded-xl text-xs font-bold"
              disabled={isSubmitting}
              onClick={handleSuspend}
            >
              <ShieldAlert className="size-4 mr-1.5" />
              Tangguhkan Akun (Suspend Akses)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
