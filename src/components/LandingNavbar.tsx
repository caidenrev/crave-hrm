"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FLOATING_SHADOW =
  "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05)";

const NAV_ITEMS = [
  { name: "Produk", href: "#produk" },
  { name: "Solusi", href: "#solusi" },
  { name: "Fitur", href: "#fitur" },
  { name: "Testimoni", href: "#testimoni" },
  { name: "FAQ", href: "#faq" },
];

export function LandingNavbar({
  brandName = "Crave",
  ctaText = "Coba Sekarang",
  ctaHref = "#mulai",
}: {
  brandName?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    // Deteksi scroll pada window tanpa bug target ref
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-2.5 z-[100] w-full pointer-events-none px-4">
      {/* ================= DESKTOP EVOLVED NAVBAR ================= */}
      <motion.header
        initial={false}
        animate={{
          // INTI ANIMASI EVOLUSI:
          width: isScrolled ? "80%" : "100%",
          y: isScrolled ? 10 : 0,
          borderRadius: isScrolled ? "9999px" : "0px 0px 16px 16px",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0)",
          boxShadow: isScrolled ? FLOATING_SHADOW : "none",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 30, // Spring physics elastis dan fluid
        }}
        style={{ minWidth: "760px" }}
        className={cn(
          "pointer-events-auto relative mx-auto hidden max-w-6xl items-center justify-between px-7 py-3.5 transition-colors duration-300 lg:flex",
          isScrolled ? "text-slate-900" : "text-white"
        )}
      >
        {/* LOGO */}
        <a href="/" className="z-20 flex items-center gap-2 cursor-pointer select-none">
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm transition-colors",
              isScrolled ? "bg-[#1B5CFE] text-white" : "bg-white text-[#1B5CFE]"
            )}
          >
            C
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            {brandName}
          </span>
        </a>

        {/* MENU TABS WITH SLIDING HOVER PILL */}
        <nav
          onMouseLeave={() => setHoveredIdx(null)}
          className="absolute inset-0 flex items-center justify-center space-x-1"
        >
          <LayoutGroup id="navbar-hover-pill">
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="relative z-10 flex items-start px-4 py-2 text-sm font-semibold tracking-tight transition-colors"
              >
                {hoveredIdx === idx && (
                  <motion.div
                    layoutId="active-pill"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      isScrolled ? "bg-slate-100 dark:bg-neutral-800" : "bg-white/15"
                    )}
                  />
                )}
                <span className="font-extrabold uppercase text-xs tracking-wider">
                  {item.name}
                </span>
                <span
                  className={cn(
                    "ml-1 text-[10px] font-bold transition-colors",
                    isScrolled ? "text-[#1B5CFE]" : "text-white/60"
                  )}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </LayoutGroup>
        </nav>

        {/* CTA BUTTON */}
        <div className="z-20">
          <a
            href={ctaHref}
            className={cn(
              "inline-block rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-sm",
              isScrolled
                ? "bg-[#1B5CFE] text-white hover:bg-blue-700 shadow-blue-500/20"
                : "bg-white text-[#1B5CFE] hover:bg-slate-100"
            )}
          >
            {ctaText}
          </a>
        </div>
      </motion.header>

      {/* ================= MOBILE EVOLVED NAVBAR ================= */}
      <motion.div
        animate={{
          width: isScrolled ? "92%" : "100%",
          y: isScrolled ? 10 : 0,
          borderRadius: mobileMenuOpen ? "24px" : isScrolled ? "32px" : "12px",
          backgroundColor: isScrolled || mobileMenuOpen ? "rgba(255, 255, 255, 0.95)" : "transparent",
          boxShadow: isScrolled || mobileMenuOpen ? FLOATING_SHADOW : "none",
          backdropFilter: isScrolled || mobileMenuOpen ? "blur(12px)" : "none",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "pointer-events-auto relative mx-auto flex w-full flex-col px-5 py-3 transition-colors lg:hidden",
          isScrolled || mobileMenuOpen ? "text-slate-900" : "text-white"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <a href="/" className="font-black text-xl tracking-tight">
            {brandName}
          </a>

          <div className="flex items-center gap-2">
            {!isScrolled && !mobileMenuOpen && (
              <a
                href={ctaHref}
                className="rounded-full border border-white/50 px-3.5 py-1 text-xs font-bold text-white hover:bg-white/10"
              >
                {ctaText}
              </a>
            )}

            {/* Morphing Hamburger SVG */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg
                viewBox="0 0 32 32"
                className={cn(
                  "h-7 w-7 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] stroke-current",
                  mobileMenuOpen ? "-rotate-45" : ""
                )}
              >
                <path
                  className="fill-none stroke-[3] [stroke-linecap:round] [stroke-linejoin:round] transition-all duration-500"
                  style={{
                    strokeDasharray: mobileMenuOpen ? "20 300" : "12 63",
                    strokeDashoffset: mobileMenuOpen ? "-32.42" : "0",
                  }}
                  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                />
                <path
                  className="fill-none stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"
                  d="M7 16 27 16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full flex flex-col pt-5 pb-3 overflow-hidden"
            >
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-baseline py-2.5 text-slate-900 hover:text-[#1B5CFE] transition-colors"
                >
                  <span className="text-3xl font-black uppercase tracking-tight">{item.name}</span>
                  <span className="text-xs font-bold text-[#1B5CFE] ml-2">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={ctaHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 rounded-full bg-[#1B5CFE] text-white text-center font-bold text-sm shadow-md"
                >
                  {ctaText}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default LandingNavbar;
