import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Building2,
  MapPin,
  Plus,
  Navigation,
  Globe,
  Users,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LocateFixed,
  Radio,
  Sliders,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewToggle } from "@/components/ui/ViewToggle";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function Branches({ branches = [], stats = {} }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    code: "",
    address: "",
    latitude: "",
    longitude: "",
    radius_meters: 100,
    office_ips: [],
    office_ips_raw: "",
    is_active: true,
  });

  const openCreateModal = () => {
    setEditingBranch(null);
    reset();
    setData({
      name: "",
      code: "",
      address: "",
      latitude: "",
      longitude: "",
      radius_meters: 100,
      office_ips: [],
      office_ips_raw: "",
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBranch(b);
    const ips = Array.isArray(b.office_ips) ? b.office_ips : [];
    setData({
      name: b.name,
      code: b.code || "",
      address: b.address || "",
      latitude: b.latitude !== null ? String(b.latitude) : "",
      longitude: b.longitude !== null ? String(b.longitude) : "",
      radius_meters: b.radius_meters || 100,
      office_ips: ips,
      office_ips_raw: ips.join(", "),
      is_active: Boolean(b.is_active),
    });
    setModalOpen(true);
  };

  const handleDetectCurrentGps = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi Geolocation.");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        setData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(7),
          longitude: pos.coords.longitude.toFixed(7),
        }));
      },
      (err) => {
        setDetectingGps(false);
        alert(`Gagal mendeteksi lokasi GPS: ${err.message}. Pastikan izin lokasi browser telah diizinkan.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse office_ips_raw into array
    const parsedIps = data.office_ips_raw
      ? data.office_ips_raw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...data,
      office_ips: parsedIps,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      radius_meters: parseInt(data.radius_meters, 10) || 100,
    };

    if (editingBranch) {
      router.put(`/organization/branches/${editingBranch.id}`, payload, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      router.post("/organization/branches", payload, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const [deletingBranch, setDeletingBranch] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const confirmDelete = (branch) => {
    setDeletingBranch(branch);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!deletingBranch) return;
    router.delete(`/organization/branches/${deletingBranch.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeletingBranch(null);
      },
    });
  };

  const handleToggleActive = (id) => {
    router.patch(`/organization/branches/${id}/toggle-active`, {}, { preserveScroll: true });
  };

  const handleDelete = (id) => {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      confirmDelete(branch);
    } else {
      router.delete(`/organization/branches/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AuthenticatedLayout
      title="Cabang & Geofence"
      subtitle="Konfigurasi lokasi kantor cabang, batas koordinat GPS geofence, dan whitelist IP untuk presensi"
      actions={
        <Button
          onClick={openCreateModal}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm text-xs sm:text-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Tambah Cabang Baru</span>
          <span className="sm:hidden">Tambah Cabang</span>
        </Button>
      }
    >
      <Head title="Cabang & Parameter Geofence" />

      {/* 1. TOP METRICS CARDS (Dashboard-Consistent Signature Look) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 mb-6">
        {/* Card 0: Hero Card */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary">
          <div className="flex items-start justify-between gap-2">
            <span className="text-white">
              <Building2 className="size-5 sm:size-6" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-white">
              <ArrowUpRight className="size-4" />
              Aktif
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-white">
              {stats.total ?? branches.length}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-primary-foreground/80">
              Total Kantor Cabang
            </p>
          </div>
        </div>

        {/* Card 1: Cabang Beroperasi */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <CheckCircle2 className="size-5 sm:size-6 text-emerald-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-success">
              <ArrowUpRight className="size-4" />
              Operasional
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.active ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Cabang Aktif
            </p>
          </div>
        </div>

        {/* Card 2: Geofence Siap Pakai */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Radio className="size-5 sm:size-6 text-blue-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-blue-600">
              <ArrowUpRight className="size-4" />
              GPS Valid
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.with_geofence ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Geofence Siap Pakai
            </p>
          </div>
        </div>

        {/* Card 3: Cabang Nonaktif */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <AlertCircle className="size-5 sm:size-6 text-slate-500" />
            </span>
            <span
              className={
                "flex items-center gap-1 text-[12px] font-bold " +
                ((stats.inactive ?? 0) === 0 ? "text-success" : "text-destructive")
              }
            >
              {(stats.inactive ?? 0) === 0 ? (
                <>
                  <ArrowUpRight className="size-4" />
                  Nihil
                </>
              ) : (
                <>
                  <ArrowDownRight className="size-4" />
                  {stats.inactive} Cabang
                </>
              )}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.inactive ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Cabang Nonaktif
            </p>
          </div>
        </div>
      </div>

      {/* Branches Section Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-extrabold text-foreground">Daftar Kantor Cabang</p>
          <Badge variant="outline" className="rounded-full text-[10px] text-muted-foreground font-semibold">
            {branches.length} Cabang
          </Badge>
        </div>
        <ViewToggle view={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Branches Container: Card View vs List View */}
      {branches.length === 0 ? (
        <Card className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Belum ada kantor cabang terdaftar</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Daftarkan kantor cabang utama atau cabang operasional beserta batas radius geofence untuk sistem presensi cerdas.
          </p>
          <Button
            onClick={openCreateModal}
            className="mt-4 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Tambah Cabang Sekarang
          </Button>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((b) => {
            const hasGps = b.latitude !== null && b.longitude !== null;
            const ips = Array.isArray(b.office_ips) ? b.office_ips : [];

            return (
              <div
                key={b.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between p-5 ${
                  b.is_active
                    ? "border-border/70 bg-card shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-md"
                    : "border-border/40 bg-card/60 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-black tracking-tight text-foreground leading-snug">
                            {b.name}
                          </h4>
                          {b.code && (
                            <Badge variant="outline" className="text-[10px] font-bold rounded-md">
                              {b.code}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 line-clamp-2 leading-relaxed">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span>{b.address || "Alamat kantor belum ditentukan"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={Boolean(b.is_active)}
                        onCheckedChange={() => handleToggleActive(b.id)}
                        title={b.is_active ? "Nonaktifkan Cabang" : "Aktifkan Cabang"}
                      />
                    </div>
                  </div>

                  {/* Geofence Parameters Block */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-2.5 my-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-primary" />
                        Radius Geofence:
                      </span>
                      <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-[11px]">
                        {b.radius_meters || 100} meter
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/40">
                      <span>Koordinat GPS:</span>
                      {hasGps ? (
                        <a
                          href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                          title="Buka di Google Maps"
                        >
                          <span>{Number(b.latitude).toFixed(4)}, {Number(b.longitude).toFixed(4)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-rose-500 italic text-[11px]">Belum diatur</span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <span className="text-muted-foreground block mb-1.5 font-medium">IP Whitelist Kantor:</span>
                      {ips.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {ips.map((ip, i) => (
                            <span
                              key={i}
                              className="font-mono text-[10px] bg-card border border-border/60 px-2 py-0.5 rounded-md text-foreground font-semibold"
                            >
                              {ip}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Semua IP diizinkan (fleksibel)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>{b.employees_count ?? 0} Karyawan</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(b)}
                      className="h-8 rounded-xl px-3 text-xs font-semibold"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(b.id)}
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Hapus Cabang"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-soft overflow-hidden p-0 border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-extrabold text-foreground">Nama & Kode Cabang</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground">Alamat Kantor</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground">Radius</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground">Koordinat</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground">Karyawan</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground text-center">Status</TableHead>
                <TableHead className="text-xs font-extrabold text-foreground text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b) => {
                const hasGps = b.latitude !== null && b.longitude !== null;
                return (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Building2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground">{b.name}</p>
                          {b.code && (
                            <span className="text-[10px] font-mono text-muted-foreground">{b.code}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate py-3">
                      {b.address || "-"}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className="rounded-full text-[10px]">
                        {b.radius_meters || 100}m
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      {hasGps ? (
                        <a
                          href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1"
                        >
                          <span>{Number(b.latitude).toFixed(3)}, {Number(b.longitude).toFixed(3)}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="text-rose-500 italic text-[11px]">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-semibold py-3">
                      {b.employees_count ?? 0} orang
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <Switch
                        checked={Boolean(b.is_active)}
                        onCheckedChange={() => handleToggleActive(b.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(b)}
                          className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(b.id)}
                          className="size-7 rounded-lg text-muted-foreground hover:text-destructive"
                          title="Hapus"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal Dialog Form Create / Edit Branch */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              {editingBranch ? "Edit Kantor Cabang" : "Tambah Cabang Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tentukan koordinat posisi GPS dan batas radius presensi untuk menjamin karyawan check-in tepat di lokasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Nama Cabang / Unit <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Contoh: Kantor Pusat Crave HQ"
                  className="rounded-xl"
                  required
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Kode Cabang
                </label>
                <Input
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                  placeholder="HQ-01"
                  className="rounded-xl uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Alamat Fisik Kantor
              </label>
              <Textarea
                rows={2}
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan..."
                className="rounded-xl resize-none"
              />
            </div>

            {/* Geofence GPS Coordinates Block */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Navigation className="h-4 w-4" />
                  Koordinat Lokasi Geofence GPS
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectCurrentGps}
                  disabled={detectingGps}
                  className="h-7 text-[11px] rounded-lg bg-background text-primary border-primary/30 hover:bg-primary/10"
                >
                  <LocateFixed className="h-3 w-3 mr-1" />
                  {detectingGps ? "Mendeteksi..." : "Deteksi Lokasi Saya"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Latitude (-90 s.d 90)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={data.latitude}
                    onChange={(e) => setData("latitude", e.target.value)}
                    placeholder="-6.2088"
                    className="rounded-xl bg-background font-mono text-xs"
                  />
                  {errors.latitude && <p className="text-xs text-rose-500 mt-1">{errors.latitude}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Longitude (-180 s.d 180)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={data.longitude}
                    onChange={(e) => setData("longitude", e.target.value)}
                    placeholder="106.8456"
                    className="rounded-xl bg-background font-mono text-xs"
                  />
                  {errors.longitude && <p className="text-xs text-rose-500 mt-1">{errors.longitude}</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                  Radius Geofence Aman (Meter)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="10"
                    max="5000"
                    value={data.radius_meters}
                    onChange={(e) => setData("radius_meters", e.target.value)}
                    className="rounded-xl bg-background font-bold w-32"
                  />
                  <span className="text-xs text-muted-foreground">
                    Standar kantor: <strong>100 meter</strong>
                  </span>
                </div>
                {errors.radius_meters && <p className="text-xs text-rose-500 mt-1">{errors.radius_meters}</p>}
              </div>
            </div>

            {/* IP Whitelist Configuration */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block flex items-center justify-between">
                <span>Whitelist IP Publik Kantor (Opsional)</span>
                <span className="text-[11px] text-muted-foreground font-normal">Pisahkan koma jika &gt; 1</span>
              </label>
              <Input
                value={data.office_ips_raw}
                onChange={(e) => setData("office_ips_raw", e.target.value)}
                placeholder="Contoh: 114.122.10.45, 180.252.90.12"
                className="rounded-xl font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Jika diisi, presensi hanya dapat dilakukan oleh perangkat yang terhubung ke jaringan internet kantor tersebut.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
              <div>
                <p className="text-xs font-semibold text-foreground">Status Operasional Cabang</p>
                <p className="text-[11px] text-muted-foreground">Aktifkan untuk mengizinkan penempatan karyawan</p>
              </div>
              <Switch
                checked={data.is_active}
                onCheckedChange={(checked) => setData("is_active", checked)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {processing ? "Menyimpan..." : editingBranch ? "Simpan Perubahan" : "Daftarkan Cabang"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus Kantor Cabang?"
        description={`Apakah Anda yakin ingin menghapus data cabang "${deletingBranch?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={executeDelete}
      />
    </AuthenticatedLayout>
  );
}
