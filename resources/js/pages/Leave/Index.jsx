import React, { useState, useMemo } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartPulse,
  Plus,
  FileText,
  AlertCircle,
  FileCheck,
  XCircle,
  Eye,
  Trash2,
  Calendar,
  Info,
  Paperclip,
  Check,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
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

export default function LeaveIndex({
  employee,
  leaveTypes = [],
  balances = [],
  requests = { data: [] },
  stats = {},
}) {
  const { flash } = usePage().props;
  const [modalOpen, setModalOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    leave_type_id: leaveTypes[0]?.id ? String(leaveTypes[0].id) : "",
    start_date: "",
    end_date: "",
    reason: "",
    attachment_url: "",
  });

  // Selected leave type details
  const selectedType = useMemo(() => {
    return leaveTypes.find((t) => String(t.id) === String(data.leave_type_id));
  }, [data.leave_type_id, leaveTypes]);

  // Selected balance
  const selectedBalance = useMemo(() => {
    return balances.find((b) => String(b.leave_type_id) === String(data.leave_type_id));
  }, [data.leave_type_id, balances]);

  // Calculate estimated working days locally
  const estimatedDays = useMemo(() => {
    if (!data.start_date || !data.end_date) return 0;
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    if (start > end) return 0;

    let days = 0;
    let cur = new Date(start);
    while (cur <= end) {
      const dayOfWeek = cur.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, days);
  }, [data.start_date, data.end_date]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setData("attachment_url", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/leave", {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        reset();
      },
    });
  };

  const handleCancel = (requestId) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pengajuan cuti ini?")) return;
    router.delete(`/leave/${requestId}`, {
      preserveScroll: true,
    });
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    const str = String(dateStr).substring(0, 10);
    const parts = str.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
    ];
    const mIdx = parseInt(m, 10) - 1;
    return `${parseInt(d, 10)} ${monthNames[mIdx] || m} ${y}`;
  };

  return (
    <AuthenticatedLayout title="Cuti & Izin Saya">
      <Head title="Cuti & Izin Saya — Crave HRM" />

      <div className="space-y-6">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* Title Header with Action Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Cuti &amp; Izin Saya
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola saldo kuota cuti tahunan, ajukan permohonan izin/sakit, dan pantau status persetujuan berjenjang.
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="rounded-xl font-bold shadow-md shadow-primary/20"
          >
            <Plus className="mr-1.5 size-4" /> Ajukan Cuti / Izin
          </Button>
        </div>

        {/* 4 Top KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <CalendarDays className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Kuota 2026
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.annual_remaining ?? 12} Hari
              </div>
              <div className="text-[12px] text-white/80">Sisa Cuti Tahunan</div>
            </div>
          </div>

          {/* Card 1: Cuti Terpakai */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <FileCheck className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                Terpakai
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.annual_used ?? 0} Hari
              </div>
              <div className="text-[12px] text-muted-foreground">Cuti Tahunan Terpakai</div>
            </div>
          </div>

          {/* Card 2: Menunggu Persetujuan */}
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
                {(stats.pending_count || 0) > 0 ? "Dalam Antrean" : "Nihil"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.pending_count ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Persetujuan</div>
            </div>
          </div>

          {/* Card 3: Izin Sakit */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <HeartPulse className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-muted-foreground">
                Terdata
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.sick_used ?? 0} Hari
              </div>
              <div className="text-[12px] text-muted-foreground">Izin Sakit Tercatat</div>
            </div>
          </div>
        </div>

        {/* 2-Column Content: Left = Requests Table (8fr) | Right = Balances & Rules (4fr) */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Column: Requests History Table */}
          <div className="space-y-6 lg:col-span-8">
            <div className="card-soft overflow-hidden">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-bold text-foreground">Riwayat Pengajuan Cuti &amp; Izin</h3>
                  <p className="text-xs text-muted-foreground">
                    Daftar seluruh permohonan cuti dan status verifikasi persetujuan bertingkat
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-bold text-foreground">Tipe Cuti</TableHead>
                    <TableHead className="font-bold text-foreground">Rentang Tanggal</TableHead>
                    <TableHead className="font-bold text-foreground">Durasi</TableHead>
                    <TableHead className="font-bold text-foreground">Alur Persetujuan</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Bukti</TableHead>
                    <TableHead className="text-right font-bold text-foreground">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!requests.data || requests.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                        Belum ada riwayat permohonan cuti yang diajukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.data.map((req) => (
                      <TableRow key={req.id} className="hover:bg-muted/20">
                        {/* Tipe Cuti */}
                        <TableCell>
                          <div className="font-bold text-foreground">
                            {req.leave_type?.name || "Cuti"}
                          </div>
                          <div className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                            {req.reason}
                          </div>
                        </TableCell>

                        {/* Rentang Tanggal */}
                        <TableCell>
                          <div className="font-semibold text-foreground">
                            {formatDisplayDate(req.start_date)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            s.d. {formatDisplayDate(req.end_date)}
                          </div>
                        </TableCell>

                        {/* Durasi Hari Kerja */}
                        <TableCell>
                          <Badge variant="outline" className="rounded-full font-bold text-xs">
                            {req.total_days} Hari Kerja
                          </Badge>
                        </TableCell>

                        {/* Alur Persetujuan Bertingkat */}
                        <TableCell>
                          <div className="space-y-1">
                            {req.status === "pending_supervisor" && (
                              <Badge variant="secondary" className="rounded-full text-[10px]">
                                <Clock className="mr-1 size-3" /> Review Atasan Langsung
                              </Badge>
                            )}
                            {req.status === "pending_hr" && (
                              <Badge variant="outline" className="border-primary/50 text-primary font-semibold rounded-full text-[10px]">
                                <ShieldCheck className="mr-1 size-3" /> Menunggu Finalisasi HR
                              </Badge>
                            )}
                            {req.status === "approved" && (
                              <Badge variant="default" className="bg-emerald-600 rounded-full text-[10px]">
                                <Check className="mr-1 size-3" /> Disetujui Final
                              </Badge>
                            )}
                            {req.status === "rejected" && (
                              <Badge variant="destructive" className="rounded-full text-[10px]">
                                <XCircle className="mr-1 size-3" /> Ditolak
                              </Badge>
                            )}
                            {req.status === "cancelled" && (
                              <Badge variant="secondary" className="rounded-full text-[10px]">
                                Dibatalkan
                              </Badge>
                            )}

                            {/* Catatan Penolakan/Koreksi */}
                            {(req.supervisor_notes || req.hr_notes) && (
                              <div className="text-[10px] text-muted-foreground">
                                Catatan: {req.hr_notes || req.supervisor_notes}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Bukti Lampiran */}
                        <TableCell className="text-center">
                          {req.attachment_url ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setPreviewAttachment(req.attachment_url);
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

                        {/* Aksi Pembatalan */}
                        <TableCell className="text-right">
                          {["pending_supervisor", "pending_hr"].includes(req.status) ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(req.id)}
                              className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="mr-1 size-3.5" /> Batal
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">Selesai</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right Column: Saldo Kuota Cuti & Ketentuan Regulasi */}
          <div className="space-y-6 lg:col-span-4">
            {/* Saldo Kuota Cuti Card */}
            <div className="card-soft p-5">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="size-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Saldo Kuota Cuti 2026</h3>
                  <p className="text-[11px] text-muted-foreground">Status alokasi hak izin kerja</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {balances.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">
                        {b.leave_type?.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Alokasi: {b.total_allocated} hari • Terpakai: {b.used_days} hari
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {Math.max(0, b.remaining_days - b.pending_days)} Hari
                      </div>
                      <div className="text-[10px] text-muted-foreground">Tersisa</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulasi & Ketentuan Cuti Card */}
            <div className="card-soft p-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 border-b pb-3 font-bold text-foreground">
                <Info className="size-4 text-primary" />
                <span>Ketentuan Cuti Ketenagakerjaan</span>
              </div>
              <ul className="mt-3 space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-foreground">Cuti Tahunan:</strong> Kuota resmi 12 hari kerja per tahun kalender.
                </li>
                <li>
                  <strong className="text-foreground">Perhitungan Hari:</strong> Sistem otomatis melewati hari Sabtu, Minggu, dan Libur Nasional resmi (SKB 3 Menteri).
                </li>
                <li>
                  <strong className="text-foreground">Surat Dokter:</strong> Wajib melampirkan foto surat dokter untuk izin sakit &gt; 1 hari.
                </li>
                <li>
                  <strong className="text-foreground">Persetujuan Berjenjang:</strong> Pengajuan diverifikasi oleh Atasan Langsung sebelum disahkan oleh HR Admin.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FORM PENGAJUAN CUTI */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Form Pengajuan Cuti / Izin
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipe Cuti */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tipe Cuti / Izin *</Label>
              <Select
                value={data.leave_type_id}
                onValueChange={(val) => setData("leave_type_id", val)}
              >
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue placeholder="Pilih jenis cuti" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {leaveTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name} ({t.days_allocated > 0 ? `${t.days_allocated} hari/thn` : "Khusus"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leave_type_id && (
                <p className="text-xs text-destructive">{errors.leave_type_id}</p>
              )}
            </div>

            {/* Date Range: Start & End */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tanggal Mulai *</Label>
                <Input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData("start_date", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
                {errors.start_date && (
                  <p className="text-xs text-destructive">{errors.start_date}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tanggal Berakhir *</Label>
                <Input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData("end_date", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
                {errors.end_date && (
                  <p className="text-xs text-destructive">{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Estimasi Hari Kerja Box */}
            {estimatedDays > 0 && (
              <div className="rounded-xl bg-primary/10 p-3 text-xs text-primary flex items-center justify-between">
                <span className="font-semibold">
                  Estimasi Durasi Kerja: <strong>{estimatedDays} Hari Kerja</strong>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  (Melewati weekend &amp; libur nasional)
                </span>
              </div>
            )}

            {/* Alasan Cuti */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alasan / Keterangan Cuti *</Label>
              <Textarea
                placeholder="Tuliskan alasan keperluan cuti atau keterangan izin..."
                value={data.reason}
                onChange={(e) => setData("reason", e.target.value)}
                rows={3}
                className="rounded-xl text-sm"
                required
              />
              {errors.reason && (
                <p className="text-xs text-destructive">{errors.reason}</p>
              )}
            </div>

            {/* Lampiran Surat Dokter (Wajib jika sakit > 1 hari) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Paperclip className="size-3.5" />
                <span>Lampiran Dokumen / Surat Dokter</span>
                {selectedType?.requires_attachment && estimatedDays > 1 && (
                  <span className="text-destructive font-bold text-[10px]">(Wajib)</span>
                )}
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="rounded-xl text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                Format didukung: JPG, PNG, atau PDF (maks. 2MB).
              </p>
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
                {processing ? "Mengirimkan..." : "Kirim Pengajuan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL PRATINJAU DOKUMEN / SURAT DOKTER */}
      <Dialog open={attachmentModalOpen} onOpenChange={setAttachmentModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Bukti Surat Keterangan / Dokumen
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 overflow-hidden rounded-xl border bg-black/5 flex items-center justify-center p-2">
            {previewAttachment?.startsWith("data:image") || previewAttachment?.startsWith("http") ? (
              <img
                src={previewAttachment}
                alt="Dokumen Cuti"
                className="max-h-96 w-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Format dokumen telah terunggah.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
