import { Head, Link, router } from "@inertiajs/react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageCircle,
  MoreVertical,
  Phone,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import {
  Tile,
  TileTitle,
  angka,
  tanggal,
  Segmented,
} from "@/components/founder/ui";
import { Badge } from "@/components/ui/badge";
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

const STATUS_OPTIONS = [
  { value: "new", label: "Prospek Baru", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  { value: "contacted", label: "Sudah Dihubungi", color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  { value: "demo_scheduled", label: "Demo Dijadwalkan", color: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
  { value: "converted", label: "Closing / Jadi Tenant", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  { value: "archived", label: "Diarsipkan", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
];

export default function FounderLeads({ leads, stats, filters }) {
  const [q, setQ] = useState(filters.q || "");
  const [status, setStatus] = useState(filters.status || "all");
  const [selectedLead, setSelectedLead] = useState(null);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    router.get(
      "/founder/leads",
      { q: q.trim(), status: newStatus },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      "/founder/leads",
      { q: q.trim(), status },
      { preserveState: true, replace: true }
    );
  };

  return (
    <FounderShell>
      <Head title="Founder Console - Prospek Sales & Demo" />

      <PageHeader
        title="Prospek Sales & Permintaan Demo"
        subtitle="Pantau data leads masuk dari formulir Contact Sales landing page dan hubungi calon klien via WhatsApp 1-klik."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Tile tone="primary">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
            Total Prospek Masuk
          </span>
          <p className="mt-2 text-3xl font-black tracking-tight">{stats.total}</p>
          <p className="mt-1 text-xs text-primary-foreground/80">
            {stats.converted} prospek berhasil closing
          </p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Prospek Baru (Belum Dihubungi)
            </span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-blue-600 dark:text-blue-400">
            {stats.new}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.new > 0 ? "Segera follow-up calon klien!" : "Semua prospek telah direspons"}
          </p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Demo Dijadwalkan
            </span>
            <Calendar className="size-4 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-purple-600 dark:text-purple-400">
            {stats.demo_scheduled}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Siap presentasi solusi HRM</p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Closing / Jadi Tenant
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.converted}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Konversi: {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
          </p>
        </Tile>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, perusahaan, nomor WhatsApp..."
            className="rounded-xl pl-10 h-10 text-sm"
          />
        </form>

        <Segmented
          label="Saring status"
          value={status}
          onChange={handleStatusChange}
          options={[
            { value: "all", label: `Semua (${stats.total})` },
            { value: "new", label: `Baru (${stats.new})` },
            { value: "contacted", label: `Dihubungi (${stats.contacted})` },
            { value: "demo_scheduled", label: `Demo (${stats.demo_scheduled})` },
            { value: "converted", label: `Closing (${stats.converted})` },
          ]}
        />
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto rounded-3xl border bg-card shadow-soft">
        <table className="w-full min-w-[950px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground bg-muted/20">
              <th className="px-5 py-3.5 font-bold">Prospek & Perusahaan</th>
              <th className="px-5 py-3.5 font-bold">Kontak & WhatsApp</th>
              <th className="px-5 py-3.5 font-bold">Karyawan</th>
              <th className="px-5 py-3.5 font-bold">Kebutuhan / Catatan</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 text-right font-bold">Tanggal Masuk</th>
              <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Belum ada data prospek sales yang masuk.
                </td>
              </tr>
            ) : (
              leads.data.map((item) => {
                const statusMeta =
                  STATUS_OPTIONS.find((s) => s.value === item.status) || STATUS_OPTIONS[0];

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedLead(item)}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-extrabold text-foreground">{item.name}</p>
                          <p className="truncate text-xs font-semibold text-primary">
                            {item.company_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <p className="text-muted-foreground">{item.work_email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.phone}</span>
                        <a
                          href={item.whatsapp_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          <MessageCircle className="size-3" />
                          <span>Chat WA</span>
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold">
                      <span className="inline-flex rounded-lg bg-muted px-2 py-1 text-foreground">
                        {item.employee_count} Staf
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground">
                        {item.notes || <span className="italic text-muted-foreground/60">- Tidak ada catatan khusus -</span>}
                      </p>
                      {item.founder_notes && (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium italic">
                          Note: {item.founder_notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusMeta.color}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                      {item.created_at}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(item);
                        }}
                      >
                        Kelola
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {leads.links && leads.links.length > 3 && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {leads.links.map((link, idx) => (
            <Link
              key={idx}
              href={link.url || "#"}
              preserveState
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                link.active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : !link.url
                  ? "text-muted-foreground/50 pointer-events-none"
                  : "bg-card text-foreground border hover:bg-accent"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}

      {/* Slide-over Sheet for Lead Management */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg p-6">
          {selectedLead && (
            <LeadPanel
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
              onUpdated={() => {
                setSelectedLead(null);
                router.reload();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </FounderShell>
  );
}

function LeadPanel({ lead, onClose, onUpdated }) {
  const [status, setStatus] = useState(lead.status);
  const [founderNotes, setFounderNotes] = useState(lead.founder_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = () => {
    setIsSubmitting(true);
    router.patch(
      `/founder/leads/${lead.id}`,
      {
        status,
        founder_notes: founderNotes,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Status prospek berhasil diperbarui!");
          onUpdated();
        },
        onError: () => {
          setIsSubmitting(false);
          toast.error("Gagal memperbarui prospek.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm(`Hapus data prospek ${lead.name} (${lead.company_name})?`)) {
      router.delete(`/founder/leads/${lead.id}`, {
        onSuccess: () => {
          toast.success("Prospek berhasil dihapus.");
          onUpdated();
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <SheetHeader className="text-left border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <SheetTitle className="text-xl font-black">{lead.name}</SheetTitle>
            <SheetDescription className="text-xs">
              {lead.company_name} · Masuk pada {lead.created_at}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* Contact Card */}
      <div className="rounded-2xl border p-4 bg-muted/30 space-y-3">
        <span className="text-[11px] font-bold text-muted-foreground uppercase">
          Informasi Kontak & Tindak Lanjut
        </span>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Email:</span>
          <a href={`mailto:${lead.work_email}`} className="font-bold text-primary hover:underline">
            {lead.work_email}
          </a>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Nomor Telepon/WA:</span>
          <span className="font-bold text-foreground">{lead.phone}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Ukuran Karyawan:</span>
          <span className="font-bold text-foreground">{lead.employee_count} Orang</span>
        </div>

        <div className="pt-2 border-t flex gap-2">
          <a
            href={lead.whatsapp_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 shadow-soft transition-colors"
          >
            <MessageCircle className="size-4" /> Buka WhatsApp
          </a>
          <a
            href={`mailto:${lead.work_email}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-input bg-background hover:bg-accent text-xs font-bold py-2 transition-colors"
          >
            <Mail className="size-4" /> Kirim Email
          </a>
        </div>
      </div>

      {/* Inquiries / Notes */}
      <div className="rounded-2xl border p-4 space-y-1.5">
        <span className="text-[11px] font-bold text-muted-foreground uppercase">
          Kebutuhan / Permintaan Demo
        </span>
        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
          {lead.notes || <span className="italic text-muted-foreground">- Tidak ada pesan khusus dari prospek -</span>}
        </p>
      </div>

      {/* Status & Founder Notes Form */}
      <div className="space-y-4 rounded-2xl border p-4 bg-card">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground">
          Kelola Status Prospek
        </h3>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold">Tahapan Penjualan (Pipeline)</Label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`rounded-xl border p-2 text-xs font-bold text-left transition-all ${
                  status === opt.value
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t">
          <Label htmlFor="founder-note" className="text-xs font-bold">
            Catatan Internal Founder (Privat)
          </Label>
          <textarea
            id="founder-note"
            rows={3}
            value={founderNotes}
            onChange={(e) => setFounderNotes(e.target.value)}
            placeholder="Contoh: Sudah janjian demo hari Jumat jam 14.00 via Google Meet."
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="pt-2 flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="rounded-xl text-xs font-bold"
            onClick={handleDelete}
          >
            <Trash2 className="size-3.5 mr-1" /> Hapus
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-xl text-xs font-bold"
            disabled={isSubmitting}
            onClick={handleUpdate}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
