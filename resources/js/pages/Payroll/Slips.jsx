import React, { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  FileText,
  Printer,
  Search,
  Filter,
  DollarSign,
  Users,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Calculator,
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
import { formatRupiah, formatTanggal, getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import PayslipModal from "./PayslipModal";

export default function Slips({
  periods = [],
  selectedPeriodId = null,
  items = { data: [], links: [] },
  stats = {},
}) {
  const [search, setSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(selectedPeriodId || "");
  const [previewItem, setPreviewItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePeriodChange = (pId) => {
    setSelectedPeriod(pId);
    router.get(
      "/payroll/slips",
      { period_id: pId, search },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      "/payroll/slips",
      { period_id: selectedPeriod, search },
      { preserveState: true, preserveScroll: true }
    );
  };

  const openSlip = (item) => {
    setPreviewItem(item);
    setModalOpen(true);
  };

  const activePeriodObj = periods.find((p) => String(p.id) === String(selectedPeriod));

  return (
    <AuthenticatedLayout
      title="Slip Gaji Karyawan"
      subtitle={`${stats.total_slips || 0} lembar slip gaji · Periode ${activePeriodObj ? activePeriodObj.name : "Aktif"}`}
      actions={
        <Link href="/payroll">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold">
            <Calculator className="size-3.5" />
            <span className="hidden sm:inline">Proses Payroll</span>
            <span className="sm:hidden">Payroll</span>
          </Button>
        </Link>
      }
    >
      <Head title="Slip Gaji Karyawan — Crave HRM" />

      <div className="space-y-5">
        {/* Sub-Route Navigation Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40 w-fit">
            <Link
              href="/payroll"
              className="rounded-full px-3.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              Proses Payroll
            </Link>
            <Link
              href="/payroll/slips"
              className="rounded-full px-3.5 py-1 text-xs font-bold bg-card text-foreground shadow-soft transition-all"
            >
              Slip Gaji
            </Link>
            <Link
              href="/payroll/export"
              className="rounded-full px-3.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              Ekspor Bank &amp; Rekap
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards (Crave POS Formula) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <DollarSign className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Total Diterima
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl">
                {formatRupiah(stats.total_paid || 0)}
              </div>
              <div className="text-[12px] text-white/80">Total Take Home Pay</div>
            </div>
          </div>

          {/* Card 1: Total Lembar Slip */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <FileText className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground">
                Terbit
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                {stats.total_slips || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Lembar Slip Gaji</div>
            </div>
          </div>

          {/* Card 2: PPh 21 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Calculator className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                TER Resmi
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                {formatRupiah(stats.total_tax || 0)}
              </div>
              <div className="text-[12px] text-muted-foreground">Total PPh 21 Dipotong</div>
            </div>
          </div>

          {/* Card 3: Status */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <ShieldCheck className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-primary">
                Aman &amp; Sah
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                100%
              </div>
              <div className="text-[12px] text-muted-foreground">Siap Dicetak &amp; Diunduh</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm space-y-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Pilih Periode:
              </span>
              <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
                {periods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePeriodChange(p.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-semibold transition-all",
                      String(selectedPeriod) === String(p.id)
                        ? "bg-card text-foreground font-bold shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari nama karyawan / NIK..."
                  className="pl-9 rounded-xl text-xs bg-muted/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" variant="secondary" className="rounded-xl text-xs">
                Cari
              </Button>
            </div>
          </form>

          {/* Slips Table */}
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Karyawan</TableHead>
                  <TableHead className="text-xs font-bold">Periode</TableHead>
                  <TableHead className="text-xs font-bold">PTKP / Kategori</TableHead>
                  <TableHead className="text-xs font-bold text-right">Gaji Bruto</TableHead>
                  <TableHead className="text-xs font-bold text-right">Potongan</TableHead>
                  <TableHead className="text-xs font-bold text-right">Take Home Pay</TableHead>
                  <TableHead className="text-xs font-bold text-center">Status</TableHead>
                  <TableHead className="text-xs font-bold text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.data && items.data.length > 0 ? (
                  items.data.map((item) => {
                    const emp = item.employee || {};
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <EmployeeAvatar
                              person={emp}
                              name={emp.nama_lengkap}
                              className="size-9 border border-border/60"
                            />
                            <div>
                              <div className="font-semibold text-xs text-foreground">
                                {emp.nama_lengkap || "-"}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                NIK: {emp.nik} &bull; {emp.department?.name || "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {item.period?.name || "-"}
                        </TableCell>

                        <TableCell>
                          <div className="text-xs font-medium">{item.ptkp_status}</div>
                          <div className="text-[10px] text-muted-foreground">
                            TER {item.ter_category} ({Number(item.ter_rate).toFixed(2)}%)
                          </div>
                        </TableCell>

                        <TableCell className="text-right text-xs font-medium">
                          {formatRupiah(item.penghasilan_bruto)}
                        </TableCell>

                        <TableCell className="text-right text-xs font-semibold text-rose-600 dark:text-rose-400">
                          {formatRupiah(item.total_potongan)}
                        </TableCell>

                        <TableCell className="text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(item.take_home_pay)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant={item.payment_status === "paid" ? "default" : "secondary"}
                            className="rounded-full text-[10px] font-semibold"
                          >
                            {item.payment_status === "paid" ? "Lunas" : "Draft"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl h-7 px-2.5 text-xs gap-1"
                              onClick={() => openSlip(item)}
                            >
                              <Eye className="size-3.5" />
                              Pratinjau
                            </Button>

                            <Button
                              size="sm"
                              className="rounded-xl h-7 px-2.5 text-xs gap-1"
                              onClick={() => window.open(`/payroll/slips/${item.id}/print`, "_blank")}
                            >
                              <Printer className="size-3.5" />
                              Cetak
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                      Tidak ada slip gaji yang ditemukan. Jalankan proses payroll terlebih dahulu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <PayslipModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={previewItem}
      />
    </AuthenticatedLayout>
  );
}
