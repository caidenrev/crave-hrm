import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register({ turnstileSiteKey = "0x4AAAAAAGE_beCSvLpqhbkp" }) {
  const [showPassword, setShowPassword] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    company_name: "",
    password: "",
    password_confirmation: "",
    cf_turnstile_response: "",
  });

  useEffect(() => {
    const siteKey = turnstileSiteKey || "0x4AAAAAAGE_beCSvLpqhbkp";
    const scriptId = "cf-turnstile-script";

    // 1. Injeksi script Turnstile Cloudflare jika belum ada
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // 2. Render widget Turnstile secara eksplisit saat API siap
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

  const strength =
    data.password.length > 8 ? 3 : data.password.length > 5 ? 2 : data.password.length > 0 ? 1 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };

  return (
    <GuestLayout
      title="Get started free."
      subtitle="Daftarkan entitas bisnis Anda dan nikmati otomasi SDM modern"
      mode="register"
    >
      <Head title="Daftar Perusahaan — Crave HRM" />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-4 md:gap-y-2.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Your Full Name
            </label>
            <Input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nama lengkap penanggung jawab"
              required
              className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary px-3.5 sm:px-4 text-[13.5px] sm:text-[14px] text-foreground transition-all"
            />
            {errors.name && <p className="text-[11px] text-destructive font-semibold ml-1">{errors.name}</p>}
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Company / Business Name
            </label>
            <Input
              type="text"
              value={data.company_name}
              onChange={(e) => setData("company_name", e.target.value)}
              placeholder="Contoh: PT Crave Solusi"
              required
              className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary px-3.5 sm:px-4 text-[13.5px] sm:text-[14px] text-foreground transition-all"
            />
            {errors.company_name && (
              <p className="text-[11px] text-destructive font-semibold ml-1">{errors.company_name}</p>
            )}
          </div>

          {/* Email Address (Spans 2 columns on desktop) */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Business Email Address
            </label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="nama@perusahaan.com"
              required
              className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary px-3.5 sm:px-4 text-[13.5px] sm:text-[14px] text-foreground transition-all"
            />
            {errors.email && <p className="text-[11px] text-destructive font-semibold ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Create Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary pl-3.5 pr-10 text-[13.5px] sm:text-[14px] text-foreground tracking-widest font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-destructive font-semibold ml-1">{errors.password}</p>
            )}

            {/* Crave POS 3-Tier Password Strength Meter */}
            {data.password.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5 ml-1">
                <div className="flex gap-1 flex-1 max-w-[110px]">
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all",
                      strength >= 1 ? "bg-red-400" : "bg-slate-200 dark:bg-slate-800"
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all",
                      strength >= 2 ? "bg-amber-400" : "bg-slate-200 dark:bg-slate-800"
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all",
                      strength >= 3 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    strength === 3
                      ? "text-emerald-500"
                      : strength === 2
                      ? "text-amber-500"
                      : "text-red-400"
                  )}
                >
                  {strength === 3 ? "Strong" : strength === 2 ? "Medium" : "Weak"}
                </span>
              </div>
            )}
          </div>

          {/* Password Confirmation */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                placeholder="Ketik ulang kata sandi"
                required
                className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary pl-3.5 pr-10 text-[13.5px] sm:text-[14px] text-foreground tracking-widest font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Cloudflare Turnstile Bot Verification (Full-Width Flexible) */}
        <div className="pt-2 pb-1 w-full min-h-[70px] flex flex-col items-center justify-center [&>div]:w-full [&_iframe]:w-full [&_iframe]:max-w-full">
          <div ref={turnstileRef} className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full" />
          {errors.cf_turnstile_response && (
            <p className="text-xs text-rose-600 font-semibold mt-1.5 text-center">
              {errors.cf_turnstile_response}
            </p>
          )}
        </div>

        {/* Submit Button (Crave POS Royal Electric Blue) */}
        <div className="pt-1">
          <Button
            type="submit"
            disabled={processing}
            className="w-full h-11.5 sm:h-12 rounded-xl sm:rounded-2xl text-[14px] sm:text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border border-primary transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>

        <p className="text-[11px] sm:text-[12px] text-center text-muted-foreground pt-0.5">
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan &amp; Kebijakan Privasi Crave HRM.
        </p>
      </form>
    </GuestLayout>
  );
}


