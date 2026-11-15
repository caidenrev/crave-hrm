import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    company_name: "",
    password: "",
    password_confirmation: "",
  });

  const strength =
    data.password.length > 8 ? 3 : data.password.length > 5 ? 2 : data.password.length > 0 ? 1 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="size-5 mr-2.5" aria-hidden="true">
      <path
        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86 8.87028 4.75 12.0003 4.75Z"
        fill="#EA4335"
      />
      <path
        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
        fill="#4285F4"
      />
      <path
        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
        fill="#FBBC05"
      />
      <path
        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
        fill="#34A853"
      />
    </svg>
  );

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

      {/* Divider */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Or sign up with
        </span>
        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
      </div>

      {/* Google SSO Button */}
      <div className="mt-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 sm:h-11.5 rounded-xl sm:rounded-2xl text-[13.5px] sm:text-[14px] font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-center"
        >
          <GoogleIcon />
          <span>Google Workspace</span>
        </Button>
      </div>
    </GuestLayout>
  );
}


