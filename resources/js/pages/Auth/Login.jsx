import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, UserCheck, ShieldCheck, Laptop } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Login({ status, demoAccounts = [] }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "founder@craveservices.my.id",
    password: "@Mukbsca22",
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login", {
      onFinish: () => reset("password"),
    });
  };

  const handleSelectDemoAccount = (account) => {
    setData({
      email: account.email,
      password: account.password,
      remember: true,
    });
  };

  return (
    <GuestLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk ke portal manajemen SDM & operasional Crave HRM"
      mode="login"
    >
      <Head title="Masuk Akun — Crave HRM" />

      {status && (
        <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          {status}
        </div>
      )}

      {errors.email && (
        <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive">
          {errors.email}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Email Kerja Terdaftar
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="nama@craveservices.my.id"
              required
              className="h-11 rounded-xl pl-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Kata Sandi
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="••••••••••••"
              required
              className="h-11 rounded-xl pl-10 pr-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing}
          className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm bg-primary text-primary-foreground gap-2 shadow-soft hover:opacity-95 cursor-pointer mt-2"
        >
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Memverifikasi Akun...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dasbor</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* 1-CLICK DEMO ACCOUNTS SELECTOR (Zero-Friction Dev Testing) */}
      <div className="mt-8 pt-6 border-t border-border/60">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Akun Pengujian Cepat (1-Click Dev Fill):
          </span>
          <Badge variant="outline" className="text-[10px] rounded-md font-semibold">
            Sprint Ready
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {demoAccounts.map((acc) => {
            const isSelected = data.email === acc.email;
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectDemoAccount(acc)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary text-foreground shadow-2xs"
                    : "bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold truncate text-foreground">
                    {acc.name}
                  </span>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="text-[9px] px-1 py-0 h-3.5 rounded-sm"
                  >
                    {acc.badge}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
                  {acc.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </GuestLayout>
  );
}
