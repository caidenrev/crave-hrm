import React, { useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatRupiah, formatTanggal } from "@/lib/formatters";
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wallet,
  Plus,
  Eye,
  Check,
  X,
  CreditCard,
  Building2,
  ArrowUpRight,
  Paperclip,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CATEGORY_MAP = {
  medical: { label: "Medis / Pengobatan", variant: "secondary" },
  transport: { label: "Transportasi", variant: "outline" },
  parking_toll: { label: "Parkir & Tol", variant: "outline" },
  meal: { label: "Konsumsi / Makan Lembur", variant: "secondary" },
  office_supplies: { label: "Alat Kerja & Kantor", variant: "outline" },
  other: { label: "Lain-lain", variant: "secondary" },
};

export default function ReimbursementIndex({
  employee,
  reimbursements = { data: [] },
  filters = {},
  stats = {},
}) {
  const { flash } = usePage().props;
  const [modalOpen, setModalOpen] = useState(false);

  // Attachment Modal
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    category: "transport",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
    receipt_url: "",
    bank_name: employee?.bank_name || "BCA",
    bank_account_number: employee?.bank_account_number || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setData("receipt_url", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/claims/reimbursement", {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        reset();
      },
    });
  };

  const handleApprove = (id) => {
    if (!confirm("Setujui klaim reimbursement ini?")) return;
    router.post(`/claims/reimbursement/${id}/approve`, {}, { preserveScroll: true });
  };

  const handlePay = (id) => {
    if (!confirm("Tandai klaim ini telah berhasil dicairkan (Paid) ke rekening karyawan?")) return;
    router.post(`/claims/reimbursement/${id}/pay`, {}, { preserveScroll: true });
  };

  const openRejectModal = (item) => {
    setRejectingItem(item);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const submitReject = (e) => {
    e.preventDefault();
    if (!rejectingItem || !rejectReason.trim()) return;

    setIsRejecting(true);
    router.post(
      `/claims/reimbursement/${rejectingItem.id}/reject`,
      { reason: rejectReason },
      {
        preserveScroll: true,
        onSuccess: () => {
          setRejectModalOpen(false);
          setIsRejecting(false);
        },
        onError: () => setIsRejecting(false),
      }
    );
  };

  return (
    <AuthenticatedLayout
      title="Reimbursement"
      subtitle="Pengajuan penggantian biaya operasional medis, transport, tol/parkir, dan pratinjau bukti nota transaksi."
      actions={
        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-xl font-bold shadow-soft text-xs gap-1.5"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Ajukan Reimbursement</span>
          <span className="sm:hidden">Ajukan</span>
        </Button>
      }
    >
      <Head title="Reimbursement Biaya & Klaim — Crave HRM" />

      <div className="space-y-5">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* 4 Top KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <Receipt className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Bulan Ini
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {formatRupiah(stats.total_claimed_month || 0)}
              </div>
              <div className="text-[12px] text-white/80">Total Klaim Diajukan</div>
            </div>
          </div>

          {/* Card 1: Telah Dicairkan */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CheckCircle2 className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                Paid
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatRupiah(stats.paid_amount_month || 0)}
              </div>
              <div className="text-[12px] text-muted-foreground">Telah Berhasil Dicairkan</div>
            </div>
          </div>

          {/* Card 2: Menunggu Pencairan */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Clock className="size-5 sm:size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-bold",
                  (stats.pending_count || 0) > 0 ? "text-amber-600" : "text-muted-foreground"
                )}
              >
                {stats.pending_count ?? 0} Klaim
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatRupiah(stats.pending_amount || 0)}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Verifikasi</div>
            </div>
          </div>

          {/* Card 3: Rekening Transfer */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CreditCard className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-primary">
                Tujuan
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-sm font-bold tracking-tight text-foreground sm:text-base truncate">
                {employee?.bank_name || "BCA"} • {employee?.bank_account_number || "Belum diisi"}
              </div>
              <div className="text-[12px] text-muted-foreground">Rekening Penerima Karyawan</div>
            </div>
          </div>
        </div>

        {/* REIMBURSEMENT TABLE CARD */}
        <div className="card-soft overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h3 className="font-bold text-foreground">Daftar Pengajuan Reimbursement</h3>
              <p className="text-xs text-muted-foreground">
                Riwayat klaim pengeluaran kerja dan verifikasi pencairan dana
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-bold text-foreground">Karyawan</TableHead>
                <TableHead className="font-bold text-foreground">Judul &amp; Kategori</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal Nota</TableHead>
                <TableHead className="font-bold text-foreground">Nominal Biaya</TableHead>
                <TableHead className="font-bold text-foreground">Status Pencairan</TableHead>
                <TableHead className="text-center font-bold text-foreground">Bukti Struk</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!reimbursements.data || reimbursements.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    Belum ada rekaman klaim reimbursement pada periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                reimbursements.data.map((item) => {
                  const catCfg = CATEGORY_MAP[item.category] || CATEGORY_MAP.other;
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20">
                      {/* Karyawan */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                            {item.employee?.nama_lengkap?.charAt(0) || "K"}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">
                              {item.employee?.nama_lengkap || "Karyawan"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.bank_name || "BCA"} ({item.bank_account_number || "-"})
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Judul & Kategori */}
                      <TableCell>
                        <div className="font-bold text-foreground truncate max-w-[200px]" title={item.title}>
                          {item.title}
                        </div>
                        <Badge variant={catCfg.variant} className="rounded-full text-[10px] mt-0.5">
                          {catCfg.label}
                        </Badge>
                      </TableCell>

                      {/* Tanggal Nota */}
                      <TableCell>
                        <div className="font-semibold text-foreground">
                          {formatTanggal(item.date)}
                        </div>
                      </TableCell>

                      {/* Nominal */}
                      <TableCell>
                        <div className="font-black text-foreground">
                          {formatRupiah(item.amount)}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div className="space-y-1">
                          {item.status === "pending" && (
                            <Badge variant="secondary" className="rounded-full text-[10px]">
                              <Clock className="mr-1 size-3 text-amber-600" /> Menunggu Review
                            </Badge>
                          )}
                          {item.status === "approved" && (
                            <Badge variant="outline" className="border-primary/50 text-primary font-bold rounded-full text-[10px]">
                              Disetujui (Siap Bayar)
                            </Badge>
                          )}
                          {item.status === "paid" && (
                            <Badge variant="default" className="bg-emerald-600 rounded-full text-[10px]">
                              <Check className="mr-1 size-3" /> Telah Dicairkan
                            </Badge>
                          )}
                          {item.status === "rejected" && (
                            <Badge variant="destructive" className="rounded-full text-[10px]">
                              <X className="mr-1 size-3" /> Ditolak
                            </Badge>
                          )}
                          {item.rejection_reason && (
                            <div className="text-[10px] text-muted-foreground">
                              Alasan: {item.rejection_reason}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Bukti Struk */}
                      <TableCell className="text-center">
                        {item.receipt_url ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPreviewAttachment(item.receipt_url);
                              setAttachmentModalOpen(true);
                            }}
                            className="size-8 rounded-lg"
                          >
                            <Eye className="size-4 text-muted-foreground" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Tindakan */}
                      <TableCell className="text-right">
                        {item.status === "pending" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(item.id)}
                              className="h-8 rounded-xl bg-primary text-xs font-semibold shadow-sm"
                            >
                              <Check className="mr-1 size-3.5" /> Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRejectModal(item)}
                              className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                            >
                              <X className="mr-1 size-3.5" /> Tolak
                            </Button>
                          </div>
                        )}

                        {item.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handlePay(item.id)}
                            className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold shadow-sm"
                          >
                            <DollarSign className="mr-1 size-3.5" /> Cairkan (Paid)
                          </Button>
                        )}

                        {["paid", "rejected"].includes(item.status) && (
                          <span className="text-xs text-muted-foreground font-medium">Selesai</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL FORM PENGAJUAN REIMBURSEMENT */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Form Pengajuan Reimbursement
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Judul Pengeluaran *</Label>
              <Input
                placeholder="Contoh: Tiket Kereta Dinas Bandung, Kuitansi Obat Flu..."
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="rounded-xl text-sm"
                required
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Kategori Biaya *</Label>
                <Select
                  value={data.category}
                  onValueChange={(val) => setData("category", val)}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="medical">Medis / Pengobatan</SelectItem>
                    <SelectItem value="transport">Transportasi / Bensin</SelectItem>
                    <SelectItem value="parking_toll">Parkir &amp; Tol</SelectItem>
                    <SelectItem value="meal">Konsumsi / Makan Lembur</SelectItem>
                    <SelectItem value="office_supplies">Alat Kerja &amp; Kantor</SelectItem>
                    <SelectItem value="other">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tanggal Nota / Struk *</Label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => setData("date", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nominal Biaya (IDR) *</Label>
              <Input
                type="number"
                placeholder="Contoh: 150000"
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                className="rounded-xl text-sm"
                required
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Paperclip className="size-3.5" />
                <span>Foto Struk / Kuitansi Fisik</span>
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="rounded-xl text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                Pastikan tanggal, nama merchant, dan total biaya terlihat jelas pada foto nota.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bank Tujuan Transfer</Label>
                <Input
                  value={data.bank_name}
                  onChange={(e) => setData("bank_name", e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nomor Rekening</Label>
                <Input
                  value={data.bank_account_number}
                  onChange={(e) => setData("bank_account_number", e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Keterangan Tambahan</Label>
              <Textarea
                placeholder="Catatan pelengkap pengeluaran..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows={2}
                className="rounded-xl text-sm"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl text-xs font-bold"
              >
                {processing ? "Mengirimkan..." : "Kirim Klaim Reimbursement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL PRATINJAU STRUK / KUITANSI */}
      <Dialog open={attachmentModalOpen} onOpenChange={setAttachmentModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Bukti Nota / Struk Transaksi
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 overflow-hidden rounded-xl border bg-black/5 flex items-center justify-center p-2">
            {previewAttachment?.startsWith("data:image") || previewAttachment?.startsWith("http") ? (
              <img
                src={previewAttachment}
                alt="Nota Transaksi"
                className="max-h-96 w-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Dokumen struk terlampir.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL PENOLAKAN REIMBURSEMENT */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Penolakan Klaim
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitReject} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alasan Penolakan *</Label>
              <Textarea
                placeholder="Contoh: Struk tidak terbaca, pengeluaran di luar kebijakan perusahaan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="rounded-xl text-sm"
                required
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isRejecting || !rejectReason.trim()}
                className="rounded-xl text-xs font-bold"
              >
                {isRejecting ? "Menolak..." : "Tolak Klaim"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
