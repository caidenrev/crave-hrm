import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  ExternalLink,
  HelpCircle,
  History,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SubscriptionIndex({ company, plans, invoices, midtrans }) {
  const [loadingMonths, setLoadingMonths] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetInvoice, setTargetInvoice] = useState(null);
  const [snapReady, setSnapReady] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap JS dynamically if client key is configured
    if (midtrans?.snap_js && midtrans?.client_key && !window.snap) {
      const script = document.createElement("script");
      script.src = midtrans.snap_js;
      script.setAttribute("data-client-key", midtrans.client_key);
      script.async = true;
      script.onload = () => setSnapReady(true);
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else if (window.snap) {
      setSnapReady(true);
    }
  }, [midtrans]);

  const handleCheckout = async (months) => {
    setLoadingMonths(months);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      const res = await fetch("/subscription/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({ months }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat pesanan langganan.");
      }

      // Case 1: Demo / simulation instant renewal without errors
      if (result.is_demo) {
        toast.success(result.message || `Paket langganan ${months} bulan berhasil diaktifkan!`);
        router.reload({ preserveScroll: true });
        setLoadingMonths(null);
        return;
      }

      // Case 2: Midtrans Snap interactive popup
      if (result.snap_token && window.snap) {
        window.snap.pay(result.snap_token, {
          onSuccess: () => {
            toast.success("Pembayaran langganan berhasil diselesaikan!");
            router.reload({ preserveScroll: true });
            setLoadingMonths(null);
          },
          onPending: () => {
            toast.info("Menunggu pembayaran diselesaikan.");
            router.reload({ preserveScroll: true });
            setLoadingMonths(null);
          },
          onError: () => {
            toast.error("Pembayaran dibatalkan atau tidak selesai.");
            setLoadingMonths(null);
          },
          onClose: () => {
            setLoadingMonths(null);
          },
        });
      } else if (result.redirect_url) {
        // Case 3: External payment link redirect
        window.location.href = result.redirect_url;
      } else {
        router.reload({ preserveScroll: true });
        setLoadingMonths(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gagal memproses perpanjangan langganan.");
      setLoadingMonths(null);
    }
  };

  const openCancelInvoiceModal = (inv) => {
    setTargetInvoice(inv);
    setCancelModalOpen(true);
  };

  const submitCancelInvoice = () => {
    if (!targetInvoice) return;
    const orderId = targetInvoice.order_id;
    setCancellingOrderId(orderId);
    router.post(
      "/subscription/cancel-invoice",
      { order_id: orderId },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(`Tagihan ${orderId} berhasil dibatalkan.`);
          setCancelModalOpen(false);
          setTargetInvoice(null);
        },
        onError: () => {
          toast.error("Gagal membatalkan tagihan.");
        },
        onFinish: () => setCancellingOrderId(null),
      }
    );
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const rupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const statusColor = {
    active: "bg-emerald-500",
    trial: "bg-blue-500",
    grace: "bg-amber-500",
    expired: "bg-red-500",
    suspended: "bg-gray-500",
  }[company.state] || "bg-blue-500";

  const statusLabel = {
    active: "Langganan Aktif",
    trial: "Masa Trial Gratis",
    grace: "Masa Tenggang",
    expired: "Masa Aktif Berakhir",
    suspended: "Ditangguhkan",
  }[company.state] || "Trial";

  return (
    <AuthenticatedLayout>
      <Head title="Paket Langganan & Tagihan - Crave HRM" />

      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Langganan & Tagihan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Kelola status paket berlangganan untuk perusahaan{" "}
              <span className="font-bold text-foreground">{company.name}</span>.
            </p>
          </div>
          <Badge variant="outline" className="gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            <span className={`size-2.5 rounded-full ${statusColor}`} />
            {statusLabel}
          </Badge>
        </div>

        {/* Status Card Banner - Minimalist Crave POS Style */}
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Crown className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Paket Saat Ini
                  </span>
                  <Badge variant="secondary" className="text-[11px] font-bold py-0 h-5">
                    {company.plan_name}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {company.state === "trial" ? (
                    <>
                      Masa trial sampai:{" "}
                      <span className="font-bold text-foreground">{company.trial_ends_at || "-"}</span>
                    </>
                  ) : (
                    <>
                      Periode aktif sampai:{" "}
                      <span className="font-bold text-foreground">{company.current_period_end || "-"}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-muted/60 px-3.5 py-2 border border-border/50 text-xs">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground font-medium">Sisa Waktu:</span>
              <span className="font-black text-primary tracking-tight text-sm tabular-nums">
                {company.days_left} Hari
              </span>
            </div>
          </div>

          {company.days_left <= 7 && company.days_left > 0 && (
            <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                Masa aktif tersisa <strong>{company.days_left} hari lagi</strong>. Lakukan perpanjangan sekarang untuk memastikan operasional tidak terganggu.
              </span>
            </div>
          )}

          {company.state === "expired" && (
            <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-800 dark:bg-red-950 dark:text-red-300">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                Masa aktif perusahaan Anda telah berakhir. Pilih salah satu paket di bawah untuk mengaktifkan kembali seluruh modul HRM.
              </span>
            </div>
          )}
        </div>

        {/* Pricing Plans Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              Pilih Paket Perpanjangan Langganan
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Seluruh paket mencakup akses penuh ke 9 modul: Absensi GPS & Selfie, PPh 21 TER 2024, BPJS, ATS Rekrutmen, Voucher Kantin QR, dan Review 360°.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isPopular = p.months === 6;
              const isBestValue = p.months === 12;

              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all bg-card shadow-soft hover:shadow-md ${
                    isPopular ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow">
                      Paling Populer
                    </span>
                  )}
                  {isBestValue && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow">
                      Hemat 25%
                    </span>
                  )}

                  <div>
                    <h3 className="text-base font-black text-foreground">{p.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>

                    <div className="mt-6 mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black tracking-tight text-foreground">
                          {rupiah(p.price)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        untuk durasi {p.months} bulan ({rupiah(Math.round(p.price / p.months))}/bln)
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Kapasitas hingga 50 karyawan aktif</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Perhitungan PPh 21 TER 2024 & BPJS Resmi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Ekspor format Excel XLSX batch bank (BCA, Mandiri, BRI)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Absensi Online Geofence GPS & Radius</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Voucher Kantin Dinamis QR 60 Detik</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <Button
                      className="w-full rounded-xl font-bold text-sm shadow-soft cursor-pointer"
                      variant={isPopular ? "default" : "outline"}
                      disabled={loadingMonths === p.months}
                      onClick={() => handleCheckout(p.months)}
                    >
                      {loadingMonths === p.months ? "Menyiapkan Tagihan..." : "Pilih Paket Ini"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice History */}
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <History className="size-5 text-primary" />
            <h3 className="text-base font-extrabold tracking-tight">Riwayat Pembayaran Perusahaan</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Paket</th>
                  <th className="pb-3 font-bold">Jumlah</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Tanggal</th>
                  <th className="pb-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      Belum ada riwayat transaksi pembayaran.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 font-mono text-xs font-bold">{inv.order_id}</td>
                      <td className="py-3 text-xs">{inv.plan_name}</td>
                      <td className="py-3 font-bold tabular-nums">{rupiah(inv.amount)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            inv.status === "paid"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : inv.status === "pending"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {inv.status === "paid"
                            ? "Lunas"
                            : inv.status === "pending"
                            ? "Menunggu"
                            : inv.status === "cancelled"
                            ? "Dibatalkan"
                            : inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {formatDate(inv.paid_at || inv.created_at)}
                      </td>
                      <td className="py-3 text-right">
                        {inv.status === "pending" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg cursor-pointer transition-colors"
                            disabled={cancellingOrderId === inv.order_id}
                            onClick={() => openCancelInvoiceModal(inv)}
                          >
                            {cancellingOrderId === inv.order_id ? "Membatalkan..." : "Batalkan"}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
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

      {/* MODAL KONFIRMASI PEMBATALAN TAGIHAN */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Pembatalan Tagihan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Apakah Anda yakin ingin membatalkan tagihan pembayaran ini? Tagihan yang telah dibatalkan tidak dapat diproses lagi melalui Midtrans.
            </p>

            {targetInvoice && (
              <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-bold text-foreground">{targetInvoice.order_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paket:</span>
                  <span className="font-semibold">{targetInvoice.plan_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Tagihan:</span>
                  <span className="font-bold text-foreground tabular-nums">{rupiah(targetInvoice.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tanggal Dibuat:</span>
                  <span>{formatDate(targetInvoice.created_at)}</span>
                </div>
              </div>
            )}

            <DialogFooter className="mt-5 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelModalOpen(false)}
                className="rounded-xl text-xs font-medium cursor-pointer"
                disabled={cancellingOrderId === targetInvoice?.order_id}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={cancellingOrderId === targetInvoice?.order_id}
                onClick={submitCancelInvoice}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                {cancellingOrderId === targetInvoice?.order_id ? "Membatalkan..." : "Batalkan Tagihan"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
