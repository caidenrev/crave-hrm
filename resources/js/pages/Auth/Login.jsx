import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login({ status, turnstileSiteKey = "0x4AAAAAAGE_beCSvLpqhbkp" }) {
  const [showPassword, setShowPassword] = useState(false);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: true,
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
            theme: "light", // Kunci tema light sesuai permintaan
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
    post("/login", {
      onFinish: () => reset("password"),
    });
  };

  return (
    <GuestLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access Crave HRM Portal"
      mode="login"
    >
      <Head title="Masuk Akun — Crave HRM" />

      {status && (
        <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-700">
          {status}
        </div>
      )}

      {errors.email && (
        <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
          {errors.email}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            placeholder="nama@craveservices.my.id"
            required
            className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary px-4 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
              Password
            </label>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="••••••••••••"
              required
              className="h-13 sm:h-14 rounded-2xl bg-slate-50/90 border-slate-200 focus-visible:ring-primary/40 focus-visible:border-primary pl-4 pr-12 text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 tracking-widest font-medium transition-all"
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
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={data.remember}
              onCheckedChange={(checked) => setData("remember", Boolean(checked))}
            />
            <span className="text-xs text-slate-600 font-medium">
              Ingat sesi di perangkat ini
            </span>
          </label>
          <button
            type="button"
            className="text-[12px] sm:text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Cloudflare Turnstile Bot Verification (Menggantikan tombol Google SSO) */}
        <div className="pt-2 pb-1 flex flex-col items-center justify-center min-h-[70px]">
          <div ref={turnstileRef} className="my-1" />
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
            className="w-full h-13 sm:h-14 rounded-2xl text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border border-primary transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
