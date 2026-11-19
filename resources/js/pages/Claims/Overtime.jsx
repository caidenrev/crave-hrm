import React, { useState, useMemo } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatRupiah, formatTanggal } from "@/lib/formatters";
import {
  Timer,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calculator,
  Wallet,
  Check,
  X,
  Building2,
  FileText,
  Info,
  Calendar,
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

export default function OvertimeIndex({
  employee,
  overtimes = { data: [] },
  filters = {},
  stats = {},
}) {
  const { flash } = usePage().props;
  const [modalOpen, setModalOpen] = useState(false);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    date: new Date().toISOString().split("T")[0],
    start_time: "17:00",
    end_time: "20:00",
    day_type: "workday",
    task_description: "",
  });

  // Live client-side calculation preview for modal
  const calculationPreview = useMemo(() => {
    if (!data.start_time || !data.end_time) return null;

    const [sh, sm] = data.start_time.split(":").map(Number);
    const [eh, em] = data.end_time.split(":").map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60; // overnight support

    const duration = Math.round(((endMin - startMin) / 60) * 100) / 100;
    if (duration <= 0) return null;

    let remaining = duration;
    let multiplier = 0;

    if (data.day_type === "workday") {
      // Jam pertama 1.5x, jam berikutnya 2x
      if (remaining >= 1.0) {
        multiplier += 1.5;
        remaining -= 1.0;
      } else {
        multiplier += remaining * 1.5;
        remaining = 0;
      }
      if (remaining > 0) {
        multiplier += remaining * 2.0;
      }
    } else {
      // Weekend / Libur: 8 jam pertama 2x, jam 9 3x, jam 10+ 4x
      const first8 = Math.min(remaining, 8.0);
      multiplier += first8 * 2.0;
      remaining -= first8;

      if (remaining > 0) {
        const h9 = Math.min(remaining, 1.0);
        multiplier += h9 * 3.0;
        remaining -= h9;
      }
      if (remaining > 0) {
        multiplier += remaining * 4.0;
      }
    }

    const hourlyRate = stats.hourly_rate || (employee?.gaji_pokok ? Math.round(employee.gaji_pokok / 173) : 0);
    const estimatedPay = Math.round(multiplier * hourlyRate);

    return {
      durationHours: duration,
      multiplierHours: Math.round(multiplier * 100) / 100,
      hourlyRate,
      estimatedPay,
    };
  }, [data.start_time, data.end_time, data.day_type, stats.hourly_rate, employee?.gaji_pokok]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/claims/overtime", {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        reset();
      },
    });
  };

  const handleApprove = (id) => {
    if (!confirm("Setujui pengajuan lembur ini?")) return;
    router.post(`/claims/overtime/${id}/approve`, {}, { preserveScroll: true });
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
      `/claims/overtime/${rejectingItem.id}/reject`,
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
      title="Lembur (SPKL)"
      subtitle="Pengajuan SPKL dan perhitungan upah resmi Depnaker (formula 1/173 & multiplier bertingkat)."
      actions={
        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-xl font-bold shadow-soft text-xs gap-1.5"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Buat Pengajuan SPKL</span>
          <span className="sm:hidden">Buat SPKL</span>
        </Button>
      }
    >
      <Head title="Lembur (SPKL) PP 35/2021 — Crave HRM" />

      <div className="space-y-5">
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

        {/* 4 Top KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <Timer className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Bulan Ini
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.total_hours_month ?? 0} Jam
              </div>
              <div className="text-[12px] text-white/80">Total Jam Lembur Disetujui</div>
            </div>
          </div>

          {/* Card 1: Estimasi Kompensasi */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Wallet className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                PP 35/2021
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatRupiah(stats.total_amount_month || 0)}
              </div>
              <div className="text-[12px] text-muted-foreground">Akumulasi Upah Lembur</div>
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
                {(stats.pending_count || 0) > 0 ? "Perlu Review" : "Nihil"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.pending_count ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Persetujuan SPKL</div>
            </div>
          </div>

          {/* Card 3: Tarif Per Jam */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Calculator className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-muted-foreground">
                1/173 Gaji
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatRupiah(stats.hourly_rate || 0)}
              </div>
              <div className="text-[12px] text-muted-foreground">Tarif Sejam Dasar Anda</div>
            </div>
          </div>
        </div>

        {/* OVERTIME LIST TABLE CARD */}
        <div className="card-soft overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h3 className="font-bold text-foreground">Daftar Pengajuan Lembur (SPKL)</h3>
              <p className="text-xs text-muted-foreground">
                Monitoring pelaksanaan lembur karyawan, jam konversi, dan kalkulasi nominal hak lembur
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-bold text-foreground">Karyawan</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal &amp; Jam</TableHead>
                <TableHead className="font-bold text-foreground">Tipe Hari &amp; Durasi</TableHead>
                <TableHead className="font-bold text-foreground">Kalkulasi Upah (PP 35/2021)</TableHead>
                <TableHead className="font-bold text-foreground">Uraian Tugas / Hasil Kerja</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!overtimes.data || overtimes.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    Belum ada rekaman pengajuan lembur pada periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                overtimes.data.map((item) => (
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
                            {item.employee?.nik} • {item.employee?.department?.name || "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tanggal & Jam */}
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {formatTanggal(item.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)} WIB
                      </div>
                    </TableCell>

                    {/* Tipe Hari & Durasi */}
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={item.day_type === "workday" ? "secondary" : "outline"}
                          className="rounded-full text-[10px]"
                        >
                          {item.day_type === "workday"
                            ? "Hari Kerja Biasa"
                            : item.day_type === "weekend"
                            ? "Akhir Pekan"
                            : "Hari Libur Resmi"}
                        </Badge>
                        <div className="text-xs font-semibold text-foreground">
                          {item.duration_hours} Jam Riil
                        </div>
                      </div>
                    </TableCell>

                    {/* Kalkulasi Upah */}
                    <TableCell>
                      <div className="font-bold text-foreground">
                        {formatRupiah(item.estimated_amount)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Pengali: <strong>{item.multiplier_hours}x jam</strong> (@ {formatRupiah(item.hourly_rate)})
                      </div>
                    </TableCell>

                    {/* Uraian Tugas */}
                    <TableCell>
                      <div className="max-w-[220px] truncate text-xs text-foreground" title={item.task_description}>
                        {item.task_description}
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
                          <Badge variant="default" className="bg-emerald-600 rounded-full text-[10px]">
                            <Check className="mr-1 size-3" /> Disetujui
                          </Badge>
                        )}
                        {item.status === "rejected" && (
                          <Badge variant="destructive" className="rounded-full text-[10px]">
                            <X className="mr-1 size-3" /> Ditolak
                          </Badge>
                        )}
                        {item.rejection_reason && (
                          <div className="text-[10px] text-muted-foreground">
                            Ket: {item.rejection_reason}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Tindakan */}
                    <TableCell className="text-right">
                      {item.status === "pending" ? (
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
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Selesai</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {overtimes.links && overtimes.links.length > 3 && (
            <div className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
              <div>
                Menampilkan {overtimes.from || 0} - {overtimes.to || 0} dari {overtimes.total || 0} pengajuan
              </div>
              <div className="flex items-center gap-1">
                {overtimes.links.map((link, i) => (
                  <Button
                    key={i}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                    className="h-8 rounded-lg px-3 text-xs"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM PENGAJUAN SPKL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Form Pengajuan Lembur (SPKL)
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tanggal Lembur *</Label>
              <Input
                type="date"
                value={data.date}
                onChange={(e) => setData("date", e.target.value)}
                className="rounded-xl text-sm"
                required
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Jam Mulai *</Label>
                <Input
                  type="time"
                  value={data.start_time}
                  onChange={(e) => setData("start_time", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
                {errors.start_time && <p className="text-xs text-destructive">{errors.start_time}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Jam Selesai *</Label>
                <Input
                  type="time"
                  value={data.end_time}
                  onChange={(e) => setData("end_time", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
                {errors.end_time && <p className="text-xs text-destructive">{errors.end_time}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Jenis Hari Lembur *</Label>
              <Select
                value={data.day_type}
                onValueChange={(val) => setData("day_type", val)}
              >
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue placeholder="Pilih jenis hari" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="workday">Hari Kerja Biasa (Jam 1: 1.5x, Jam 2+: 2x)</SelectItem>
                  <SelectItem value="weekend">Hari Istirahat / Akhir Pekan (8 Jam: 2x, Jam 9: 3x, 10+: 4x)</SelectItem>
                  <SelectItem value="holiday">Hari Libur Resmi Nasional</SelectItem>
                </SelectContent>
              </Select>
              {errors.day_type && <p className="text-xs text-destructive">{errors.day_type}</p>}
            </div>

            {/* LIVE CALCULATION SUMMARY CARD */}
            {calculationPreview && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span>Estimasi Durasi Lembur:</span>
                  <span className="text-primary">{calculationPreview.durationHours} Jam Riil</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Konversi Jam PP 35/2021:</span>
                  <span className="font-semibold text-foreground">{calculationPreview.multiplierHours} Jam Upah</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Dasar Tarif Per Jam:</span>
                  <span>{formatRupiah(calculationPreview.hourlyRate)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-primary/20 pt-1.5 font-extrabold text-foreground text-sm">
                  <span>Estimasi Upah Lembur:</span>
                  <span className="text-primary">{formatRupiah(calculationPreview.estimatedPay)}</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Uraian Tugas Lembur &amp; Hasil Kerja *</Label>
              <Textarea
                placeholder="Jelaskan deliverable pekerjaan lembur yang diselesaikan..."
                value={data.task_description}
                onChange={(e) => setData("task_description", e.target.value)}
                rows={3}
                className="rounded-xl text-sm"
                required
              />
              {errors.task_description && (
                <p className="text-xs text-destructive">{errors.task_description}</p>
              )}
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
                {processing ? "Menyimpan..." : "Kirim Pengajuan SPKL"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL PENOLAKAN LEMBUR */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Penolakan Lembur
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitReject} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alasan Penolakan *</Label>
              <Textarea
                placeholder="Berikan alasan penolakan..."
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
                {isRejecting ? "Menolak..." : "Tolak Pengajuan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
