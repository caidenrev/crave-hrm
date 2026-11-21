import { Head, Link, router } from "@inertiajs/react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Filter,
  Search,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import {
  Tile,
  TileTitle,
  InvoiceBadge,
  angka,
  rupiah,
  tanggal,
  METHOD_LABEL,
  Segmented,
} from "@/components/founder/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FounderInvoices({ invoices, stats, filters }) {
  const [q, setQ] = useState(filters.q || "");
  const [status, setStatus] = useState(filters.status || "all");

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    router.get(
      "/founder/invoices",
      { q: q.trim(), status: newStatus },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      "/founder/invoices",
      { q: q.trim(), status },
      { preserveState: true, replace: true }
    );
  };

  return (
    <FounderShell>
      <Head title="Founder Console - Riwayat Pembayaran" />

      <PageHeader
        title="Pembayaran"
        subtitle="Tagihan langganan dari semua perusahaan."
        actions={
          <a
            href="/founder/companies/export"
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm font-semibold shadow-soft hover:bg-accent transition-colors"
          >
            <Download className="size-4" /> Ekspor CSV
          </a>
        }
      />

      {/* KPI Cards (Crave POS Parity: All 4 White Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Tile>
          <span className="text-xs font-semibold text-muted-foreground">
            Total lunas
          </span>
          <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{rupiah(stats.total_paid)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.paid_count} tagihan
          </p>
        </Tile>

        <Tile>
          <span className="text-xs font-semibold text-muted-foreground">
            Lewat Midtrans
          </span>
          <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{rupiah(stats.midtrans_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.midtrans_count} tagihan
          </p>
        </Tile>

        <Tile>
          <span className="text-xs font-semibold text-muted-foreground">
            Aktivasi manual
          </span>
          <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{rupiah(stats.manual_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.manual_count} tagihan, tidak lewat Midtrans
          </p>
        </Tile>

        <Tile>
          <span className="text-xs font-semibold text-muted-foreground">
            Menunggu pembayaran
          </span>
          <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{rupiah(stats.pending_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.pending_count} tagihan</p>
        </Tile>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari email atau order ID"
            className="rounded-xl pl-10 h-10 text-sm"
          />
        </form>

        <Segmented
          label="Status Tagihan"
          value={status}
          onChange={handleStatusChange}
          options={[
            { value: "all", label: "Semua" },
            { value: "paid", label: "Lunas" },
            { value: "pending", label: "Menunggu" },
            { value: "cancelled", label: "Batal" },
          ]}
        />
      </div>

      {/* Invoices Table (Crave POS Parity) */}
      <div className="overflow-x-auto rounded-3xl border bg-card shadow-soft">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground bg-muted/20">
              <th className="px-5 py-3.5 font-bold">Perusahaan</th>
              <th className="px-5 py-3.5 font-bold">Durasi</th>
              <th className="px-5 py-3.5 font-bold">Nominal</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold">Metode</th>
              <th className="px-5 py-3.5 font-bold">Dibuat</th>
              <th className="px-5 py-3.5 font-bold">Dibayar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Tidak ada data tagihan ditemukan.
                </td>
              </tr>
            ) : (
              invoices.data.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs">
                    <p className="font-bold text-foreground text-sm">
                      {inv.user?.email || inv.company?.email || inv.company?.name || "Perusahaan"}
                    </p>
                    <p className="font-mono text-muted-foreground text-[11px] mt-0.5">
                      {inv.order_id}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-foreground font-medium">
                    {inv.months} bulan
                  </td>
                  <td className="px-5 py-3.5 font-bold tabular-nums text-foreground">
                    {rupiah(inv.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <InvoiceBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-medium">
                    {inv.source === "manual"
                      ? "Manual (founder)"
                      : METHOD_LABEL[inv.payment_type] || inv.payment_type || "Midtrans"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {tanggal(inv.created_at, "d MMM yyyy HH:mm")}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {inv.paid_at ? tanggal(inv.paid_at, "d MMM yyyy HH:mm") : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {invoices.links && invoices.links.length > 3 && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {invoices.links.map((link, idx) => (
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
    </FounderShell>
  );
}
