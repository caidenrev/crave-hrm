import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  ClipboardCheck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  FileText,
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

export default function LeaveApprovals({
  requests = { data: [] },
  departments = [],
  filters = {},
  stats = {},
}) {
  const { flash } = usePage().props;

  const [filterState, setFilterState] = useState({
    status: filters.status || "all",
    department_id: filters.department_id || "all",
    search: filters.search || "",
  });

  // Modal State for Reject Reason
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectLevel, setRejectLevel] = useState("supervisor");
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Modal State for Attachment Preview
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);

  const applyFilters = (newFilters) => {
    const updated = { ...filterState, ...newFilters };
    setFilterState(updated);
    router.get("/leave/approvals", updated, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({});
  };

  const handleApproveSupervisor = (requestId) => {
    if (!confirm("Setujui permohonan cuti ini di tingkat atasan langsung?")) return;
    router.post(
      `/leave/approvals/${requestId}/supervisor`,
      {},
      { preserveScroll: true }
    );
  };

  const handleApproveHr = (requestId) => {
    if (!confirm("Setujui final permohonan cuti ini dan potong kuota cuti karyawan?")) return;
    router.post(
      `/leave/approvals/${requestId}/hr`,
      {},
      { preserveScroll: true }
    );
  };

  const openRejectModal = (request, level = "supervisor") => {
    setRejectingRequest(request);
    setRejectLevel(level);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const submitReject = (e) => {
    e.preventDefault();
    if (!rejectingRequest || !rejectReason.trim()) return;

    setIsRejecting(true);
    router.post(
      `/leave/approvals/${rejectingRequest.id}/reject`,
      {
        reason: rejectReason,
        level: rejectLevel,
      },
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
    <AuthenticatedLayout title="Persetujuan Cuti">
      <Head title="Persetujuan Cuti — Crave HRM" />

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

        {/* Title Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Persetujuan Cuti &amp; Izin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Antrean verifikasi permohonan cuti berjenjang dari Atasan Langsung hingga pengesahan final HR Admin.
          </p>
        </div>

        {/* 4 Top KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <ClipboardCheck className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Antrean Aktif
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.total_pending ?? 0} Pengajuan
              </div>
              <div className="text-[12px] text-white/80">Total Antrean Approval</div>
            </div>
          </div>

          {/* Card 1: Review Atasan Langsung */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Clock className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-amber-600">
                <ArrowUpRight className="size-3.5" />
                Tingkat 1
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.pending_supervisor ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Review Atasan</div>
            </div>
          </div>

          {/* Card 2: Menunggu HR */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <ShieldCheck className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-primary">
                <ArrowUpRight className="size-3.5" />
                Tingkat 2
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.pending_hr ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Finalisasi HR</div>
            </div>
          </div>

          {/* Card 3: Disetujui Bulan Ini */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CheckCircle2 className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                Bulan Ini
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.approved_this_month ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Disetujui &amp; Dipotong Kuota</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="card-soft p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="grid gap-3 sm:grid-cols-2 md:grid-cols-12 md:items-center"
          >
            {/* Search Input */}
            <div className="relative sm:col-span-2 md:col-span-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama karyawan atau NIK..."
                value={filterState.search}
                onChange={(e) => setFilterState((prev) => ({ ...prev, search: e.target.value }))}
                className="rounded-xl pl-9 text-xs"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <Select
                value={filterState.department_id}
                onValueChange={(val) => applyFilters({ department_id: val })}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Departemen" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <Select
                value={filterState.status}
                onValueChange={(val) => applyFilters({ status: val })}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Status Antrean" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Semua Menunggu Approval</SelectItem>
                  <SelectItem value="pending_supervisor">Menunggu Atasan (L1)</SelectItem>
                  <SelectItem value="pending_hr">Menunggu HR (L2)</SelectItem>
                  <SelectItem value="approved">Disetujui Final</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Button type="submit" size="sm" className="w-full rounded-xl text-xs font-bold">
                Cari
              </Button>
            </div>
          </form>
        </div>

        {/* APPROVALS TABLE CARD */}
        <div className="card-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-bold text-foreground">Karyawan</TableHead>
                <TableHead className="font-bold text-foreground">Tipe Cuti</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal &amp; Durasi</TableHead>
                <TableHead className="font-bold text-foreground">Alasan</TableHead>
                <TableHead className="font-bold text-foreground">Status Verifikasi</TableHead>
                <TableHead className="text-center font-bold text-foreground">Lampiran</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!requests.data || requests.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    Tidak ada pengajuan cuti yang memerlukan persetujuan pada filter ini.
                  </TableCell>
                </TableRow>
              ) : (
                requests.data.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/20">
                    {/* Karyawan Cell */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                          {req.employee?.nama_lengkap?.charAt(0) || "K"}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {req.employee?.nama_lengkap || "Karyawan"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {req.employee?.nik} • {req.employee?.department?.name || "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tipe Cuti */}
                    <TableCell>
                      <Badge variant="outline" className="font-semibold rounded-full text-xs">
                        {req.leave_type?.name}
                      </Badge>
                    </TableCell>

                    {/* Tanggal & Durasi */}
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {formatDisplayDate(req.start_date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        s.d. {formatDisplayDate(req.end_date)} ({req.total_days} hari)
                      </div>
                    </TableCell>

                    {/* Alasan */}
                    <TableCell>
                      <div className="max-w-[200px] truncate text-xs text-foreground" title={req.reason}>
                        {req.reason}
                      </div>
                    </TableCell>

                    {/* Status Verifikasi Bertingkat */}
                    <TableCell>
                      <div className="space-y-1">
                        {req.status === "pending_supervisor" && (
                          <Badge variant="secondary" className="rounded-full text-[10px]">
                            <Clock className="mr-1 size-3 text-amber-600" /> Review Atasan Langsung
                          </Badge>
                        )}
                        {req.status === "pending_hr" && (
                          <Badge variant="outline" className="border-primary/50 text-primary font-semibold rounded-full text-[10px]">
                            <ShieldCheck className="mr-1 size-3 text-primary" /> Menunggu HR Admin
                          </Badge>
                        )}
                        {req.status === "approved" && (
                          <Badge variant="default" className="bg-emerald-600 rounded-full text-[10px]">
                            <Check className="mr-1 size-3" /> Disetujui Lengkap
                          </Badge>
                        )}
                        {req.status === "rejected" && (
                          <Badge variant="destructive" className="rounded-full text-[10px]">
                            <X className="mr-1 size-3" /> Ditolak
                          </Badge>
                        )}
                        {req.status === "cancelled" && (
                          <Badge variant="secondary" className="rounded-full text-[10px]">
                            Dibatalkan Karyawan
                          </Badge>
                        )}

                        {req.hr_notes && (
                          <div className="text-[10px] text-muted-foreground">
                            Catatan HR: {req.hr_notes}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Lampiran Bukti */}
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

                    {/* Tindakan Approval */}
                    <TableCell className="text-right">
                      {req.status === "pending_supervisor" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleApproveSupervisor(req.id)}
                            className="h-8 rounded-xl bg-primary text-xs font-semibold shadow-sm"
                          >
                            <Check className="mr-1 size-3.5" /> Setujui (L1)
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRejectModal(req, "supervisor")}
                            className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                          >
                            <X className="mr-1 size-3.5" /> Tolak
                          </Button>
                        </div>
                      )}

                      {req.status === "pending_hr" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleApproveHr(req.id)}
                            className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold shadow-sm"
                          >
                            <Check className="mr-1 size-3.5" /> Setujui Final (HR)
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRejectModal(req, "hr")}
                            className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                          >
                            <X className="mr-1 size-3.5" /> Tolak
                          </Button>
                        </div>
                      )}

                      {!["pending_supervisor", "pending_hr"].includes(req.status) && (
                        <span className="text-xs font-medium text-muted-foreground">
                          Tidak ada aksi
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {requests.links && requests.links.length > 3 && (
            <div className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
              <div>
                Menampilkan {requests.from || 0} - {requests.to || 0} dari {requests.total || 0} pengajuan
              </div>
              <div className="flex items-center gap-1">
                {requests.links.map((link, i) => (
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

      {/* MODAL PENOLAKAN CUTI DENGAN ALASAN */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Penolakan Cuti
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitReject} className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Berikan alasan yang jelas atas penolakan pengajuan cuti ini agar karyawan bersangkutan dapat memahami keputusan manajemen.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alasan Penolakan *</Label>
              <Textarea
                placeholder="Contoh: Jadwal proyek mendesak, atau kuota staf shift tidak mencukupi..."
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
                {isRejecting ? "Menolak..." : "Tolak Permohonan"}
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
                Dokumen terunggah.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
