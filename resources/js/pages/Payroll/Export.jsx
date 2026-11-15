import React, { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Landmark,
  Download,
  FileSpreadsheet,
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const BANK_PREVIEWS = [
  {
    code: "BCA",
    name: "KlikBCA Bisnis",
    ext: ".csv",
    badge: "BCA Corporate",
    desc: "Format CSV batch transfer payroll multi-account KlikBCA Bisnis resmi.",
  },
  {
    code: "MANDIRI",
    name: "Mandiri Cash Management (MCM)",
    ext: ".csv",
    badge: "MCM 2.0",
    desc: "Format CSV payroll transfer terstruktur standar MCM corporate banking.",
  },
  {
    code: "BRI",
    name: "BRI Cash Management System (CMS)",
    ext: ".txt",
    badge: "BRI CMS",
    desc: "Format file teks delimit pipe '|' standar transfer massal CMS BRI.",
  },
  {
    code: "BNI",
    name: "BNI Direct Corporate",
    ext: ".txt",
    badge: "BNI Direct",
    desc: "Format CSV/TXT transfer upah massal standar corporate BNI Direct.",
  },
];

export default function Export({
  periods = [],
  selectedPeriod = null,
  bankDistribution = {},
  totalEmployees = 0,
  totalAmount = 0,
}) {
  const [activePeriodId, setActivePeriodId] = useState(
    selectedPeriod?.id || periods[0]?.id || ""
  );
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const handlePeriodChange = (pId) => {
    setActivePeriodId(pId);
    router.get(
      "/payroll/export",
      { period_id: pId },
      { preserveState: true, preserveScroll: true }
    );
  };

  const downloadBankFile = (bankCode) => {
    if (!activePeriodId) return;
    setDownloadingFormat(bankCode);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/payroll/export/bank";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
    form.appendChild(csrfInput);

    const periodInput = document.createElement("input");
    periodInput.type = "hidden";
    periodInput.name = "payroll_period_id";
    periodInput.value = activePeriodId;
    form.appendChild(periodInput);

    const bankInput = document.createElement("input");
    bankInput.type = "hidden";
    bankInput.name = "bank_format";
    bankInput.value = bankCode;
    form.appendChild(bankInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

  const downloadExcelRecap = () => {
    if (!activePeriodId) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/payroll/export/excel";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
    form.appendChild(csrfInput);

    const periodInput = document.createElement("input");
    periodInput.type = "hidden";
    periodInput.name = "payroll_period_id";
    periodInput.value = activePeriodId;
    form.appendChild(periodInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const renderBankLogo = (bankCode, sizeClass = "h-8 max-w-[110px]") => {
    const code = String(bankCode || "").toUpperCase();
    if (code.includes("BCA")) {
      return (
        <>
          <img
            src="/Logo BCA_Biru.png"
            alt="Bank Central Asia (BCA)"
            className={cn(sizeClass, "w-auto object-contain dark:hidden")}
          />
          <img
            src="/Logo BCA_Putih.png"
            alt="Bank Central Asia (BCA)"
            className={cn(sizeClass, "w-auto object-contain hidden dark:block")}
          />
        </>
      );
    }
    if (code.includes("MANDIRI")) {
      return (
        <>
          <img
            src="/Logo MANDIRI_Biru.png"
            alt="Bank Mandiri"
            className={cn(sizeClass, "w-auto object-contain dark:hidden")}
          />
          <img
            src="/Logo MANDIRI_Putih.png"
            alt="Bank Mandiri"
            className={cn(sizeClass, "w-auto object-contain hidden dark:block")}
          />
        </>
      );
    }
    if (code.includes("BRI")) {
      return (
        <>
          <img
            src="/Logo BRI_Biru.png"
            alt="Bank Rakyat Indonesia (BRI)"
            className={cn(sizeClass, "w-auto object-contain dark:hidden")}
          />
          <img
            src="/Logo BRI_Putih.png"
            alt="Bank Rakyat Indonesia (BRI)"
            className={cn(sizeClass, "w-auto object-contain hidden dark:block")}
          />
        </>
      );
    }
    if (code.includes("BNI")) {
      return (
        <img
          src="/Logo BNI.png"
          alt="Bank Negara Indonesia (BNI)"
          className={cn(sizeClass, "w-auto object-contain")}
        />
      );
    }
    return (
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 font-black text-xs text-primary">
        {code.substring(0, 3)}
      </div>
    );
  };

  return (
    <AuthenticatedLayout
      title="Ekspor Bank & Rekap"
      subtitle={`Batch transfer internet banking · ${totalEmployees} rekening siap kirim`}
      actions={
        <Button
          size="sm"
          className="rounded-xl gap-1.5 text-xs font-semibold"
          onClick={downloadExcelRecap}
          disabled={!selectedPeriod}
        >
          <FileSpreadsheet className="size-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Download Master Excel</span>
          <span className="sm:hidden">Excel</span>
        </Button>
      }
    >
      <Head title="Ekspor Bank & Rekap — Crave HRM" />

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
              className="rounded-full px-3.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              Slip Gaji
            </Link>
            <Link
              href="/payroll/export"
              className="rounded-full px-3.5 py-1 text-xs font-bold bg-card text-foreground shadow-soft transition-all"
            >
              Ekspor Bank &amp; Rekap
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <DollarSign className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Disbursement
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl">
                {formatRupiah(totalAmount)}
              </div>
              <div className="text-[12px] text-white/80">Total Siap Ditransfer</div>
            </div>
          </div>

          {/* Card 1: Penerima */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Users className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground">
                Rekening Aktif
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                {totalEmployees}
              </div>
              <div className="text-[12px] text-muted-foreground">Karyawan Penerima Upah</div>
            </div>
          </div>

          {/* Card 2: Format Terintegrasi */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Landmark className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                Resmi
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                4 Bank
              </div>
              <div className="text-[12px] text-muted-foreground">BCA, Mandiri, BRI, BNI</div>
            </div>
          </div>

          {/* Card 3: Keamanan */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-sm sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <ShieldCheck className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-primary">
                ISO 20022
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight sm:text-2xl text-foreground">
                Batch Transfer
              </div>
              <div className="text-[12px] text-muted-foreground">Validasi Nomor Rekening</div>
            </div>
          </div>
        </div>

        {/* Period Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Pilih Periode Payroll:
            </span>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1 text-xs font-semibold transition-all",
                    String(activePeriodId) === String(p.id)
                      ? "bg-card text-foreground font-bold shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-2 text-xs self-start sm:self-auto"
            onClick={downloadExcelRecap}
            disabled={!selectedPeriod}
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            Download Rekap Master Excel (.csv)
          </Button>
        </div>

        {/* Bank Formats Grid with Official Real Bank Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BANK_PREVIEWS.map((bank) => (
            <div
              key={bank.code}
              className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-32 items-center justify-center rounded-xl bg-muted/40 border border-border/40 p-2 shrink-0 shadow-xs">
                      {renderBankLogo(bank.code)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {bank.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ekstensi: {bank.ext}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    {bank.badge}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {bank.desc}
                </p>
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {selectedPeriod ? selectedPeriod.name : "Pilih periode"}
                </span>

                <Button
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs font-semibold"
                  disabled={!selectedPeriod || downloadingFormat === bank.code}
                  onClick={() => downloadBankFile(bank.code)}
                >
                  <Download className="size-3.5" />
                  {downloadingFormat === bank.code ? "Mengunduh..." : `Unduh Batch ${bank.code}`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bank Distribution Summary Card with Logos */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Distribusi Pembayaran Berdasarkan Rekening Bank
              </h3>
              <p className="text-xs text-muted-foreground">
                Rincian total transfer upah per perbankan pada periode terpilih
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/50">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Bank Mitra</TableHead>
                  <TableHead className="text-xs font-bold text-center">Jumlah Penerima</TableHead>
                  <TableHead className="text-xs font-bold text-right">Total Nominal Transfer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(bankDistribution).length > 0 ? (
                  Object.entries(bankDistribution).map(([bankName, data]) => (
                    <TableRow key={bankName}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-24 items-center justify-center rounded-lg bg-muted/40 border border-border/40 p-1 shrink-0">
                            {renderBankLogo(bankName, "h-5 max-w-[85px]")}
                          </div>
                          <span className="font-semibold text-xs text-foreground">
                            {bankName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {data.count} Karyawan
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-foreground">
                        {formatRupiah(data.total_amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-xs text-muted-foreground">
                      Belum ada data distribusi bank untuk periode ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
