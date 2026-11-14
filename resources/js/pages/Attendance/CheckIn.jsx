import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Navigation,
  Building2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideButton } from "@/components/ui/SlideButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Haversine formula on client for real-time live preview
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function CheckIn({
  employee,
  todayAttendance,
  assignedShift,
  assignedBranch,
  recentAttendances = [],
  stats = {},
}) {
  const { flash } = usePage().props;
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [selfieSnapshot, setSelfieSnapshot] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { data, setData, post, processing, errors } = useForm({
    latitude: null,
    longitude: null,
    selfie_image: "",
    notes: "",
    force_outside: false,
  });

  // Reverse Geocoding Helper: Converts GPS coordinates to specific human-readable address
  const fetchReverseGeocode = async (lat, lng) => {
    setIsResolvingAddress(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            "Accept-Language": "id,en",
          },
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.address) {
          const addr = json.address;
          const road = addr.road || addr.pedestrian || addr.residential || "";
          const area = addr.suburb || addr.village || addr.neighbourhood || addr.quarter || "";
          const district = addr.city_district || addr.district || addr.municipality || "";
          const city = addr.city || addr.town || addr.county || "";
          const state = addr.state || "";

          const parts = [road, area, district, city, state].filter(Boolean);
          if (parts.length > 0) {
            setLocationName(parts.join(", "));
            setIsResolvingAddress(false);
            return;
          }
          if (json.display_name) {
            setLocationName(json.display_name.split(",").slice(0, 4).join(",").trim());
            setIsResolvingAddress(false);
            return;
          }
        }
      }
    } catch (err) {
      // Secondary fallback reverse geocoder
      try {
        const res2 = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
        );
        if (res2.ok) {
          const json2 = await res2.json();
          const road = json2.locality || "";
          const city = json2.city || json2.principalSubdivision || "";
          const country = json2.countryName || "";
          
          let detailedParts = [];
          if (Array.isArray(json2.localityInfo?.administrative)) {
            const admins = json2.localityInfo.administrative
              .filter((a) => a.order >= 4 && a.name)
              .map((a) => a.name);
            detailedParts = [road, ...admins].filter(Boolean);
          }

          const parts2 = detailedParts.length > 1 ? detailedParts : [road, city, country].filter(Boolean);
          if (parts2.length > 0) {
            const uniqueParts = [...new Set(parts2)];
            setLocationName(uniqueParts.join(", "));
            setIsResolvingAddress(false);
            return;
          }
        }
      } catch (err2) {
        // Ignore fallback error
      }
    }

    setLocationName("Lokasi Terdeteksi (Sinyal GPS Aktif)");
    setIsResolvingAddress(false);
  };

  // Calculate live distance to office branch
  const officeLat = assignedBranch?.latitude ? Number(assignedBranch.latitude) : null;
  const officeLng = assignedBranch?.longitude ? Number(assignedBranch.longitude) : null;
  const officeRadius = assignedBranch?.radius_meters || 100;

  const currentDistance =
    coords && officeLat && officeLng
      ? calculateHaversineDistance(coords.latitude, coords.longitude, officeLat, officeLng)
      : null;

  const isWithinGeofence = currentDistance !== null ? currentDistance <= officeRadius : true;

  // Detect location
  const detectLocation = () => {
    setIsDetectingLocation(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError("Geolocation tidak didukung pada peramban Anda.");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setData((prev) => ({
          ...prev,
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
        }));
        fetchReverseGeocode(latitude, longitude);
        setIsDetectingLocation(false);
      },
      (error) => {
        let msg = "Gagal mendeteksi lokasi GPS.";
        if (error.code === 1) msg = "Izin akses lokasi ditolak oleh pengguna.";
        if (error.code === 2) msg = "Posisi GPS tidak dapat ditemukan.";
        if (error.code === 3) msg = "Waktu deteksi lokasi habis (timeout).";
        setGeoError(msg);
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // Camera Controls
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
      setGeoError("Gagal mengakses kamera: " + err.message);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSelfieSnapshot(photoDataUrl);
    setData("selfie_image", photoDataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setSelfieSnapshot(null);
    setData("selfie_image", "");
    startCamera();
  };

  const handleClockIn = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    router.post(
      "/attendance/clock-in",
      {
        ...data,
        notes: data.notes || (locationName ? `Presensi di: ${locationName}` : ""),
        force_outside: data.force_outside || !isWithinGeofence,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          stopCamera();
        },
      }
    );
  };

  const handleClockOut = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    router.post(
      "/attendance/clock-out",
      {
        latitude: data.latitude,
        longitude: data.longitude,
        selfie_image: data.selfie_image,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          stopCamera();
        },
      }
    );
  };

  // Determine current attendance state
  const isClockedIn = Boolean(todayAttendance?.clock_in_time);
  const isClockedOut = Boolean(todayAttendance?.clock_out_time);

  let statusBadgeLabel = "Belum Presensi";
  let statusBadgeVariant = "secondary";
  if (isClockedIn && !isClockedOut) {
    if (todayAttendance?.status === "late") {
      statusBadgeLabel = "Terlambat Masuk";
      statusBadgeVariant = "destructive";
    } else {
      statusBadgeLabel = "Bekerja (Tepat Waktu)";
      statusBadgeVariant = "default";
    }
  } else if (isClockedIn && isClockedOut) {
    statusBadgeLabel = "Selesai Kerja Hari Ini";
    statusBadgeVariant = "secondary";
  }

  return (
    <AuthenticatedLayout title="Presensi Harian">
      <Head title="Presensi Harian — Crave HRM" />

      <div className="space-y-6">
        {/* Header Title Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Presensi Harian
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pencatatan kehadiran kerja resmi dengan verifikasi radius GPS geofence, IP kantor, dan kamera swafoto.
          </p>
        </div>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-3.5 text-xs font-semibold text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* 4 KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <Clock className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <ArrowUpRight className="size-3.5" />
                {todayAttendance ? (todayAttendance.status === "late" ? "Terlambat" : "Tepat Waktu") : "Hari Ini"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight sm:text-2xl">
                {isClockedOut
                  ? "Selesai"
                  : isClockedIn
                  ? todayAttendance?.status === "late"
                    ? "Terlambat"
                    : "Hadir Aktif"
                  : "Belum Masuk"}
              </div>
              <div className="text-[12px] text-white/80">Status Kehadiran Hari Ini</div>
            </div>
          </div>

          {/* Card 1: Jam Masuk */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <CheckCircle2 className="size-5 sm:size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[12px] font-bold",
                  todayAttendance?.status === "late" ? "text-destructive" : "text-success"
                )}
              >
                {todayAttendance?.status === "late" ? (
                  <ArrowDownRight className="size-3.5" />
                ) : (
                  <ArrowUpRight className="size-3.5" />
                )}
                {todayAttendance?.status === "late"
                  ? `Telat ${todayAttendance.late_minutes}m`
                  : todayAttendance?.clock_in_time
                  ? "Tepat Waktu"
                  : "Toleransi 15m"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {todayAttendance?.clock_in_time ? todayAttendance.clock_in_time.substring(0, 5) : "--:--"}
              </div>
              <div className="text-[12px] text-muted-foreground">Jam Masuk (Clock-In)</div>
            </div>
          </div>

          {/* Card 2: Jam Pulang */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <RotateCcw className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                {isClockedOut
                  ? `${Math.floor((todayAttendance.work_duration_minutes || 0) / 60)}j Kerja`
                  : isClockedIn
                  ? "Sedang Bekerja"
                  : "Target 17:00"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {todayAttendance?.clock_out_time ? todayAttendance.clock_out_time.substring(0, 5) : "--:--"}
              </div>
              <div className="text-[12px] text-muted-foreground">Jam Pulang (Clock-Out)</div>
            </div>
          </div>

          {/* Card 3: Kehadiran Bulan Ini */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <TrendingUp className="size-5 sm:size-6" />
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-success">
                <ArrowUpRight className="size-3.5" />
                {stats.avg_hours_worked || 0} jam/hari
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {stats.monthly_present || 0} Hari
              </div>
              <div className="text-[12px] text-muted-foreground">Kehadiran Bulan Ini</div>
            </div>
          </div>
        </div>

        {/* Operational Section: 2 Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Camera + Geofence + Action (col-span-7) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Geofence & Location Card */}
            <div className="card-soft p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Verifikasi Geofence GPS</h3>
                    <p className="text-xs text-muted-foreground">
                      Kantor: {assignedBranch?.name || "Pusat HQ"} (Radius {officeRadius}m)
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="rounded-xl text-xs"
                >
                  <Navigation className={cn("mr-1.5 h-3.5 w-3.5", isDetectingLocation && "animate-spin")} />
                  {isDetectingLocation ? "Mendeteksi..." : "Perbarui Lokasi"}
                </Button>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 rounded-xl bg-muted/40 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Jarak dari Kantor:</div>
                    <div className="text-lg font-black tracking-tight text-foreground">
                      {currentDistance !== null ? `${currentDistance} meter` : "Mencari sinyal GPS..."}
                    </div>
                  </div>
                  <div>
                    {currentDistance !== null ? (
                      isWithinGeofence ? (
                        <Badge variant="default" className="rounded-full bg-emerald-600 px-3 py-1 text-xs">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Dalam Radius Aman Kantor
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">
                          <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Di Luar Radius ({currentDistance}m &gt; {officeRadius}m)
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="rounded-full text-xs">
                        Menunggu Sinyal GPS
                      </Badge>
                    )}
                  </div>
                </div>

                {coords && (
                  <div className="mt-3.5 border-t border-border/40 pt-3">
                    <div className="flex items-start gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <MapPin className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Lokasi Spesifik Anda:
                        </div>
                        <div className="text-sm font-bold text-foreground leading-snug">
                          {isResolvingAddress ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                              <Navigation className="size-3.5 animate-spin text-primary" />
                              Mendeteksi nama jalan & wilayah spesifik...
                            </span>
                          ) : (
                            locationName || "Lokasi Anda berhasil dideteksi"
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="size-3" /> GPS Terhubung
                          </span>
                          <span>•</span>
                          <span>Tujuan Penempatan: <strong className="font-semibold text-foreground">{assignedBranch?.name || "Kantor Pusat"}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {geoError && (
                  <p className="mt-2 text-xs font-medium text-destructive">{geoError}</p>
                )}
              </div>
            </div>

            {/* Selfie Camera Card */}
            <div className="card-soft p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Swafoto Kehadiran (Selfie)</h3>
                    <p className="text-xs text-muted-foreground">
                      Ambil foto selfie di tempat kerja sebagai bukti kehadiran fisik yang valid.
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera Preview Area */}
              <div className="mt-4 flex flex-col items-center justify-center">
                {/* Existing Selfie or Captured Snapshot */}
                {selfieSnapshot ? (
                  <div className="relative overflow-hidden rounded-2xl border bg-black shadow-md">
                    <img
                      src={selfieSnapshot}
                      alt="Selfie Preview"
                      className="h-64 w-80 object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={retakePhoto}
                        className="rounded-xl text-xs shadow"
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Ulangi Foto
                      </Button>
                    </div>
                  </div>
                ) : cameraActive ? (
                  <div className="relative overflow-hidden rounded-2xl border bg-black shadow-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="h-64 w-80 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={capturePhoto}
                        className="rounded-xl bg-primary font-semibold text-primary-foreground shadow"
                      >
                        <Camera className="mr-1.5 h-4 w-4" /> Ambil Foto
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stopCamera}
                        className="rounded-xl bg-background/80 text-xs"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : isClockedIn && todayAttendance?.clock_in_selfie_url ? (
                  <div className="overflow-hidden rounded-2xl border shadow-sm">
                    <img
                      src={todayAttendance.clock_in_selfie_url}
                      alt="Foto Masuk"
                      className="h-56 w-72 object-cover"
                    />
                    <div className="bg-muted p-2 text-center text-xs text-muted-foreground">
                      Foto Check-In Pukul {todayAttendance.clock_in_time}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-56 w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 text-center">
                    <Camera className="h-10 w-10 text-muted-foreground/60" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Kamera saat ini belum aktif. Klik tombol di bawah untuk menyalakan kamera.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startCamera}
                      className="mt-3 rounded-xl text-xs"
                    >
                      <Camera className="mr-1.5 h-3.5 w-3.5" /> Buka Kamera
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Clock In / Clock Out */}
              <div className="mt-6 border-t pt-4">
                {!isClockedIn ? (
                  <div className="space-y-3">
                    {!isWithinGeofence && (
                      <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                        <div>
                          <div className="text-xs font-bold text-foreground">Lokasi di Luar Radius ({currentDistance}m)</div>
                          <div className="text-[11px] text-muted-foreground">Otomatis dicatat sebagai presensi di luar radius / remote</div>
                        </div>
                        <Badge variant="outline" className="border-amber-500/50 text-amber-600 font-bold text-[10px]">
                          Auto-Allow WFH
                        </Badge>
                      </div>
                    )}
                    <Input
                      placeholder="Catatan masuk (opsional, misal: Dinas Luar / WFH)"
                      value={data.notes}
                      onChange={(e) => setData("notes", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                    <div className="pt-1">
                      <SlideButton
                        onConfirm={handleClockIn}
                        title="Presensi Masuk Sekarang"
                        subtitle="Geser ke kanan untuk konfirmasi"
                        confirmedTitle="Presensi Berhasil Dicatat"
                        confirmedSubtitle="Kehadiran Anda terverifikasi"
                        isConfirmed={isClockedIn}
                        isLoading={processing}
                        variant="primary"
                      />
                    </div>
                  </div>
                ) : !isClockedOut ? (
                  <div className="space-y-3">
                    <div className="pt-1">
                      <SlideButton
                        onConfirm={handleClockOut}
                        title="Presensi Pulang Sekarang"
                        subtitle="Geser ke kanan untuk konfirmasi pulang"
                        confirmedTitle="Presensi Pulang Selesai"
                        confirmedSubtitle="Terima kasih atas kerja keras Anda"
                        isConfirmed={isClockedOut}
                        isLoading={processing}
                        variant="destructive"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-muted/50 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                    <div className="mt-2 font-bold text-foreground">
                      Presensi Hari Ini Telah Lengkap
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Masuk: {todayAttendance.clock_in_time} • Pulang: {todayAttendance.clock_out_time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Shift Info & 7 Days Recap (col-span-5) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Shift Information Card */}
            <div className="card-soft p-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Jadwal Shift Anda</h3>
                  <p className="text-xs text-muted-foreground">
                    {assignedShift?.name || "Shift Reguler Standard"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Jam Kerja:</span>
                  <span className="font-semibold text-foreground">
                    {assignedShift ? `${assignedShift.start_time.substring(0, 5)} - ${assignedShift.end_time.substring(0, 5)} WIB` : "08:00 - 17:00 WIB"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Toleransi Keterlambatan:</span>
                  <span className="font-semibold text-foreground">
                    {assignedShift?.late_tolerance_minutes || 15} Menit
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Tipe Shift:</span>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    {assignedShift?.is_flexible ? "Jam Kerja Fleksibel" : "Shift Tetap"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lokasi Penempatan:</span>
                  <span className="font-semibold text-foreground">
                    {assignedBranch?.name || "Semua Cabang"}
                  </span>
                </div>
              </div>
            </div>

            {/* Riwayat 7 Hari Terakhir Card */}
            <div className="card-soft p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-bold text-foreground">Riwayat 7 Hari Terakhir</h3>
                  <p className="text-xs text-muted-foreground">
                    Log kehadiran karyawan terverifikasi
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {recentAttendances.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    Belum ada rekaman presensi dalam 7 hari terakhir.
                  </p>
                ) : (
                  recentAttendances.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-foreground">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          In: {item.clock_in_time ? item.clock_in_time.substring(0, 5) : "--:--"} • Out: {item.clock_out_time ? item.clock_out_time.substring(0, 5) : "--:--"}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={item.status === "late" ? "destructive" : "secondary"}
                          className="rounded-full text-[10px]"
                        >
                          {item.status === "late" ? `Telat ${item.late_minutes}m` : "Tepat Waktu"}
                        </Badge>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {item.geofence_status === "valid_ip" ? "IP Kantor" : "GPS Valid"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
