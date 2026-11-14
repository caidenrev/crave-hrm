import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { QrCodeDisplay } from "@/components/canteen/QrCodeDisplay";
import {
  UtensilsCrossed,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  History,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRupiah, formatTanggalId } from "@/lib/formatters";

export default function VoucherCard({
  employee,
  todayVoucher: initialVoucher,
  todayAttendance,
  history = [],
  stats,
  vendors = [],
}) {
  const [voucher, setVoucher] = useState(initialVoucher);
  const [token, setToken] = useState(initialVoucher?.encrypted_token || "");
  const [ttlRemaining, setTtlRemaining] = useState(initialVoucher?.ttl_remaining || 60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setVoucher(initialVoucher);
    if (initialVoucher) {
      setToken(initialVoucher.encrypted_token);
      setTtlRemaining(initialVoucher.ttl_remaining || 60);
    }
  }, [initialVoucher]);

  // 60-second dynamic countdown timer
  useEffect(() => {
    if (voucher?.status !== "active") return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTtlRemaining((prev) => {
        if (prev <= 1) {
          handleRefreshToken(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voucher?.status, token]);

  const handleRefreshToken = async (isAuto = false) => {
    if (isRefreshing || voucher?.status !== "active") return;
    setIsRefreshing(true);

    try {
      const response = await fetch("/canteen/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "",
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setToken(data.encrypted_token);
        setTtlRemaining(60);
      }
    } catch (err) {
      console.error("Failed to refresh canteen token:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isRedeemed = voucher?.status === "redeemed";
  const isActive = voucher?.status === "active";
  const progressPercent = Math.max(0, Math.min(100, (ttlRemaining / 60) * 100));

  // 4 Top KPI Cards - 100% Matching Dashboard.jsx
  const kpiStats = [
    {
      label: "Jatah Makan Hari Ini",
      value: isRedeemed ? "Sudah Ditebus" : isActive ? "Aktif Siap Pakai" : "Belum Tersedia",
      delta: isRedeemed ? "Ditebus" : "Subsidi Rp 25rb",
      up: true,
      icon: UtensilsCrossed,
    },
    {
      label: "Voucher Terpakai",
      value: `${stats?.total_redeemed_month ?? 0} Porsi`,
      delta: `+${stats?.total_redeemed_month ?? 0} bln ini`,
      up: true,
      icon: CheckCircle2,
    },
    {
      label: "Total Subsidi Kantor",
      value: formatRupiah(stats?.total_saved_month ?? 0),
      delta: "100% Ditanggung",
      up: true,
      icon: Wallet,
    },
    {
      label: "Hari Kerja WFO",
      value: `${stats?.attendance_wfo_count ?? 0} Hari`,
      delta: "Presensi Hadir",
      up: true,
      icon: Clock,
    },
  ];

  return (
    <AuthenticatedLayout
      title="Voucher QR Saya"
      subtitle="Jatah makan harian karyawan & QR Code dinamis 60 detik"
    >
      <Head title="Voucher QR Saya - Crave Canteen" />

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

        {/* 2. MAIN SECTION: MEAL PASS TICKET + VENDOR LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: THE INTERACTIVE VOUCHER CARD (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card-soft p-5 sm:p-6 overflow-hidden relative">
              {/* Header Card */}
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-foreground shrink-0">
                    <UtensilsCrossed className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground">
                      Crave Meal Pass
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {formatTanggalId(new Date())}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={isRedeemed ? "secondary" : "default"}
                  className="rounded-full text-xs font-bold"
                >
                  {isRedeemed ? "Telah Digunakan" : "Makan Siang"}
                </Badge>
              </div>

              {/* Employee Info Header */}
              <div className="py-4 flex items-center gap-3">
                <Avatar className="size-11 rounded-2xl border border-border/50">
                  <AvatarImage src={employee?.avatar} alt={employee?.name} />
                  <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-xs">
                    {employee?.name ? employee.name.slice(0, 2).toUpperCase() : "CR"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold text-foreground truncate">
                    {employee?.name || "Karyawan Crave"}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    NIK: {employee?.nik || "-"} • {employee?.department || "Operasional"}
                  </p>
                </div>
              </div>

              {/* Ticket Dashed Perforation Line */}
              <div className="border-t border-dashed border-border/70 my-1" />

              {/* QR Display Area */}
              <div className="py-3 flex flex-col items-center justify-center">
                {isRedeemed ? (
                  <div className="w-full py-10 px-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center">
                    <div className="size-14 rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
                      <CheckCircle2 className="size-7" />
                    </div>
                    <div className="text-base font-extrabold text-foreground">
                      Voucher Sukses Ditebus!
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Telah diverifikasi di <span className="font-semibold text-foreground">{voucher?.vendor?.name || "Vendor Kantin"}</span> pada pukul {voucher?.redeemed_at || "-"}.
                    </p>
                    <div className="mt-4 px-3 py-1.5 rounded-xl bg-card border border-border/50 text-[11px] font-mono font-bold text-muted-foreground">
                      Kode: {voucher?.voucher_code}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <QrCodeDisplay value={token} size={220} className="w-56 h-56" />

                    {/* Voucher Code & Security Tag */}
                    <div className="mt-3 text-center">
                      <div className="text-xs font-mono font-black tracking-widest text-foreground">
                        {voucher?.voucher_code || "CRV-MEAL-XXXX"}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        <ShieldCheck className="size-3.5 text-success" />
                        <span>Enkripsi Dinamis Anti-Screenshot</span>
                      </div>
                    </div>

                    {/* TTL Countdown & Progress Bar */}
                    <div className="w-full mt-4 p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                          <Clock className="size-3.5 text-muted-foreground" />
                          Segarkan otomatis dalam:
                        </span>
                        <span className="font-black font-mono text-foreground">
                          {ttlRemaining}s
                        </span>
                      </div>

                      <Progress
                        value={progressPercent}
                        className="h-1.5 bg-muted rounded-full overflow-hidden"
                      />

                      <div className="pt-1 flex items-center justify-between">
                        <p className="text-[11px] text-muted-foreground">
                          Tunjukkan ke kasir merchant kantin
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefreshToken(false)}
                          disabled={isRefreshing}
                          className="h-7 px-2.5 rounded-xl text-xs gap-1.5 font-bold text-primary hover:bg-primary/10"
                        >
                          <RotateCw
                            className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                          />
                          Segarkan Sekarang
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terms of Use */}
            <div className="card-soft p-4 text-xs text-muted-foreground space-y-2">
              <div className="font-extrabold text-foreground flex items-center gap-1.5">
                <AlertCircle className="size-4 text-primary" />
                Ketentuan Jatah Makan:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>Voucher berlaku untuk 1 kali makan siang per hari kerja bagi karyawan WFO.</li>
                <li>QR Code otomatis berganti setiap 60 detik untuk mencegah kecurangan.</li>
                <li>Pindai langsung dari layar ponsel Anda ke kamera kasir stan kantin.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: VENDOR LIST & REDEMPTION HISTORY (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* ACTIVE CANTEEN VENDORS */}
            <div className="card-soft p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Mitra Kantin & Katering
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Tukarkan voucher makan Anda di salah satu booth berikut
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs font-semibold">
                  {vendors.length} Vendor Aktif
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-3.5 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-muted">
                          {vendor.code}
                        </span>
                        <span className="text-xs font-bold text-success">
                          {formatRupiah(vendor.price_per_meal)}
                        </span>
                      </div>
                      <h4 className="mt-2 text-xs font-extrabold text-foreground leading-snug line-clamp-2">
                        {vendor.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1 flex items-center gap-1">
                        <Store className="size-3 shrink-0 text-muted-foreground" />
                        {vendor.location}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Menu Subsidi</span>
                      <span className="text-primary font-bold">Tersedia</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REDEMPTION HISTORY TABLE */}
            <div className="card-soft overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Riwayat Penggunaan Voucher
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Catatan transaksi voucher makan 30 hari terakhir
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0">
                  <History className="size-4" />
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/50">
                    <tr>
                      <th className="py-3 px-4">Tanggal & Waktu</th>
                      <th className="py-3 px-4">Kode Voucher</th>
                      <th className="py-3 px-4">Mitra Kantin</th>
                      <th className="py-3 px-4 text-right">Nilai Subsidi</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Belum ada riwayat penebusan voucher bulan ini.
                        </td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">
                            <div>{item.meal_date}</div>
                            {item.redeemed_at && (
                              <div className="text-[11px] text-muted-foreground">
                                Pukul {item.redeemed_at}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-foreground">
                            {item.voucher_code}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {item.vendor_name || "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-foreground">
                            {formatRupiah(item.nominal_value)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.status === "redeemed" ? (
                              <Badge
                                variant="outline"
                                className="bg-success/10 text-success border-success/30 font-semibold"
                              >
                                Sukses
                              </Badge>
                            ) : item.status === "active" ? (
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/30 font-semibold"
                              >
                                Aktif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                {item.status}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
