import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { Sun, Moon, ArrowRight, ShieldCheck, Zap, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToastNotification } from "@/components/ui/ToastNotification";

export default function GuestLayout({ children, title, subtitle, mode = "login" }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("crave-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = (dark) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("crave-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("crave-theme", "light");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 md:flex md:items-center overflow-x-hidden selection:bg-primary/20 selection:text-primary font-sans">
      <ToastNotification />

      {/* Top Floating Controls (Theme Toggle & Back Link) */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <div className="flex items-center rounded-full bg-background/80 backdrop-blur p-1 border shadow-xs">
          <button
            type="button"
            onClick={() => toggleTheme(false)}
            aria-label="Light mode"
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              !isDark ? "bg-primary text-white shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleTheme(true)}
            aria-label="Dark mode"
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isDark ? "bg-primary text-white shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* LEFT/TOP HERO BANNER (Crave POS Royal Electric Blue Aesthetic) */}
      <div className="absolute top-0 inset-x-0 h-[38%] md:h-full md:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-500 md:rounded-r-[3rem] transition-all duration-500 z-0 overflow-hidden pointer-events-none">
        {/* Soft Multi-stop Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-start pt-10 md:pt-0 md:items-start md:justify-center h-full px-6 md:px-14 lg:px-20 md:-translate-y-8">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
            <img
              src="/dark-mode-logo.png"
              alt="Crave Logo"
              className="h-14 md:h-20 object-contain drop-shadow-md"
            />
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Crave <span className="text-blue-200 font-extrabold text-2xl md:text-4xl">HRM</span>
              </h1>
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-white/70 mt-1">
                Human Resource Management
              </p>
            </div>
          </div>

          <p className="hidden md:block mt-6 text-white/90 text-left max-w-md text-sm md:text-base leading-relaxed font-medium">
            Sistem manajemen talenta & payroll modern berbasis cloud. Otomatisasi kepatuhan PPh 21 TER 2024, BPJS, presensi GPS selfie, dan pipeline rekrutmen ATS.
          </p>

          {/* Key Trust Badges */}
          <div className="hidden lg:flex flex-col gap-2.5 mt-8 pointer-events-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
              <span className="size-5 rounded-full bg-white/15 grid place-items-center text-white">✓</span>
              <span>Kepatuhan Pajak PPh 21 TER 2024 & Slip Gaji A4 Formal</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
              <span className="size-5 rounded-full bg-white/15 grid place-items-center text-white">✓</span>
              <span>Multi-Company Holding & Isolasi Data Cabang Terjamin</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
              <span className="size-5 rounded-full bg-white/15 grid place-items-center text-white">✓</span>
              <span>Presensi GPS Geofence, Whitelist IP & Dynamic QR Kantin</span>
            </div>
          </div>

          {/* Floating Switch Link between Login & Register */}
          <div className="absolute top-4 left-6 md:top-auto md:bottom-10 md:left-14 lg:left-20 flex items-center gap-2.5 text-xs pointer-events-auto z-50">
            <span className="hidden sm:inline text-white/90 font-medium">
              {mode === "login" ? "Belum punya akun perusahaan?" : "Sudah memiliki akun terdaftar?"}
            </span>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-none h-8 px-3.5 text-xs font-bold cursor-pointer transition-all"
            >
              <Link href={mode === "login" ? "/register" : "/login"}>
                {mode === "login" ? "Daftar Perusahaan" : "Masuk Akun"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT FORM CONTAINER */}
      <div className="w-full max-w-md mx-auto relative z-10 md:w-full md:max-w-xl lg:max-w-2xl md:ml-[calc(50%-2rem)] lg:ml-[calc(50%-2.5rem)] md:mr-6 lg:mr-16 mt-[24vh] sm:mt-[28vh] md:mt-0 px-3 sm:px-6 md:px-0 py-6 md:py-10">
        <div className="bg-card text-card-foreground rounded-t-[2.5rem] md:rounded-3xl shadow-soft md:shadow-2xl border border-border/60 p-6 sm:p-10 flex flex-col min-h-[65vh] md:min-h-0">
          {/* Header Title & Subtitle */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

