"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { smoothScrollTo } from "@/lib/smoothScroll";

const NAV_ITEMS = [
  { name: "Cari Lowongan", href: "#posisi" },
  { name: "Budaya Kerja", href: "#budaya" },
  { name: "Tentang Crave", href: "/" },
];

export default function CareerNavbar({ companyName = "Crave Group" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileMenuOpen(false);
      smoothScrollTo(href);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-2.5 z-[100] w-full pointer-events-none px-4">
        {/* ================= DESKTOP EVOLVED NAVBAR ================= */}
        <motion.header
          initial={false}
          animate={{
            width: isScrolled ? "82%" : "100%",
            y: isScrolled ? 8 : 0,
            borderRadius: isScrolled ? "9999px" : "16px",
            backgroundColor: isScrolled
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0)",
            boxShadow: isScrolled
              ? "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)"
              : "none",
            backdropFilter: isScrolled ? "blur(12px)" : "none",
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 32,
          }}
          className={cn(
            "pointer-events-auto relative mx-auto hidden max-w-6xl items-center justify-between px-6 py-3 transition-colors duration-300 lg:flex",
            isScrolled ? "text-[#111827] border border-slate-100" : "text-white"
          )}
        >
          {/* LOGO: Tanpa square div, logo versi dark di header atas, dan 'HRM' pudar */}
          <Link href="/" className="z-20 flex items-center gap-2.5 cursor-pointer select-none group">
            <img
              src={isScrolled ? "/light-mode-logo.png" : "/dark-mode-logo.png"}
              alt="Crave Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span
              className={cn(
                "text-[17px] font-extrabold tracking-[-0.03em] transition-colors",
                isScrolled ? "text-[#111827]" : "text-white"
              )}
            >
              Crave{" "}
              <span
                className={cn(
                  "font-bold transition-opacity",
                  isScrolled ? "text-[#6B7280] opacity-80" : "text-white/60"
                )}
              >
                HRM
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV ITEMS WITH SLIDING PILL */}
          <LayoutGroup id="career-nav-pill">
            <nav
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative z-10 flex items-center gap-1.5"
            >
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-semibold transition-colors duration-200 cursor-pointer select-none",
                    isScrolled
                      ? "text-[#374151] hover:text-[#111827]"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {hoveredIdx === idx && (
                    <motion.div
                      layoutId="career-pill-hover"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isScrolled ? "bg-slate-100" : "bg-white/15 backdrop-blur-xs"
                      )}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </a>
              ))}
            </nav>
          </LayoutGroup>

          {/* RIGHT ACTION: Masuk Portal HR */}
          <div className="z-20 flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "h-9 px-4 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs",
                isScrolled
                  ? "bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs"
              )}
            >
              <span>Masuk Portal HR</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </motion.header>

        {/* ================= MOBILE FLOATING BAR ================= */}
        <motion.div
          animate={{
            backgroundColor: isScrolled
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0)",
            boxShadow: isScrolled
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)"
              : "none",
            borderRadius: isScrolled ? "9999px" : "12px",
            backdropFilter: isScrolled ? "blur(12px)" : "none",
          }}
          transition={{ duration: 0.25 }}
          className={cn(
            "pointer-events-auto mx-auto flex max-w-md items-center justify-between px-4 py-2.5 lg:hidden transition-colors",
            isScrolled ? "text-[#111827] border border-slate-100" : "text-white"
          )}
        >
          {/* Logo Mobile */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src={isScrolled ? "/light-mode-logo.png" : "/dark-mode-logo.png"}
              alt="Crave Logo"
              className="h-6 w-auto object-contain"
            />
            <span
              className={cn(
                "text-[15px] font-extrabold tracking-tight",
                isScrolled ? "text-[#111827]" : "text-white"
              )}
            >
              Crave{" "}
              <span
                className={cn(
                  "font-bold",
                  isScrolled ? "text-[#6B7280] opacity-80" : "text-white/60"
                )}
              >
                HRM
              </span>
            </span>
          </Link>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors",
                isScrolled
                  ? "bg-[oklch(0.54_0.19_258)] text-white"
                  : "bg-white/15 text-white border border-white/20"
              )}
            >
              Masuk
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                isScrolled ? "text-[#111827] hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ================= MOBILE DRAWER / OVERLAY ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-16 z-[99] rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 lg:hidden text-[#111827]"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="px-3 py-2.5 rounded-xl text-sm font-bold text-[#111827] hover:bg-slate-50 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-slate-100">
                <Link
                  href="/login"
                  className="w-full h-10 rounded-xl bg-[oklch(0.54_0.19_258)] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Portal HR</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}