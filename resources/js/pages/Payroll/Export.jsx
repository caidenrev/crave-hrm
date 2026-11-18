import React, { useMemo, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Landmark,
  Download,
  FileSpreadsheet,
  DollarSign,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    matchKeys: ["BCA"],
    name: "KlikBCA Bisnis",
    ext: ".csv",
    formatType: "csv",
    badge: "BCA Corporate",
    desc: "Format CSV batch transfer payroll multi-account KlikBCA Bisnis resmi.",
  },
  {
    code: "MANDIRI",
    matchKeys: ["MANDIRI"],
    name: "Mandiri Cash Management",
    ext: ".csv",
    formatType: "csv",
    badge: "MCM 2.0",
    desc: "Format CSV payroll transfer terstruktur standar MCM corporate banking.",
  },
  {
    code: "BRI",
    matchKeys: ["BRI"],
    name: "BRI Cash Management",
    ext: ".txt",
    formatType: "txt",
    badge: "BRI CMS",
    desc: "Format teks delimit pipe '|' standar transfer massal CMS Bank BRI.",
  },
  {
    code: "BNI",
    matchKeys: ["BNI"],
    name: "BNI Direct Corporate",
    ext: ".txt",
    formatType: "txt",
    badge: "BNI Direct",
    desc: "Format TXT transfer upah massal standar corporate internet banking BNI.",
  },
  {
    code: "BSI",
    matchKeys: ["BSI", "SYARIAH"],
    name: "BSI Net Banking",
    ext: ".csv",
    formatType: "csv",
    badge: "BSI CMS",
    desc: "Format CSV payroll korporat Bank Syariah Indonesia siap unggah.",
  },
  {
    code: "CIMB",
    matchKeys: ["CIMB"],
    name: "BizChannel@CIMB",
    ext: ".csv",
    formatType: "csv",
    badge: "CIMB Niaga",
    desc: "Format CSV batch transfer BizChannel@CIMB untuk disbursement gaji & klaim.",
  },
  {
    code: "PERMATA",
    matchKeys: ["PERMATA"],
    name: "Permata e-Business",
    ext: ".csv",
    formatType: "csv",
    badge: "PermataBank",
    desc: "Format CSV payroll korporat tervalidasi untuk portal Permata e-Business.",
  },
  {
    code: "DANAMON",
    matchKeys: ["DANAMON"],
    name: "Danamon Cash Connect",
    ext: ".csv",
    formatType: "csv",
    badge: "Cash Connect",
    desc: "Format CSV transfer gaji massal standar Danamon Cash Connect.",
  },
  {
    code: "BTN",
    matchKeys: ["BTN"],
    name: "BTN Cash Management",
    ext: ".csv",
    formatType: "csv",
    badge: "BTN CMS",
    desc: "Format CSV batch payroll terintegrasi untuk Bank Tabungan Negara.",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState("all"); // all | active | csv | txt
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const handlePeriodChange = (pId) => {
    setActivePeriodId(pId);
    router.get(
      "/payroll/export",
      { period_id: pId },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Petakan distribusi penerima & nominal live dari backend ke masing-masing bank
  const enrichedBanks = useMemo(() => {
    const entries = Object.entries(bankDistribution || {});
    return BANK_PREVIEWS.map((bank) => {
      let recipientCount = 0;
      let nominalTotal = 0;

      for (const [rawBankName, stats] of entries) {
        const upper = String(rawBankName || "").toUpperCase();
        if (bank.matchKeys.some((k) => upper.includes(k))) {
          recipientCount += Number(stats?.count || 0);
          nominalTotal += Number(stats?.total_amount || 0);
        }
      }

      return {
        ...bank,
        recipientCount,
        nominalTotal,
        hasRecipients: recipientCount > 0,
      };
    });
  }, [bankDistribution]);

  const activeBankCount = useMemo(
    () => enrichedBanks.filter((b) => b.hasRecipients).length,
    [enrichedBanks]
  );

  const filteredBanks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedBanks.filter((bank) => {
      if (bankFilter === "active" && !bank.hasRecipients) return false;
      if (bankFilter === "csv" && bank.formatType !== "csv") return false;
      if (bankFilter === "txt" && bank.formatType !== "txt") return false;
      if (!q) return true;
      return (
        bank.code.toLowerCase().includes(q) ||
        bank.name.toLowerCase().includes(q) ||
        bank.badge.toLowerCase().includes(q) ||
        bank.desc.toLowerCase().includes(q)
      );
    });
  }, [enrichedBanks, bankFilter, searchQuery]);

  const downloadBankFile = (bankCode) => {
    if (!activePeriodId) return;
    setDownloadingFormat(bankCode);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/payroll/export/bank";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value =
      document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
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
    csrfInput.value =
      document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
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

  // Optical height calibration per logo agar proporsi visual seimbang di Light & Dark Mode
  const renderBankLogo = (bankCode, overrideClass = null) => {
    const code = String(bankCode || "").toUpperCase();
    const renderDual = (lightSrc, darkSrc, alt, defaultClass) => {
      const cls = overrideClass || defaultClass;
      return (
        <>
          <img
            src={lightSrc}
            alt={alt}
            decoding="async"
            className={cn(cls, "w-auto object-contain dark:hidden select-none")}
          />
          <img
            src={darkSrc}
            alt={alt}
            decoding="async"
            className={cn(cls, "w-auto object-contain hidden dark:block select-none")}
          />
        </>
      );
    };

    if (code.includes("BCA")) {
      return renderDual(
        "/images/partners/Logo BCA_Biru.png",
        "/images/partners/Logo BCA_Putih.png",
        "Bank Central Asia (BCA)",
        "h-6 max-w-[96px]"
      );
    }
    if (code.includes("MANDIRI")) {
      return renderDual(
        "/images/partners/Logo MANDIRI_Biru.png",
        "/images/partners/Logo MANDIRI_Putih.png",
        "Bank Mandiri",
        "h-5 max-w-[100px]"
      );
    }
    if (code.includes("BRI")) {
      return renderDual(
        "/images/partners/Logo BRI_Biru.png",
        "/images/partners/Logo BRI_Putih.png",
        "Bank Rakyat Indonesia (BRI)",
        "h-5 max-w-[96px]"
      );
    }
    if (code.includes("BNI")) {
      return (
        <img
          src="/images/partners/Logo BNI.png"
          alt="Bank Negara Indonesia (BNI)"
          decoding="async"
          className={cn(
            overrideClass || "h-5 max-w-[92px]",
            "w-auto object-contain select-none"
          )}
        />
      );
    }
    if (code.includes("BSI") || code.includes("SYARIAH")) {
      return renderDual(
        "/images/partners/Logo BSI_Hijau.png",
        "/images/partners/Logo BSI_Putih.png",
        "Bank Syariah Indonesia (BSI)",
        "h-6 max-w-[104px]"
      );
    }
    if (code.includes("CIMB")) {
      return renderDual(
        "/images/partners/Logo CIMB_Merah.png",
        "/images/partners/Logo CIMB_Putih.png",
        "Bank CIMB Niaga",
        "h-4.5 max-w-[110px]"
      );
    }
    if (code.includes("PERMATA")) {
      return renderDual(
        "/images/partners/Logo PERMATA_Biru.png",
        "/images/partners/Logo PERMATA_Putih.png",
        "PermataBank",
        "h-5.5 max-w-[106px]"
      );
    }
    if (code.includes("BTN")) {
      return renderDual(
        "/images/partners/Logo BTN_Biru.png",
        "/images/partners/Logo BTN_Putih.png",
        "Bank Tabungan Negara (BTN)",
        "h-5.5 max-w-[82px]"
      );
    }
    if (code.includes("DANAMON")) {
      return (
        <img
          src="/images/partners/Logo DANAMON.png"
          alt="Bank Danamon"
          decoding="async"
          className={cn(
            overrideClass || "h-8 max-w-[102px]",
            "w-auto object-contain select-none"
          )}
        />
      );
    }
    return (
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 font-black text-xs text-primary">
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
          className="rounded-xl gap-1.5 text-xs font-semibold cursor-pointer"
          onClick={downloadExcelRecap}
          disabled={!selectedPeriod}
        >
          <FileSpreadsheet className="size-3.5 text-emerald-300" />
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
              <div className="text-xl font-black tracking-tight tabular-nums sm:text-2xl">
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
              <div className="text-xl font-black tracking-tight tabular-nums sm:text-2xl text-foreground">
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
              <div className="text-xl font-black tracking-tight tabular-nums sm:text-2xl text-foreground">
                {BANK_PREVIEWS.length} Bank
              </div>
              <div className="text-[12px] text-muted-foreground truncate">
                {activeBankCount > 0
                  ? `${activeBankCount} bank aktif di periode ini`
                  : "BCA, Mandiri, BRI, BNI, BSI & 4 lainnya"}
              </div>
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
              <div className="text-[12px] text-muted-foreground">Validasi &amp; Anti-Injeksi CSV</div>
            </div>
          </div>
        </div>

        {/* Period Selector + Interactive Bank Filter & View Mode Toolbar */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Periode Payroll:
              </span>
              <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
                {periods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePeriodChange(p.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer",
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
              className="rounded-xl gap-2 text-xs self-start sm:self-auto cursor-pointer"
              onClick={downloadExcelRecap}
              disabled={!selectedPeriod}
            >
              <FileSpreadsheet className="size-4 text-emerald-600" />
              Download Rekap Master Excel (.csv)
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search & Filter Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari bank atau format..."
                  aria-label="Cari bank mitra"
                  className="h-9 rounded-xl pl-8.5 pr-8 text-xs bg-background"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Hapus pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "all", label: `Semua (${enrichedBanks.length})` },
                  { key: "active", label: `Penerima Aktif (${activeBankCount})` },
                  { key: "csv", label: "Format .CSV" },
                  { key: "txt", label: "Format .TXT" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setBankFilter(tab.key)}
                    aria-pressed={bankFilter === tab.key}
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-semibold transition-all border cursor-pointer",
                      bankFilter === tab.key
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle: Grid / List */}
            <div className="inline-flex items-center gap-1 rounded-xl bg-muted p-1 border border-border/40 self-start lg:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="size-3.5" />
                Kartu
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={cn(
                  "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="size-3.5" />
                Daftar
              </button>
            </div>
          </div>
        </div>

        {/* Bank Formats Section: Clean 2-Row Card Layout (Grid) or Scannable Row Layout (List) */}
        {filteredBanks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center space-y-2">
            <p className="text-sm font-bold text-foreground">
              Tidak ada bank yang cocok dengan filter Anda
            </p>
            <p className="text-xs text-muted-foreground">
              Coba hapus kata kunci pencarian atau pilih tab &quot;Semua&quot;.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 rounded-xl text-xs cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setBankFilter("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBanks.map((bank) => {
              const isDownloading = downloadingFormat === bank.code;
              return (
                <div
                  key={bank.code}
                  className={cn(
                    "group rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4",
                    bank.hasRecipients
                      ? "border-primary/35 ring-1 ring-primary/10"
                      : "border-border/60 hover:border-border"
                  )}
                >
                  <div className="space-y-3.5">
                    {/* Row 1: Crisp Logo Surface + Format & Active Recipient Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-11 min-w-[116px] max-w-[144px] items-center justify-center rounded-xl bg-muted/35 border border-border/40 px-3 py-1.5 shrink-0">
                        {renderBankLogo(bank.code)}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {bank.hasRecipients && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold">
                            <CheckCircle2 className="size-3 shrink-0" />
                            {bank.recipientCount} staf
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] font-mono font-bold uppercase tracking-wide px-2.5"
                        >
                          {bank.ext}
                        </Badge>
                      </div>
                    </div>

                    {/* Row 2: Full-Width Title & Clean Description (Zero Cramped Wrapping) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-[15px] tracking-tight text-foreground leading-snug truncate">
                          {bank.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                          {bank.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {bank.desc}
                      </p>
                    </div>
                  </div>

                  {/* Row 3: Live Disbursement Metadata + Single-Line Download CTA */}
                  <div className="border-t border-border/50 pt-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      {bank.hasRecipients ? (
                        <>
                          <div className="text-xs font-extrabold text-foreground tabular-nums truncate">
                            {formatRupiah(bank.nominalTotal)}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            Siap transfer · {selectedPeriod?.name || "Periode aktif"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-semibold text-muted-foreground truncate">
                            {selectedPeriod ? selectedPeriod.name : "Pilih periode"}
                          </div>
                          <div className="text-[11px] text-muted-foreground/80 truncate">
                            Format batch standar {bank.code}
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant={bank.hasRecipients ? "default" : "outline"}
                      className={cn(
                        "rounded-xl h-9 px-3.5 gap-1.5 text-xs font-bold shrink-0 cursor-pointer",
                        !bank.hasRecipients &&
                          "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      )}
                      disabled={!selectedPeriod || isDownloading}
                      onClick={() => downloadBankFile(bank.code)}
                    >
                      <Download className="size-3.5 shrink-0" />
                      <span>{isDownloading ? "Mengunduh..." : `Unduh ${bank.code}`}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View: Ultra-Scannable Finance Table/Rows */
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm divide-y divide-border/50 overflow-hidden">
            {filteredBanks.map((bank) => {
              const isDownloading = downloadingFormat === bank.code;
              return (
                <div
                  key={bank.code}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/25 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="flex h-11 w-28 items-center justify-center rounded-xl bg-muted/35 border border-border/40 px-2.5 shrink-0">
                      {renderBankLogo(bank.code)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-foreground truncate">
                          {bank.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] font-mono font-bold uppercase"
                        >
                          {bank.ext}
                        </Badge>
                        {bank.hasRecipients && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[10.5px] font-bold">
                            <CheckCircle2 className="size-3" />
                            {bank.recipientCount} staf · {formatRupiah(bank.nominalTotal)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {bank.desc}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={bank.hasRecipients ? "default" : "outline"}
                    className="rounded-xl h-9 px-4 gap-1.5 text-xs font-bold shrink-0 self-end sm:self-center cursor-pointer"
                    disabled={!selectedPeriod || isDownloading}
                    onClick={() => downloadBankFile(bank.code)}
                  >
                    <Download className="size-3.5" />
                    <span>{isDownloading ? "Mengunduh..." : `Unduh Batch ${bank.code}`}</span>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

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
                  <TableHead className="text-xs font-bold text-right">
                    Total Nominal Transfer
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(bankDistribution).length > 0 ? (
                  Object.entries(bankDistribution).map(([bankName, data]) => (
                    <TableRow key={bankName}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-24 items-center justify-center rounded-lg bg-muted/40 border border-border/40 px-2 shrink-0">
                            {renderBankLogo(bankName, "h-4.5 max-w-[78px]")}
                          </div>
                          <span className="font-semibold text-xs text-foreground">
                            {bankName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs tabular-nums">
                        {data.count} Karyawan
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-foreground tabular-nums">
                        {formatRupiah(data.total_amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-6 text-xs text-muted-foreground"
                    >
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
