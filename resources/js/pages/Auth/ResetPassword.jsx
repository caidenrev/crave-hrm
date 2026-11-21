import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";

export default function ResetPassword({
  token,
  email = "",
  turnstileSiteKey = "0x4AAAAAAGE_beCSvLpqhbkp",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    token: token || "",
    email: email || "",
    password: "",
    password_confirmation: "",
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
    post("/reset-password", {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <GuestLayout
      title="Kata Sandi Baru"
      subtitle="Buat kata sandi baru yang aman untuk akun Crave HRM Anda"
      mode="login"
    >
      <Head title="Buat Kata Sandi Baru — Crave HRM" />

      {errors.email && (
        <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
          {errors.email}
        </div>
      )}

      {errors.token && (
        <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
          {errors.token}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Alamat Email
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            placeholder="nama@perusahaan.com"
            required
            className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary px-4 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Password Baru */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              autoFocus
              className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary pl-4 pr-12 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-600 font-semibold mt-1 ml-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Konfirmasi Kata Sandi Baru */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              placeholder="Ulangi kata sandi baru"
              required
              className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary pl-4 pr-12 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
              aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-xs text-rose-600 font-semibold mt-1 ml-1">
              {errors.password_confirmation}
            </p>
          )}
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
        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            disabled={processing}
            className="w-full h-13 sm:h-14 rounded-2xl text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border border-primary transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Memperbarui Kata Sandi...</span>
              </>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-5" />
                <span>Simpan Kata Sandi Baru</span>
              </span>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Batal dan kembali ke halaman Masuk</span>
            </Link>
          </div>
        </div>
      </form>
    </GuestLayout>
  );
}
