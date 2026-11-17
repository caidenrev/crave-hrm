import React, { useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastNotification } from "@/components/ui/ToastNotification";

export default function GuestLayout({ children, title, subtitle, mode = "login" }) {
  useEffect(() => {
    // Kunci halaman auth (Login & Register) selalu dalam mode LIGHT bersih
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-slate-900 md:flex md:items-center overflow-x-hidden selection:bg-primary/20 selection:text-primary font-sans">
      <ToastNotification />

      {/* Back Button to Landing Page (Crave POS Pattern) */}
      <Link
        href="/"
        aria-label="Kembali ke Beranda"
        className="absolute left-4 sm:left-6 top-5 sm:top-6 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white shadow-xs backdrop-blur-md transition-all active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </Link>

      {/* Top Right Controls: Mobile Switch Only (Theme Switch Removed) */}
      <div className="absolute top-5 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5">
        {/* Mobile Get Started / Sign In Switch Button */}
        <div className="md:hidden">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-none h-8 px-3.5 text-xs font-semibold cursor-pointer backdrop-blur-md"
          >
            <Link href={mode === "login" ? "/register" : "/login"}>
              {mode === "login" ? "Get Started" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>

      {/* LEFT/TOP HERO BANNER (Crave POS Royal Electric Blue) */}
      <div className="absolute top-0 inset-x-0 h-[40%] sm:h-[44%] md:h-full md:w-1/2 bg-primary md:rounded-r-[3rem] transition-all duration-500 z-0 overflow-hidden pointer-events-none">
        {/* Soft Multi-stop Ambient Glow (Crave POS Orbs) */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-black/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-start pt-14 sm:pt-16 md:pt-0 md:items-start md:justify-center h-full px-6 md:px-14 lg:px-16 xl:px-20 md:-translate-y-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 pointer-events-auto">
            <img
              src="/dark-mode-logo.png"
              alt="Crave Logo"
              className="h-12 sm:h-16 md:h-20 object-contain drop-shadow-md shrink-0"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none flex items-center gap-2">
              <span>Crave</span>
              <span className="text-primary-foreground/90 font-black">HRM</span>
            </h1>
          </div>

          <p className="hidden md:block mt-6 text-white/90 text-left max-w-md text-sm md:text-base leading-relaxed font-medium">
            Solusi cloud HR &amp; Payroll terpadu standar Indonesia. Kelola absensi GPS geofence, voucher kantin digital 60 detik, kepatuhan PPh 21 TER 2024, BPJS, hingga pipeline rekrutmen ATS.
          </p>

          {/* Key Compliance Badges (Desktop) */}
          <div className="hidden lg:flex flex-col gap-2 mt-7 pointer-events-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="size-4.5 rounded-full bg-white/20 grid place-items-center text-white text-[10px] font-bold"><Check className="size-3 text-white stroke-[3]" /></span>
              <span>Kalkulator PPh 21 TER 2024 (PP 58/2023) &amp; Slip Gaji A4 Formal</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="size-4.5 rounded-full bg-white/20 grid place-items-center text-white text-[10px] font-bold"><Check className="size-3 text-white stroke-[3]" /></span>
              <span>Absensi GPS Geofence, Whitelist IP &amp; Tiket Kantin QR Dinamis</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="size-4.5 rounded-full bg-white/20 grid place-items-center text-white text-[10px] font-bold"><Check className="size-3 text-white stroke-[3]" /></span>
              <span>Multi-Company Holding &amp; Isolasi Data Cabang Zero-Leakage</span>
            </div>
          </div>

          {/* Desktop Switcher: Get Started / Sign in */}
          <div className="hidden md:flex absolute bottom-10 left-14 lg:left-16 xl:left-20 items-center gap-3 text-sm pointer-events-auto z-50">
            <span className="text-white/90 text-xs font-medium">
              {mode === "login" ? "Belum memiliki akun perusahaan?" : "Sudah memiliki akun terdaftar?"}
            </span>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-none h-8 px-4 text-xs font-semibold cursor-pointer backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              <Link href={mode === "login" ? "/register" : "/login"}>
                {mode === "login" ? "Get Started" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT FORM CONTAINER (Crave POS Floating White Card) */}
      <div className="w-full max-w-md mx-auto relative z-10 md:w-full md:max-w-xl lg:max-w-2xl md:ml-[calc(50%-2rem)] lg:ml-[calc(50%-2.5rem)] xl:ml-[calc(50%-4rem)] md:mr-8 lg:mr-12 xl:mr-20 mt-[26vh] sm:mt-[30vh] md:mt-0 px-3 sm:px-6 md:px-0 py-4 sm:py-6 md:py-6 lg:py-8">
        <div className="bg-white text-slate-900 rounded-t-[2.5rem] md:rounded-3xl shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.06)] md:shadow-2xl border border-slate-200/90 p-6 sm:p-8 md:p-8 flex flex-col min-h-[68vh] md:min-h-0">
          {/* Header Title & Subtitle */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-[24px] sm:text-[26px] md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[13px] sm:text-[14px] text-slate-500 mt-0.5">
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


