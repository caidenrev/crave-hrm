import React, { useState, useRef, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatTanggal } from "@/lib/formatters";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Camera,
  Navigation,
  Eye,
  Check,
  Building2,
  Calendar,
  Briefcase,
  ArrowUpRight,
  RotateCcw,
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function VisitIndex({
  employee,
  visits = { data: [] },
  stats = {},
}) {
  const { flash } = usePage().props;
  const [modalOpen, setModalOpen] = useState(false);

  // Photo & Attachment Modal
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // Live Camera inside Modal
  const [cameraActive, setCameraActive] = useState(false);
  const [photoSnapshot, setPhotoSnapshot] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Geolocation
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationName, setLocationName] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    client_name: "",
    visit_date: new Date().toISOString().split("T")[0],
    check_in_time: new Date().toTimeString().substring(0, 5),
    check_out_time: "",
    latitude: null,
    longitude: null,
    location_name: "",
    purpose: "",
    notes: "",
    selfie_url: "",
  });

  // Reverse geocode GPS to address
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "id,en" } }
      );
      if (res.ok) {
        const json = await res.json();
        if (json?.display_name) {
          const cleanName = json.display_name.split(",").slice(0, 3).join(", ").trim();
          setLocationName(cleanName);
          setData("location_name", cleanName);
          return;
        }
      }
    } catch (err) {
      // Fallback
    }
    const fallback = `Lokasi GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setLocationName(fallback);
    setData("location_name", fallback);
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (!navigator.geolocation) {
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        fetchAddress(lat, lng);
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current || document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoSnapshot(photoDataUrl);
    setData("selfie_url", photoDataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhotoSnapshot(null);
    setData("selfie_url", "");
    startCamera();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    detectLocation();
  };

  const handleCloseModal = () => {
    stopCamera();
    setPhotoSnapshot(null);
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/claims/visit", {
      preserveScroll: true,
      onSuccess: () => {
        handleCloseModal();
        reset();
      },
    });
  };

  const handleVerify = (id) => {
    if (!confirm("Verifikasi laporan kunjungan klien ini?")) return;
    router.post(`/claims/visit/${id}/verify`, {}, { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout
      title="Tugas Lapangan / Visit"
      subtitle="Pencatatan aktivitas dinas luar kantor, check-in lokasi klien dengan geotagging GPS, dan bukti swafoto kerja."
      actions={
        <Button
          size="sm"
          onClick={handleOpenModal}
          className="rounded-xl font-bold shadow-soft text-xs gap-1.5"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Check-In Visit Klien</span>
          <span className="sm:hidden">Check-In Visit</span>
        </Button>
      }
    >
      <Head title="Tugas Lapangan & Kunjungan Klien — Crave HRM" />

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
                <MapPin className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                Bulan Ini
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {stats.total_visits_month ?? 0} Lokasi
              </div>
              <div className="text-[12px] text-white/80">Total Kunjungan Lapangan</div>
            </div>
          </div>

          {/* Card 1: Telah Terverifikasi */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CheckCircle2 className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                Dikonfirmasi
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.verified_count ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Kunjungan Terverifikasi</div>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Clock className="size-5 sm:size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-bold",
                  (stats.completed_count || 0) > 0 ? "text-amber-600" : "text-muted-foreground"
                )}
              >
                {(stats.completed_count || 0) > 0 ? "Menunggu" : "Nihil"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.completed_count ?? 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Menunggu Verifikasi Atasan</div>
            </div>
          </div>

          {/* Card 3: Geotagging GPS */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Navigation className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-primary">
                Akurat
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                Geotagging Aktif
              </div>
              <div className="text-[12px] text-muted-foreground">Radius GPS &amp; Foto Selfie</div>
            </div>
          </div>
        </div>

        {/* VISITS TABLE CARD */}
        <div className="card-soft overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h3 className="font-bold text-foreground">Log Aktivitas Kunjungan Lapangan</h3>
              <p className="text-xs text-muted-foreground">
                Rekaman check-in geotagged lokasi klien, tujuan pekerjaan, dan verifikasi atasan
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-bold text-foreground">Klien / Mitra</TableHead>
                <TableHead className="font-bold text-foreground">Staf Lapangan</TableHead>
                <TableHead className="font-bold text-foreground">Tanggal &amp; Waktu</TableHead>
                <TableHead className="font-bold text-foreground">Lokasi Geotagging</TableHead>
                <TableHead className="font-bold text-foreground">Tujuan Kunjungan</TableHead>
                <TableHead className="text-center font-bold text-foreground">Swafoto</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!visits.data || visits.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    Belum ada rekaman tugas lapangan / visit pada periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                visits.data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    {/* Klien */}
                    <TableCell>
                      <div className="font-bold text-foreground">
                        {item.client_name}
                      </div>
                      {item.notes && (
                        <div className="max-w-[180px] truncate text-xs text-muted-foreground" title={item.notes}>
                          {item.notes}
                        </div>
                      )}
                    </TableCell>

                    {/* Staf Lapangan */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {item.employee?.nama_lengkap?.charAt(0) || "K"}
                        </div>
                        <div className="font-semibold text-foreground text-xs">
                          {item.employee?.nama_lengkap || "Karyawan"}
                        </div>
                      </div>
                    </TableCell>

                    {/* Tanggal & Waktu */}
                    <TableCell>
                      <div className="font-semibold text-foreground text-xs">
                        {formatTanggal(item.visit_date)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Pukul {item.check_in_time ? item.check_in_time.substring(0, 5) : "--:--"} WIB
                      </div>
                    </TableCell>

                    {/* Lokasi GPS */}
                    <TableCell>
                      <div className="max-w-[180px] truncate text-xs font-medium text-foreground flex items-center gap-1" title={item.location_name}>
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">{item.location_name || "Koordinat GPS"}</span>
                      </div>
                    </TableCell>

                    {/* Tujuan */}
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {item.purpose}
                      </Badge>
                    </TableCell>

                    {/* Swafoto */}
                    <TableCell className="text-center">
                      {item.selfie_url ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPreviewPhoto(item.selfie_url);
                            setPhotoModalOpen(true);
                          }}
                          className="size-8 rounded-lg"
                        >
                          <Eye className="size-4 text-muted-foreground" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {item.status === "verified" ? (
                        <Badge variant="default" className="bg-emerald-600 rounded-full text-[10px]">
                          <Check className="mr-1 size-3" /> Terverifikasi
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          <Clock className="mr-1 size-3 text-amber-600" /> Selesai Lapangan
                        </Badge>
                      )}
                    </TableCell>

                    {/* Tindakan */}
                    <TableCell className="text-right">
                      {item.status === "completed" ? (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(item.id)}
                          className="h-8 rounded-xl bg-primary text-xs font-semibold shadow-sm"
                        >
                          <Check className="mr-1 size-3.5" /> Verifikasi
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Verified</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL CHECK-IN VISIT LAPANGAN */}
      <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Check-In Kunjungan Lapangan
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Klien / Mitra / Instansi *</Label>
              <Input
                placeholder="Contoh: PT Sumber Makmur, Cafe Senja BSD..."
                value={data.client_name}
                onChange={(e) => setData("client_name", e.target.value)}
                className="rounded-xl text-sm"
                required
              />
              {errors.client_name && <p className="text-xs text-destructive">{errors.client_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tanggal Kunjungan *</Label>
                <Input
                  type="date"
                  value={data.visit_date}
                  onChange={(e) => setData("visit_date", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Jam Tiba (Check-In) *</Label>
                <Input
                  type="time"
                  value={data.check_in_time}
                  onChange={(e) => setData("check_in_time", e.target.value)}
                  className="rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* GPS GEOTAGGING BOX */}
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Navigation className="size-4 text-primary" /> Geotagging Posisi GPS
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="h-7 rounded-lg text-[10px]"
                >
                  {isDetectingLocation ? "Mendeteksi..." : "Perbarui GPS"}
                </Button>
              </div>
              <div className="text-xs text-foreground font-semibold">
                {data.location_name || locationName || "Mendeteksi koordinat GPS..."}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tujuan Kunjungan *</Label>
              <Input
                placeholder="Contoh: Demo Crave POS, Maintenance Sistem, Kick-off Proyek..."
                value={data.purpose}
                onChange={(e) => setData("purpose", e.target.value)}
                className="rounded-xl text-sm"
                required
              />
              {errors.purpose && <p className="text-xs text-destructive">{errors.purpose}</p>}
            </div>

            {/* LIVE CAMERA SELFIE AREA */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Swafoto (Selfie) di Lokasi Klien</Label>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 flex flex-col items-center justify-center">
                {photoSnapshot ? (
                  <div className="relative overflow-hidden rounded-xl border bg-black shadow-sm">
                    <img
                      src={photoSnapshot}
                      alt="Selfie Preview"
                      className="h-44 w-60 object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={retakePhoto}
                        className="rounded-lg text-xs"
                      >
                        <RotateCcw className="mr-1 size-3" /> Ulangi Foto
                      </Button>
                    </div>
                  </div>
                ) : cameraActive ? (
                  <div className="relative overflow-hidden rounded-xl border bg-black shadow-sm">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="h-44 w-60 object-cover"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={takeSnapshot}
                        className="rounded-lg text-xs font-bold"
                      >
                        <Camera className="mr-1 size-3" /> Ambil Foto
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={startCamera}
                      className="rounded-xl text-xs"
                    >
                      <Camera className="mr-1.5 size-3.5" /> Buka Kamera Selfie
                    </Button>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Ambil foto bersama klien atau di depan kantor klien sebagai bukti kehadiran fisik.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Catatan / Ringkasan Hasil Pertemuan</Label>
              <Textarea
                placeholder="Rangkuman hasil meeting, poin tindak lanjut..."
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                rows={2}
                className="rounded-xl text-sm"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl text-xs font-bold"
              >
                {processing ? "Menyimpan..." : "Simpan Laporan Visit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL PRATINJAU FOTO VISIT */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Bukti Swafoto Kunjungan Lapangan
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 overflow-hidden rounded-xl border bg-black/5 flex items-center justify-center p-2">
            {previewPhoto ? (
              <img
                src={previewPhoto}
                alt="Foto Lapangan"
                className="max-h-96 w-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Foto tidak ditemukan.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
