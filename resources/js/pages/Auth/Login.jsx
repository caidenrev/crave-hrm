import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login({ status, demoAccounts = [] }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login", {
      onFinish: () => reset("password"),
    });
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
      title="Welcome Back"
      subtitle="Enter your credentials to access Crave HRM Portal"
      mode="login"
    >
      <Head title="Masuk Akun — Crave HRM" />

      {status && (
        <div className="mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {status}
        </div>
      )}

      {errors.email && (
        <div className="mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
          {errors.email}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            placeholder="nama@craveservices.my.id"
            required
            className="h-13 sm:h-14 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary px-4 text-[14px] sm:text-[15px] text-foreground transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
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
              className="h-13 sm:h-14 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/40 focus-visible:border-primary pl-4 pr-12 text-[14px] sm:text-[15px] text-foreground tracking-widest font-medium transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
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
            <span className="text-xs text-muted-foreground font-medium">
              Ingat sesi di perangkat ini
            </span>
          </label>
          <button
            type="button"
            className="text-[12px] sm:text-[13px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button (Crave POS Royal Electric Blue) */}
        <div className="pt-2">
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

      {/* Divider */}
      <div className="mt-7 flex items-center gap-3">
        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Or sign in with
        </span>
        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
      </div>

      {/* Google Workspace SSO Button */}
      <div className="mt-5 pb-1">
        <Button
          type="button"
          variant="outline"
          className="w-full h-13 sm:h-14 rounded-2xl text-[14px] font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-center"
        >
          <GoogleIcon />
          <span>Google Workspace SSO</span>
        </Button>
      </div>
    </GuestLayout>
  );
}


