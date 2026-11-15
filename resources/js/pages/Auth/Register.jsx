import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, User, Building2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    company_name: "",
    password: "",
    password_confirmation: "",
  });

  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(data.password);
  const strengthLabels = ["Terlalu Pendek", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const strengthColors = ["bg-muted", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-primary"];

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };

  return (
    <GuestLayout
      title="Daftar Perusahaan Baru"
      subtitle="Buat entitas bisnis baru dan mulai kelola talenta serta payroll otomatis"
      mode="register"
    >
      <Head title="Daftar Perusahaan — Crave HRM" />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Nama Lengkap Penanggung Jawab
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Contoh: Budi Pratama"
              required
              className="h-10 rounded-xl pl-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary"
            />
          </div>
          {errors.name && <p className="text-[11px] text-destructive font-semibold">{errors.name}</p>}
        </div>

        {/* Company Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Nama Perusahaan / Bisnis
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={data.company_name}
              onChange={(e) => setData("company_name", e.target.value)}
              placeholder="Contoh: PT Crave Solusi Indonesia"
              required
              className="h-10 rounded-xl pl-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary"
            />
          </div>
          {errors.company_name && (
            <p className="text-[11px] text-destructive font-semibold">{errors.company_name}</p>
          )}
        </div>

        {/* Work Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Email Bisnis / Kantor
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="nama@perusahaan.com"
              required
              className="h-10 rounded-xl pl-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary"
            />
          </div>
          {errors.email && <p className="text-[11px] text-destructive font-semibold">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="Minimal 8 karakter kombinasi"
              required
              className="h-10 rounded-xl pl-10 pr-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive font-semibold">{errors.password}</p>
          )}

          {/* Password Strength Meter */}
          {data.password && (
            <div className="mt-2 space-y-1">
              <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-muted/60">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all ${
                      strength >= step ? strengthColors[strength] : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                <span>Kekuatan Kata Sandi:</span>
                <span className="font-bold text-foreground">{strengthLabels[strength]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Password Confirmation */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              placeholder="Ketik ulang kata sandi"
              required
              className="h-10 rounded-xl pl-10 text-xs sm:text-sm bg-muted/30 border-border/70 focus:border-primary font-medium"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing}
          className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm bg-primary text-primary-foreground gap-2 shadow-soft hover:opacity-95 cursor-pointer mt-4"
        >
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Membuat Akun Perusahaan...</span>
            </>
          ) : (
            <>
              <span>Daftar &amp; Mulai Sekarang</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground pt-2">
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Crave HRM.
        </p>
      </form>
    </GuestLayout>
  );
}

