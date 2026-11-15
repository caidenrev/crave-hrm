import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, getInitials } from "@/lib/formatters";
import { Printer, ShieldCheck } from "lucide-react";

export default function PayslipModal({ open, onOpenChange, item }) {
  if (!item) return null;

  const employee = item.employee || {};
  const period = item.period || {};

  const handlePrint = () => {
    window.open(`/payroll/slips/${item.id}/print`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-xl md:max-w-2xl max-h-[82vh] flex flex-col p-0 rounded-2xl overflow-hidden shadow-2xl border border-border/80 bg-card"
      >
        {/* Pinned Header */}
        <div className="px-5 py-3.5 border-b shrink-0 bg-card flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-9 shrink-0 border border-border/60">
              {employee.avatar_url && (
                <AvatarImage src={employee.avatar_url} alt={employee.nama_lengkap} />
              )}
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                {getInitials(employee.nama_lengkap)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <h3 className="text-base font-bold tracking-tight text-foreground truncate">
                Slip Gaji Karyawan
              </h3>
              <p className="text-[11px] text-muted-foreground truncate">
                Periode {period.name || "Bulan Berjalan"} &bull; Ref #{item.id}
              </p>
            </div>
          </div>
          <Badge
            variant={item.payment_status === "paid" ? "default" : "secondary"}
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0 mr-7"
          >
            {item.payment_status === "paid" ? "Sudah Dibayar" : "Belum Dibayar"}
          </Badge>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Employee Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-border/50 bg-muted/40 p-3 text-[11px]">
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[10px]">Nama Karyawan</span>
              <p className="font-bold text-foreground mt-0.5 truncate text-xs">
                {employee.nama_lengkap || "-"}
              </p>
              <p className="text-muted-foreground truncate">
                NIK: {employee.nik || "-"}
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[10px]">Departemen / Posisi</span>
              <p className="font-semibold text-foreground mt-0.5 truncate text-xs">
                {employee.department?.name || "-"}
              </p>
              <p className="text-muted-foreground truncate">
                {employee.designation?.name || "-"}
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[10px]">Status Pajak &amp; TER</span>
              <p className="font-semibold text-foreground mt-0.5 truncate text-xs">
                PTKP {item.ptkp_status || "TK/0"}
              </p>
              <p className="text-muted-foreground truncate">
                Kategori {item.ter_category || "A"} ({Number(item.ter_rate || 0).toFixed(2)}%)
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[10px]">Rekening Transfer</span>
              <p className="font-semibold text-foreground mt-0.5 truncate text-xs">
                {employee.bank_name || "Bank"}
              </p>
              <p className="text-muted-foreground truncate">
                {employee.bank_account_number || "-"}
              </p>
            </div>
          </div>

          {/* Breakdown Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Earnings */}
            <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  A. Penghasilan
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">Bruto</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Gaji Pokok</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.gaji_pokok)}
                  </span>
                </div>
                {Number(item.tunjangan_tetap) > 0 && (
                  <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                    <span className="text-muted-foreground">Tunjangan Tetap</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(item.tunjangan_tetap)}
                    </span>
                  </div>
                )}
                {Number(item.tunjangan_tidak_tetap) > 0 && (
                  <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                    <span className="text-muted-foreground">Tunjangan Variabel</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(item.tunjangan_tidak_tetap)}
                    </span>
                  </div>
                )}
                {Number(item.uang_lembur) > 0 && (
                  <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                    <span className="text-muted-foreground">Uang Lembur (PP 35)</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(item.uang_lembur)}
                    </span>
                  </div>
                )}
                {Number(item.reimbursement_total) > 0 && (
                  <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                    <span className="text-muted-foreground">Reimbursement</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(item.reimbursement_total)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center rounded-lg bg-emerald-500/10 p-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                <span>Total Bruto</span>
                <span className="font-bold">{formatRupiah(item.penghasilan_bruto)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  B. Potongan
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">Karyawan</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">
                    PPh 21 TER ({Number(item.ter_rate || 0).toFixed(2)}%)
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.pph21)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">BPJS Kesehatan (1%)</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.bpjs_kes_employee)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">BPJS TK JHT (2%)</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.bpjs_jht_employee)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">BPJS TK JP (1%)</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.bpjs_jp_employee)}
                  </span>
                </div>
                {Number(item.potongan_keterlambatan) > 0 && (
                  <div className="flex justify-between py-0.5 border-t border-dashed border-border/30">
                    <span className="text-muted-foreground">Potongan Absensi</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(item.potongan_keterlambatan)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center rounded-lg bg-rose-500/10 p-2 text-xs font-bold text-rose-700 dark:text-rose-300 mt-2">
                <span>Total Potongan</span>
                <span className="font-bold">{formatRupiah(item.total_potongan)}</span>
              </div>
            </div>
          </div>

          {/* Take Home Pay Banner */}
          <div className="flex items-center justify-between rounded-xl bg-primary p-3.5 text-primary-foreground shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">
                Take Home Pay (Gaji Bersih)
              </span>
              <p className="text-[11px] text-primary-foreground/70 mt-0.5">
                Transfer via {employee.bank_name || "Bank"} {employee.bank_account_number || ""}
              </p>
            </div>
            <div className="text-lg sm:text-xl font-black tracking-tight">
              {formatRupiah(item.take_home_pay)}
            </div>
          </div>

          {/* Benefit Note */}
          <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5 text-[10px] text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-0.5">
              <ShieldCheck className="size-3 text-primary" />
              Manfaat Ditanggung Perusahaan (Employer Contribution):
            </div>
            BPJS Kes (4%): {formatRupiah(item.bpjs_kes_company)} &bull; JKK (0.24%): {formatRupiah(item.bpjs_jkk)} &bull; JKM (0.3%): {formatRupiah(item.bpjs_jkm)} &bull; JHT (3.7%): {formatRupiah(item.bpjs_jht_company)} &bull; JP (2%): {formatRupiah(item.bpjs_jp_company)}
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="px-5 py-3 border-t shrink-0 bg-muted/20 flex flex-row justify-between items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl h-8 px-3 text-xs cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>

          <Button
            type="button"
            size="sm"
            className="rounded-xl h-8 px-3 text-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handlePrint}
          >
            <Printer className="size-3.5" />
            Cetak / Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
