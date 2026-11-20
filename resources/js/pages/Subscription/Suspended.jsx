import React from "react";
import { Head, router } from "@inertiajs/react";
import { AlertCircle, LogOut, Mail, MessageCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionSuspended({ company }) {
  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Head title="Akun Perusahaan Ditangguhkan - Crave HRM" />

      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-2xl text-center space-y-6">
        <div className="size-16 rounded-3xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Akses Ditangguhkan
          </h1>
          <p className="text-xs text-muted-foreground">
            Akses operasional modul HRM untuk perusahaan{" "}
            <span className="font-bold text-foreground">{company.name}</span> sedang ditangguhkan oleh Administrator SaaS.
          </p>
        </div>

        <div className="rounded-2xl bg-muted/50 p-4 text-left space-y-1.5 border">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">
            Keterangan Penangguhan
          </span>
          <p className="text-xs font-semibold text-foreground">
            {company.suspended_reason || "Pelanggaran ketentuan penggunaan atau penutupan administratif."}
          </p>
          {company.suspended_at && (
            <p className="text-[10px] text-muted-foreground">
              Waktu: {company.suspended_at}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Jika Anda merasa ini adalah kekeliruan atau ingin mengaktifkan kembali langganan, silakan hubungi tim kami.
        </p>

        <div className="space-y-2 pt-2">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Tim%20Crave%20HRM,%20saya%20ingin%20mengaktifkan%20kembali%20akun%20perusahaan%20saya"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="size-4" /> Hubungi via WhatsApp
          </a>

          <a
            href="mailto:founder@craveservices.my.id?subject=Permohonan%20Aktivasi%20Kembali%20Akun%20Crave%20HRM"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-bold hover:bg-accent transition-colors"
          >
            <Mail className="size-4" /> Email: founder@craveservices.my.id
          </a>

          <Button
            variant="ghost"
            className="w-full rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground mt-2"
            onClick={handleLogout}
          >
            <LogOut className="size-3.5 mr-1.5" /> Keluar dari Akun
          </Button>
        </div>
      </div>
    </div>
  );
}
