import React, { useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";

export default function ForgotPassword({
  status,
  turnstileSiteKey = "0x4AAAAAAGE_beCSvLpqhbkp",
}) {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    cf_turnstile_response: "",
  });

  const isTurnstileEnabled = turnstileSiteKey && turnstileSiteKey !== "disabled";

  useEffect(() => {
    if (!isTurnstileEnabled) return;

    const siteKey = turnstileSiteKey || "0x4AAAAAAGE_beCSvLpqhbkp";
    const scriptId = "cf-turnstile-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: "light",
            size: "flexible",
            callback: (token) => {
              setData("cf_turnstile_response", token);
            },
            "expired-callback": () => {
              setData("cf_turnstile_response", "");
            },
            "error-callback": () => {
              setData("cf_turnstile_response", "");
            },
          });
          clearInterval(interval);
        } catch (e) {
          console.error("Turnstile render error", e);
        }
      }
      if (attempts > 100) clearInterval(interval);
    }, 100);

    return () => {
      clearInterval(interval);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {}
      }
    };
  }, [turnstileSiteKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/forgot-password");
  };

  return (
    <GuestLayout
      title="Atur Ulang Kata Sandi"
      subtitle="Masukkan alamat email akun Anda untuk menerima tautan pemulihan kata sandi"
      mode="login"
    >
      <Head title="Lupa Kata Sandi — Crave HRM" />

      {/* Status Sukses Pengiriman Email */}
      {status ? (
        <div className="space-y-4 my-auto py-2">
          <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200/90 p-5 text-emerald-900 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-900">
                  Tautan Pemulihan Berhasil Dikirim!
                </h4>
                <p className="text-xs leading-relaxed text-emerald-700 font-medium">
                  {status}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Mail className="size-4 text-primary" />
              <span>Belum menerima email?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Periksa folder <strong>Spam</strong> atau <strong>Promosi</strong> di email Anda. Tautan berlaku selama 60 menit sejak email dikirim.
            </p>
          </div>

          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="size-4" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.email && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
              {errors.email}
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
              Alamat Email Terdaftar
            </label>
            <div className="relative">
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                autoFocus
                className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary pl-4 pr-11 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail className="size-5" />
              </div>
            </div>
          </div>

          {/* Cloudflare Turnstile */}
          {isTurnstileEnabled ? (
            <div className="pt-2 pb-1 w-full min-h-[70px] flex flex-col items-center justify-center [&>div]:w-full [&_iframe]:w-full [&_iframe]:max-w-full">
              <div ref={turnstileRef} className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full" />
              {errors.cf_turnstile_response && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 text-center">
                  {errors.cf_turnstile_response}
                </p>
              )}
            </div>
          ) : (
            <div className="py-2 w-full flex items-center justify-center">
              <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200/80">
                Mode Pengujian Lokal • Verifikasi Bot Dinonaktifkan
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1 space-y-3">
            <Button
              type="submit"
              disabled={processing}
              className="w-full h-13 sm:h-14 rounded-2xl text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border border-primary transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  <span>Mengirim Tautan...</span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="size-4" />
                  <span>Kirim Tautan Atur Ulang</span>
                </span>
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Ingat kata sandi? Masuk sekarang</span>
              </Link>
            </div>
          </div>
        </form>
      )}
    </GuestLayout>
  );
}
