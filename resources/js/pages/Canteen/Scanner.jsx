import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  ScanBarcode,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  UtensilsCrossed,
  DollarSign,
  Store,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { formatRupiah, formatTanggalId } from "@/lib/formatters";

// Crisp Pos Audio Beep via Web Audio API (Zero external assets needed)
function playBeep(success = true) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (success) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) {
    // Audio context may be blocked prior to interaction
  }
}

export default function Scanner({
  vendors = [],
  recentScans: initialRecentScans = [],
  todayStats,
}) {
  const [selectedVendorId, setSelectedVendorId] = useState(
    todayStats?.selected_vendor_id ? String(todayStats.selected_vendor_id) : vendors[0]?.id ? String(vendors[0].id) : ""
  );

  const [recentScans, setRecentScans] = useState(initialRecentScans);
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRedeemed, setLastRedeemed] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Camera & Video State
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const streamRef = useRef(null);
  const scanLoopRef = useRef(null);

  const selectedVendor = vendors.find((v) => String(v.id) === selectedVendorId) || vendors[0];

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      startBarcodeDetection();
    } catch (err) {
      console.warn("Camera access failed or unavailable:", err);
      setCameraError(
        "Kamera tidak dapat diakses atau diblokir oleh izin browser. Anda dapat menggunakan input kode manual atau barcode scanner USB."
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
    }
    setIsCameraActive(false);
  };

  // Auto detect via BarcodeDetector API if available
  const startBarcodeDetection = () => {
    if (!("BarcodeDetector" in window)) {
      return;
    }

    const barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });

    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0 && !isProcessing) {
            const rawValue = barcodes[0].rawValue;
            handleRedeem(rawValue);
          }
        } catch (e) {
          // ignore detector frame errors
        }
      }
      scanLoopRef.current = requestAnimationFrame(detectFrame);
    };

    scanLoopRef.current = requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle Redemption Request
  const handleRedeem = async (tokenString) => {
    if (!tokenString || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setLastRedeemed(null);

    try {
      const response = await fetch("/canteen/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: tokenString.trim(),
          vendor_id: Number(selectedVendorId),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        playBeep(true);
        setLastRedeemed(data.voucher);
        setManualCode("");
        setRecentScans((prev) => [data.voucher, ...prev]);
      } else {
        playBeep(false);
        setErrorMessage(data.message || "Gagal menebus voucher.");
      }
    } catch (err) {
      playBeep(false);
      setErrorMessage("Terjadi kendala jaringan saat validasi voucher.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleRedeem(manualCode);
  };

  const handleVendorChange = (newVendorId) => {
    setSelectedVendorId(newVendorId);
    router.get(
      "/canteen/scanner",
      { vendor_id: newVendorId },
      { preserveState: true, replace: true }
    );
  };

  // 4 Top KPI Cards - 100% Matching Dashboard.jsx
  const kpiStats = [
    {
      label: "Porsi Ditebus Hari Ini",
      value: `${todayStats?.total_meals ?? 0} Porsi`,
      delta: selectedVendor ? selectedVendor.code : "Kantin",
      up: true,
      icon: UtensilsCrossed,
    },
    {
      label: "Total Klaim Hari Ini",
      value: formatRupiah(todayStats?.total_amount ?? 0),
      delta: "Terverifikasi",
      up: true,
      icon: DollarSign,
    },
    {
      label: "Booth Merchant Aktif",
      value: selectedVendor?.name ? (selectedVendor.name.length > 18 ? selectedVendor.name.slice(0, 18) + "..." : selectedVendor.name) : "Pilih Vendor",
      delta: selectedVendor?.location || "Lantai 1",
      up: true,
      icon: Store,
    },
    {
      label: "Status Pemindai",
      value: isCameraActive ? "Kamera Aktif" : "Standby",
      delta: isCameraActive ? "Siap Scan" : "Offline",
      up: isCameraActive,
      icon: ScanBarcode,
    },
  ];

  return (
    <AuthenticatedLayout
      title="Scanner Merchant"
      subtitle="Antarmuka kasir pemindai QR Code voucher makan karyawan (< 1 detik)"
    >
      <Head title="Scanner Merchant - Crave Canteen" />

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* 1. TOP METRICS CARDS (100% PARITY WITH DASHBOARD.JSX) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {kpiStats.map((s, i) => (
            <div
              key={s.label}
              className={
                "p-3 flex flex-col justify-between rounded-2xl sm:rounded-3xl sm:p-4 " +
                (i === 0 || i === 3 ? "col-span-2 md:col-span-1 " : "") +
                (i === 0
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary"
                  : "bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className={i === 0 ? "text-white" : "text-foreground"}>
                  <s.icon className="size-5 sm:size-6" />
                </span>
                <span
                  className={
                    "flex items-center gap-1 text-[12px] font-bold " +
                    (i === 0
                      ? "text-white"
                      : s.up
                      ? "text-success"
                      : "text-destructive")
                  }
                >
                  {s.up ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
                  {s.delta}
                </span>
              </div>
              <div className="mt-4">
                <p
                  className={
                    "text-xl font-black tracking-tight sm:text-2xl " +
                    (i === 0 ? "text-white" : "text-foreground")
                  }
                >
                  {s.value}
                </p>
                <p
                  className={
                    "text-[13px] font-medium mt-0.5 " +
                    (i === 0
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground")
                  }
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. SCANNER VIEWPORT & INPUT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: SCANNER VIEWFINDER & CONTROLS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-soft p-5 sm:p-6 space-y-4">
              {/* Vendor Selector Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/50 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-foreground shrink-0">
                    <Store className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-foreground truncate">
                      Pilih Kasir Merchant
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Tetapkan booth vendor tempat voucher ditukarkan
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-64 max-w-full min-w-0 shrink-0">
                  <Select
                    value={selectedVendorId}
                    onValueChange={handleVendorChange}
                  >
                    <SelectTrigger className="w-full min-w-0 h-9 rounded-xl text-xs font-bold overflow-hidden">
                      <SelectValue placeholder="Pilih Vendor Kantin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs max-w-xs sm:max-w-sm">
                      {vendors.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          <span className="truncate">{v.name} ({formatRupiah(v.price_per_meal)})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Camera Scanner Viewport */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-white border border-border/50">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Scanner Reticle Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-60 h-60 border-2 border-white/50 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                        {/* 4 Corner Markers */}
                        <div className="absolute top-0 left-0 size-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                        <div className="absolute top-0 right-0 size-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 size-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 size-6 border-b-4 border-r-4 border-primary rounded-br-xl" />

                        {/* Animated Laser Scan Line */}
                        <div className="absolute inset-x-2 h-0.5 bg-primary shadow-[0_0_14px_var(--color-primary)] animate-bounce" />
                      </div>

                      <div className="absolute bottom-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur text-[11px] font-semibold text-white/90">
                        Arahkan kamera ke QR Code voucher karyawan
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center max-w-sm space-y-3">
                    <div className="size-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Camera className="size-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        Kamera Scanner Standby
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Nyalakan kamera HP atau webcam laptop kasir untuk pemindaian sub-detik.
                      </p>
                    </div>
                    <Button
                      onClick={startCamera}
                      className="h-10 px-5 rounded-xl font-extrabold text-xs gap-2"
                    >
                      <Camera className="size-4" />
                      Aktifkan Kamera Scanner
                    </Button>
                  </div>
                )}
              </div>

              {/* Camera Toggle Button & Helper */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-muted-foreground">
                  {cameraError && (
                    <span className="text-destructive font-medium">
                      {cameraError}
                    </span>
                  )}
                </div>

                {isCameraActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopCamera}
                    className="h-8 rounded-xl text-xs gap-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <CameraOff className="size-3.5" />
                    Matikan Kamera
                  </Button>
                )}
              </div>

              {/* Manual Code / USB Barcode Scanner Input */}
              <div className="pt-3 border-t border-border/50">
                <form onSubmit={handleManualSubmit} className="space-y-2">
                  <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <ScanBarcode className="size-4 text-primary" />
                    Input Kode Manual / Barcode Scanner USB
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Scan atau ketik kode token (misal: CRV-QR-...)"
                      className="h-10 rounded-xl text-xs font-mono font-medium"
                      disabled={isProcessing}
                    />
                    <Button
                      type="submit"
                      disabled={isProcessing || !manualCode.trim()}
                      className="h-10 px-5 rounded-xl font-bold text-xs gap-1.5 shrink-0"
                    >
                      {isProcessing ? (
                        <RotateCw className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                      Verifikasi
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tip: Barcode scanner USB fisik langsung mengetik token dan menekan Enter.
                  </p>
                </form>
              </div>
            </div>

            {/* SCAN RESULT POPUP / MODAL FEEDBACK */}
            {lastRedeemed && (
              <div className="card-soft border-success/30 bg-success/5 p-5 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-success font-extrabold text-sm">
                    <CheckCircle2 className="size-5" />
                    Voucher Berhasil Ditebus!
                  </div>
                  <Badge className="bg-success text-success-foreground rounded-full text-xs font-bold">
                    Terverifikasi
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-card border border-border/50">
                  <EmployeeAvatar
                    person={lastRedeemed.employee}
                    name={lastRedeemed.employee?.name}
                    className="size-14 rounded-2xl border border-border/50"
                    fallbackClassName="rounded-2xl bg-success/10 text-success font-black text-sm"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-extrabold text-foreground truncate">
                      {lastRedeemed.employee?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      NIK: {lastRedeemed.employee?.nik} • {lastRedeemed.employee?.department || "Staff"}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="font-bold text-success">
                        {formatRupiah(lastRedeemed.nominal_value)}
                      </span>
                      <span className="text-muted-foreground">
                        Pukul {lastRedeemed.redeemed_at}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground font-mono">
                    Kode: {lastRedeemed.voucher_code}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setLastRedeemed(null)}
                    className="h-8 rounded-xl bg-success hover:bg-success/90 text-success-foreground text-xs font-bold"
                  >
                    Lanjut Scan Berikutnya
                  </Button>
                </div>
              </div>
            )}

            {/* ERROR FEEDBACK */}
            {errorMessage && (
              <div className="card-soft border-destructive/30 bg-destructive/5 p-4 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-destructive font-extrabold text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4.5" />
                    Penolakan Voucher
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setErrorMessage(null)}
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                  >
                    Tutup
                  </Button>
                </div>
                <p className="text-xs text-destructive leading-relaxed font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE SCAN LOG / RECENT SCANS (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card-soft overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Log Penebusan Hari Ini
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Daftar staf yang berhasil diverifikasi
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs font-semibold">
                  {recentScans.length} Scan
                </Badge>
              </div>

              <div className="divide-y divide-border/50 max-h-[580px] overflow-y-auto">
                {recentScans.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    Belum ada voucher yang ditebus di merchant ini hari ini.
                  </div>
                ) : (
                  recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="p-3.5 hover:bg-muted/20 transition-colors flex items-center gap-3"
                    >
                      <EmployeeAvatar
                        person={scan.employee}
                        name={scan.employee?.name}
                        className="size-10 rounded-2xl border border-border/50"
                        fallbackClassName="rounded-2xl text-xs"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-foreground truncate">
                            {scan.employee?.name}
                          </h4>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {scan.redeemed_at}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {scan.employee?.department || "Staff"} • {scan.voucher_code}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {scan.vendor_name || selectedVendor?.name}
                          </span>
                          <span className="font-bold text-success">
                            {formatRupiah(scan.nominal_value)}
                          </span>
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
