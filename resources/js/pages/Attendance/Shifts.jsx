import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Clock,
  CalendarClock,
  Plus,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Sliders,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
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
import { cn } from "@/lib/utils";

export default function Shifts({
  shifts = [],
  shiftSwaps = [],
  employees = [],
  stats = {},
}) {
  const [activeTab, setActiveTab] = useState("shifts"); // 'shifts' | 'swaps'
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Shift Create/Edit
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  // Modal State for Shift Swap
  const [swapModalOpen, setSwapModalOpen] = useState(false);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingShift, setDeletingShift] = useState(null);

  // Shift Form
  const {
    data: shiftData,
    setData: setShiftData,
    post: postShift,
    put: putShift,
    processing: shiftProcessing,
    reset: resetShift,
    errors: shiftErrors,
  } = useForm({
    name: "",
    code: "",
    start_time: "08:00",
    end_time: "17:00",
    late_tolerance_minutes: 15,
    is_flexible: false,
    is_active: true,
    description: "",
  });

  // Swap Form
  const {
    data: swapData,
    setData: setSwapData,
    post: postSwap,
    processing: swapProcessing,
    reset: resetSwap,
    errors: swapErrors,
  } = useForm({
    target_employee_id: "",
    requested_shift_id: "",
    target_shift_id: "",
    swap_date: "",
    reason: "",
  });

  const openCreateShift = () => {
    setEditingShift(null);
    resetShift();
    setShiftData({
      name: "",
      code: "",
      start_time: "08:00",
      end_time: "17:00",
      late_tolerance_minutes: 15,
      is_flexible: false,
      is_active: true,
      description: "",
    });
    setShiftModalOpen(true);
  };

  const openEditShift = (shift) => {
    setEditingShift(shift);
    setShiftData({
      name: shift.name,
      code: shift.code || "",
      start_time: shift.start_time.substring(0, 5),
      end_time: shift.end_time.substring(0, 5),
      late_tolerance_minutes: shift.late_tolerance_minutes,
      is_flexible: Boolean(shift.is_flexible),
      is_active: Boolean(shift.is_active),
      description: shift.description || "",
    });
    setShiftModalOpen(true);
  };

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    if (editingShift) {
      putShift(`/attendance/shifts/${editingShift.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setShiftModalOpen(false);
          resetShift();
        },
      });
    } else {
      postShift("/attendance/shifts", {
        preserveScroll: true,
        onSuccess: () => {
          setShiftModalOpen(false);
          resetShift();
        },
      });
    }
  };

  const handleToggleShift = (shift) => {
    router.patch(`/attendance/shifts/${shift.id}/toggle-active`, {}, { preserveScroll: true });
  };

  const handleDeleteShift = () => {
    if (!deletingShift) return;
    router.delete(`/attendance/shifts/${deletingShift.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  const handleSwapSubmit = (e) => {
    e.preventDefault();
    postSwap("/attendance/shifts/swap", {
      preserveScroll: true,
      onSuccess: () => {
        setSwapModalOpen(false);
        resetSwap();
      },
    });
  };

  const handleSwapAction = (swap, status) => {
    router.patch(
      `/attendance/shifts/swap/${swap.id}/action`,
      { status },
      { preserveScroll: true }
    );
  };

  // Filter shifts
  const filteredShifts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return shifts;
    return shifts.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q))
    );
  }, [shifts, searchQuery]);

  return (
    <AuthenticatedLayout
      title="Jadwal & Shift"
      subtitle="Pengaturan shift operasional reguler, fleksibel, serta pengajuan & persetujuan tukar shift karyawan."
      actions={
        activeTab === "shifts" ? (
          <Button
            size="sm"
            onClick={openCreateShift}
            className="rounded-xl shadow-soft font-bold text-xs gap-1.5"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Tambah Shift Baru</span>
            <span className="sm:hidden">Tambah Shift</span>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setSwapModalOpen(true)}
            className="rounded-xl shadow-soft font-bold text-xs gap-1.5"
          >
            <ArrowRightLeft className="size-4" />
            <span className="hidden sm:inline">Ajukan Tukar Shift</span>
            <span className="sm:hidden">Tukar Shift</span>
          </Button>
        )
      }
    >
      <Head title="Jadwal & Shift — Crave HRM" />

      <div className="space-y-5">
        {/* 4 KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <CalendarClock className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                {stats.total_shifts || 0} Aktif
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.total_shifts || 0}
              </div>
              <div className="text-[12px] text-white/80">Total Master Shift</div>
            </div>
          </div>

          {/* Card 1: Shift Reguler */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Clock className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                Jam Tetap
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.regular_shifts || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Shift Reguler</div>
            </div>
          </div>

          {/* Card 2: Shift Fleksibel */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Sliders className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                Fleksibel
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.flexible_shifts || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Jam Kerja Fleksibel</div>
            </div>
          </div>

          {/* Card 3: Pengajuan Tukar Shift */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <ArrowRightLeft className="size-5 sm:size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-bold",
                  (stats.pending_swaps || 0) > 0 ? "text-destructive" : "text-success"
                )}
              >
                {(stats.pending_swaps || 0) > 0 ? (
                  <ArrowDownRight className="size-3.5" />
                ) : (
                  <ArrowUpRight className="size-3.5" />
                )}
                {(stats.pending_swaps || 0) > 0 ? "Perlu approval" : "Semua beres"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.pending_swaps || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Tukar Shift Pending</div>
            </div>
          </div>
        </div>

        {/* Tab Selector & Filter Bar */}
        <div className="card-soft p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setActiveTab("shifts")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all",
                  activeTab === "shifts"
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Daftar Master Shift ({shifts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("swaps")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all",
                  activeTab === "swaps"
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Pengajuan Tukar Shift ({shiftSwaps.length})
              </button>
            </div>

            {/* Search (when on shifts tab) */}
            {activeTab === "shifts" && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau kode shift..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl pl-9 text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: MASTER SHIFTS TABLE */}
        {activeTab === "shifts" && (
          <div className="card-soft overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-bold text-foreground">Kode &amp; Nama Shift</TableHead>
                  <TableHead className="font-bold text-foreground">Jam Kerja Operasional</TableHead>
                  <TableHead className="font-bold text-foreground">Toleransi Terlambat</TableHead>
                  <TableHead className="font-bold text-foreground">Tipe Shift</TableHead>
                  <TableHead className="font-bold text-foreground">Karyawan</TableHead>
                  <TableHead className="text-center font-bold text-foreground">Aktif</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      Tidak ada master shift yang sesuai dengan pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShifts.map((shift) => (
                    <TableRow key={shift.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="font-bold text-foreground">{shift.name}</div>
                        {shift.code && (
                          <div className="text-xs text-muted-foreground">Kode: {shift.code}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground">
                          {shift.start_time.substring(0, 5)} - {shift.end_time.substring(0, 5)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground font-medium">
                          {shift.late_tolerance_minutes} Menit
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={shift.is_flexible ? "secondary" : "outline"} className="rounded-full text-xs">
                          {shift.is_flexible ? "Fleksibel" : "Reguler"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{shift.employees_count || 0} Anggota</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={Boolean(shift.is_active)}
                          onCheckedChange={() => handleToggleShift(shift)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditShift(shift)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingShift(shift);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 rounded-lg hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        )}

        {/* TAB 2: SHIFT SWAPS TABLE */}
        {activeTab === "swaps" && (
          <div className="card-soft overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-bold text-foreground">Tanggal Tukar</TableHead>
                  <TableHead className="font-bold text-foreground">Karyawan Pemohon</TableHead>
                  <TableHead className="font-bold text-foreground">Perubahan Jadwal</TableHead>
                  <TableHead className="font-bold text-foreground">Rekan Pengganti</TableHead>
                  <TableHead className="font-bold text-foreground">Alasan</TableHead>
                  <TableHead className="text-center font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftSwaps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      Belum ada permohonan tukar shift yang diajukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftSwaps.map((swap) => (
                    <TableRow key={swap.id} className="hover:bg-muted/20">
                      <TableCell className="font-semibold text-foreground">
                        {new Date(swap.swap_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground">
                          {swap.requester?.nama_lengkap || "Karyawan"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {swap.requester?.department?.name || "Divisi Operasional"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <span className="text-muted-foreground">{swap.requested_shift?.name}</span>
                          <ArrowRightLeft className="h-3 w-3 text-primary" />
                          <span className="font-bold text-foreground">{swap.target_shift?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground">
                          {swap.target_employee?.nama_lengkap || "Karyawan Pengganti"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                        {swap.reason || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            swap.status === "approved"
                              ? "default"
                              : swap.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="rounded-full text-xs"
                        >
                          {swap.status === "approved"
                            ? "Disetujui"
                            : swap.status === "rejected"
                            ? "Ditolak"
                            : "Menunggu"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {swap.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSwapAction(swap, "approved")}
                              className="h-8 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                            >
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSwapAction(swap, "rejected")}
                              className="h-8 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                            >
                              Tolak
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Oleh {swap.approver?.name || "HR"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        )}

        {/* DIALOG: CREATE / EDIT SHIFT */}
        <Dialog open={shiftModalOpen} onOpenChange={setShiftModalOpen}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingShift ? "Edit Master Shift" : "Tambah Shift Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleShiftSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Nama Shift *</label>
                  <Input
                    placeholder="Contoh: Shift Pagi Regular"
                    value={shiftData.name}
                    onChange={(e) => setShiftData("name", e.target.value)}
                    required
                    className="rounded-xl text-xs"
                  />
                  {shiftErrors.name && (
                    <p className="text-[11px] text-destructive">{shiftErrors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Kode</label>
                  <Input
                    placeholder="PAGI"
                    value={shiftData.code}
                    onChange={(e) => setShiftData("code", e.target.value)}
                    className="rounded-xl text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Jam Masuk (Start) *</label>
                  <Input
                    type="time"
                    value={shiftData.start_time}
                    onChange={(e) => setShiftData("start_time", e.target.value)}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Jam Pulang (End) *</label>
                  <Input
                    type="time"
                    value={shiftData.end_time}
                    onChange={(e) => setShiftData("end_time", e.target.value)}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Toleransi Telat (Menit)</label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={shiftData.late_tolerance_minutes}
                    onChange={(e) => setShiftData("late_tolerance_minutes", e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5">
                    <span className="text-xs font-medium">Jam Fleksibel</span>
                    <Switch
                      checked={shiftData.is_flexible}
                      onCheckedChange={(checked) => setShiftData("is_flexible", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Keterangan Tambahan</label>
                <Input
                  placeholder="Keterangan operasional shift..."
                  value={shiftData.description}
                  onChange={(e) => setShiftData("description", e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShiftModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={shiftProcessing}
                  className="rounded-xl text-xs font-bold"
                >
                  {shiftProcessing ? "Menyimpan..." : editingShift ? "Simpan Perubahan" : "Buat Shift"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DIALOG: SUBMIT SHIFT SWAP */}
        <Dialog open={swapModalOpen} onOpenChange={setSwapModalOpen}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Ajukan Tukar Shift Kerja
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSwapSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tanggal Penukaran *</label>
                <Input
                  type="date"
                  value={swapData.swap_date}
                  onChange={(e) => setSwapData("swap_date", e.target.value)}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Rekan Kerja Pengganti *</label>
                <select
                  value={swapData.target_employee_id}
                  onChange={(e) => setSwapData("target_employee_id", e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih rekan kerja pengganti...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nama_lengkap} ({emp.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Shift Anda *</label>
                  <select
                    value={swapData.requested_shift_id}
                    onChange={(e) => setSwapData("requested_shift_id", e.target.value)}
                    required
                    className="w-full rounded-xl border border-input bg-background p-2 text-xs"
                  >
                    <option value="">Pilih shift asal...</option>
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Shift Tujuan *</label>
                  <select
                    value={swapData.target_shift_id}
                    onChange={(e) => setSwapData("target_shift_id", e.target.value)}
                    required
                    className="w-full rounded-xl border border-input bg-background p-2 text-xs"
                  >
                    <option value="">Pilih shift target...</option>
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alasan Tukar Shift *</label>
                <Input
                  placeholder="Misal: Ada keperluan keluarga / tukar hari off..."
                  value={swapData.reason}
                  onChange={(e) => setSwapData("reason", e.target.value)}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSwapModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={swapProcessing}
                  className="rounded-xl text-xs font-bold"
                >
                  {swapProcessing ? "Mengirim..." : "Kirim Pengajuan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* CONFIRM DELETE DIALOG */}
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteShift}
          title="Hapus Master Shift?"
          description={`Apakah Anda yakin ingin menghapus jadwal "${deletingShift?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </AuthenticatedLayout>
  );
}
