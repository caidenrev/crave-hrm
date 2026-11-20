import { Head, router } from "@inertiajs/react";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Edit2,
  ExternalLink,
  Layers,
  Save,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FounderShell, PageHeader } from "@/components/founder/FounderShell";
import { Tile, TileTitle, rupiah } from "@/components/founder/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FounderSettings({ plans, midtrans }) {
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleStartEdit = (plan) => {
    setEditingPlanId(plan.id);
    setFormData({
      price: plan.price,
      discount_pct: plan.discount_pct || 0,
      description: plan.description || "",
    });
  };

  const handleSavePlan = (planId) => {
    router.put(`/founder/plans/${planId}`, formData, {
      onSuccess: () => {
        setEditingPlanId(null);
        toast.success("Harga paket langganan berhasil diperbarui!");
      },
      onError: () => {
        toast.error("Gagal memperbarui harga paket.");
      },
    });
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(midtrans.webhook_url);
    toast.success("Webhook URL berhasil disalin!");
  };

  return (
    <FounderShell>
      <Head title="Founder Console - Pengaturan & Paket" />

      <PageHeader
        title="Pengaturan Paket & Gateway"
        subtitle="Atur harga langganan bulanan dan koneksi Midtrans Payment Gateway."
      />

      <div className="space-y-6">
        {/* Midtrans Gateway Status */}
        <Tile>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  midtrans.is_configured
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                }`}
              >
                <CreditCard className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold tracking-tight">Midtrans Snap Gateway</h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      midtrans.is_configured
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        midtrans.is_configured ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {midtrans.is_configured ? "Terkonfigurasi" : "Mode Demo / Belum Diisi"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mendukung QRIS, GoPay, ShopeePay, Transfer Bank (BCA, Mandiri, BNI, BRI), dan Kartu Kredit.
                </p>
              </div>
            </div>
            <a
              href="https://dashboard.midtrans.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Buka Dashboard Midtrans <ExternalLink className="size-3.5" />
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">Notification Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={midtrans.webhook_url}
                  className="rounded-xl font-mono text-xs bg-muted/30"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyWebhook}
                  className="rounded-xl shrink-0 text-xs font-bold"
                >
                  <Copy className="size-3.5 mr-1" /> Salin
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tempelkan URL ini di Midtrans Dashboard &gt; Settings &gt; Configuration &gt; Payment Notification URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">Midtrans Client Key</Label>
              <Input
                readOnly
                value={midtrans.client_key || "Belum diisi di .env"}
                className="rounded-xl font-mono text-xs bg-muted/30"
              />
              <p className="text-[11px] text-muted-foreground">
                Kunci publik untuk memuat widget popup Midtrans Snap.
              </p>
            </div>
          </div>
        </Tile>

        {/* Subscription Plans Pricing */}
        <Tile>
          <TileTitle
            title="Daftar Paket Langganan Tenant"
            hint="Sesuaikan tarif berlangganan untuk perusahaan baru atau perpanjangan."
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isEditing = editingPlanId === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border p-5 bg-card flex flex-col justify-between shadow-soft transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {p.label}
                      </span>
                      {p.discount_pct > 0 && (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                          Diskon {p.discount_pct}%
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label className="text-xs">Harga (Rp)</Label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: e.target.value })
                            }
                            className="rounded-xl text-xs mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Diskon (%)</Label>
                          <Input
                            type="number"
                            value={formData.discount_pct}
                            onChange={(e) =>
                              setFormData({ ...formData, discount_pct: e.target.value })
                            }
                            className="rounded-xl text-xs mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Deskripsi</Label>
                          <Input
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            className="rounded-xl text-xs mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-3 text-2xl font-black tracking-tight text-foreground">
                          {rupiah(p.price)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.months} Bulan Akses Penuh
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{p.description}</p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-xs"
                          onClick={() => setEditingPlanId(null)}
                        >
                          Batal
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 rounded-xl text-xs font-bold"
                          onClick={() => handleSavePlan(p.id)}
                        >
                          <Save className="size-3.5 mr-1" /> Simpan
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl text-xs font-bold"
                        onClick={() => handleStartEdit(p)}
                      >
                        <Edit2 className="size-3.5 mr-1" /> Ubah Tarif
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Tile>
      </div>
    </FounderShell>
  );
}
