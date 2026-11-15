import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatTanggal, getInitials } from "@/lib/formatters";
import {
  FileText,
  Printer,
  Building2,
  User,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function PayslipModal({ open, onOpenChange, item }) {
  if (!item) return null;

  const employee = item.employee || {};
  const period = item.period || {};

  const handlePrint = () => {
    window.open(`/payroll/slips/${item.id}/print`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 shrink-0 border border-border/60">
                {employee.avatar_url && (
                  <AvatarImage src={employee.avatar_url} alt={employee.nama_lengkap} />
                )}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                  {getInitials(employee.nama_lengkap)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                  Slip Gaji Karyawan
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Periode {period.name || "Bulan Berjalan"} &bull; Ref #{item.id}
                </p>
              </div>
            </div>
            <Badge
              variant={item.payment_status === "paid" ? "default" : "secondary"}
              className="rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
            >
              {item.payment_status === "paid" ? "Sudah Dibayar" : "Belum Dibayar"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Employee Summary Card */}
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/40 p-4 text-xs">
          <div>
            <span className="text-muted-foreground">Nama Karyawan</span>
            <p className="font-bold text-foreground text-sm mt-0.5">
              {employee.nama_lengkap || "-"}
            </p>
            <p className="text-muted-foreground mt-0.5">
              NIK: {employee.nik || "-"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Departemen / Jabatan</span>
            <p className="font-semibold text-foreground mt-0.5">
              {employee.department?.name || "-"}
            </p>
            <p className="text-muted-foreground mt-0.5">
              {employee.designation?.name || "-"}
            </p>
          </div>
          <div className="border-t border-border/40 pt-2">
            <span className="text-muted-foreground">Status Pajak &amp; TER</span>
            <p className="font-semibold text-foreground mt-0.5">
              PTKP {item.ptkp_status || "TK/0"} &bull; Kategori {item.ter_category || "A"} ({Number(item.ter_rate || 0).toFixed(2)}%)
            </p>
          </div>
          <div className="border-t border-border/40 pt-2">
            <span className="text-muted-foreground">Rekening Transfer</span>
            <p className="font-semibold text-foreground mt-0.5">
              {employee.bank_name || "Bank"} &bull; {employee.bank_account_number || "-"}
            </p>
          </div>
        </div>

        {/* Breakdown Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                A. Penghasilan
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Bruto</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Gaji Pokok</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(item.gaji_pokok)}
                </span>
              </div>
              {Number(item.tunjangan_tetap) > 0 && (
                <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">Tunjangan Tetap</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.tunjangan_tetap)}
                  </span>
                </div>
              )}
              {Number(item.tunjangan_tidak_tetap) > 0 && (
                <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">Tunjangan Variabel</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.tunjangan_tidak_tetap)}
                  </span>
                </div>
              )}
              {Number(item.uang_lembur) > 0 && (
                <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">Uang Lembur (PP 35/2021)</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.uang_lembur)}
                  </span>
                </div>
              )}
              {Number(item.reimbursement_total) > 0 && (
                <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">Reimbursement</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.reimbursement_total)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center rounded-lg bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-3">
              <span>Total Bruto</span>
              <span className="font-bold">{formatRupiah(item.penghasilan_bruto)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                B. Potongan
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Karyawan</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">
                  PPh 21 TER ({Number(item.ter_rate || 0).toFixed(2)}%)
                </span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(item.pph21)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                <span className="text-muted-foreground">BPJS Kesehatan (1%)</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(item.bpjs_kes_employee)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                <span className="text-muted-foreground">BPJS TK JHT (2%)</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(item.bpjs_jht_employee)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                <span className="text-muted-foreground">BPJS TK JP (1%)</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(item.bpjs_jp_employee)}
                </span>
              </div>
              {Number(item.potongan_keterlambatan) > 0 && (
                <div className="flex justify-between py-1 border-t border-dashed border-border/30">
                  <span className="text-muted-foreground">Potongan Absensi</span>
                  <span className="font-semibold text-foreground">
                    {formatRupiah(item.potongan_keterlambatan)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center rounded-lg bg-rose-500/10 p-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 mt-3">
              <span>Total Potongan</span>
              <span className="font-bold">{formatRupiah(item.total_potongan)}</span>
            </div>
          </div>
        </div>

        {/* Take Home Pay Banner */}
        <div className="flex items-center justify-between rounded-xl bg-primary p-4 text-primary-foreground shadow-md">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
              Take Home Pay (Gaji Bersih)
            </span>
            <p className="text-xs text-primary-foreground/70 mt-0.5">
              Transfer ke {employee.bank_name || "Bank"} {employee.bank_account_number || ""}
            </p>
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight">
            {formatRupiah(item.take_home_pay)}
          </div>
        </div>

        {/* Benefit Note */}
        <div className="rounded-xl border border-border/40 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
            <ShieldCheck className="size-3.5 text-primary" />
            Manfaat Ditanggung Perusahaan (Employer Contribution):
          </div>
          BPJS Kes (4%): {formatRupiah(item.bpjs_kes_company)} &bull; JKK (0.24%): {formatRupiah(item.bpjs_jkk)} &bull; JKM (0.3%): {formatRupiah(item.bpjs_jkm)} &bull; JHT (3.7%): {formatRupiah(item.bpjs_jht_company)} &bull; JP (2%): {formatRupiah(item.bpjs_jp_company)}
        </div>

        <DialogFooter className="flex flex-row justify-between items-center border-t pt-4 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>

          <Button
            type="button"
            size="sm"
            className="rounded-xl gap-1.5"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            Cetak / Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
