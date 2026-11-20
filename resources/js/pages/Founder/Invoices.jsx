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
        title="Riwayat Tagihan & Pembayaran"
        subtitle="Daftar transaksi langganan masuk dari Midtrans payment gateway dan aktivasi manual founder."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Tile tone="primary">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
            Total Dana Masuk Lunas
          </span>
          <p className="mt-2 text-2xl font-black tracking-tight">{rupiah(stats.total_paid)}</p>
          <p className="mt-1 text-xs text-primary-foreground/75">
            {stats.paid_count} transaksi berhasil
          </p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Midtrans Gateway
            </span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight">{rupiah(stats.midtrans_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.midtrans_count} transaksi via Midtrans
          </p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Aktivasi Manual
            </span>
            <Wallet className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight">{rupiah(stats.manual_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.manual_count} aktivasi oleh Founder
          </p>
        </Tile>

        <Tile>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Menunggu Pembayaran
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight">{rupiah(stats.pending_total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.pending_count} invoice aktif</p>
        </Tile>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari order ID, nama perusahaan, email..."
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
            { value: "expired", label: "Kedaluwarsa" },
          ]}
        />
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto rounded-3xl border bg-card shadow-soft">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground bg-muted/20">
              <th className="px-5 py-3.5 font-bold">Order ID</th>
              <th className="px-5 py-3.5 font-bold">Perusahaan</th>
              <th className="px-5 py-3.5 font-bold">Paket</th>
              <th className="px-5 py-3.5 font-bold">Jumlah</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold">Sumber</th>
              <th className="px-5 py-3.5 text-right font-bold">Tanggal</th>
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
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-bold text-xs text-foreground">{inv.order_id}</p>
                    {inv.payment_type && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {METHOD_LABEL[inv.payment_type] || inv.payment_type}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <p className="font-bold text-foreground">{inv.company?.name || "Perusahaan"}</p>
                    <p className="text-muted-foreground">{inv.user?.email || "-"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="font-semibold text-foreground">{inv.plan_name}</span>
                    <p className="text-muted-foreground">{inv.months} Bulan</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold tabular-nums text-foreground">
                    {rupiah(inv.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <InvoiceBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        inv.source === "midtrans"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                      }`}
                    >
                      {inv.source === "midtrans" ? "Midtrans" : "Manual Founder"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{tanggal(inv.paid_at || inv.created_at)}</p>
                    <p className="text-[10px]">{tanggal(inv.paid_at || inv.created_at, "HH:mm")}</p>
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
