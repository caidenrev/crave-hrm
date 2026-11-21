"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { smoothScrollTo } from "@/lib/smoothScroll";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar";

const CRAVE_HRM_NAV = [
  { name: "Fitur", link: "#fitur" },
  { name: "Kepatuhan", link: "#kepatuhan" },
  { name: "Integrasi", link: "#integrasi" },
  { name: "Portal Karir", link: "/careers", isPage: true },
  { name: "Harga", link: "#harga" },
  { name: "FAQ", link: "#faq" },
];

export function LandingNavbar({ auth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = auth?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Tutup menu saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, item) => {
    if (item.link?.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      document.body.style.overflow = "";
      setTimeout(() => {
        smoothScrollTo(item.link);
      }, 50);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs z-[90] lg:hidden pointer-events-auto"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Navbar>
        {/* Desktop Navigation Body */}
        <NavBody visible={isScrolled}>
          <Logo className="shrink-0" />
          <NavItems
            items={CRAVE_HRM_NAV}
            isScrolled={isScrolled}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-20 pointer-events-auto flex items-center gap-2.5 justify-end hidden lg:flex shrink-0">
            {user ? (
              <NavbarButton
                href="/dashboard"
                variant="dark"
              >
                Buka Dasbor
              </NavbarButton>
            ) : (
              <>
                <Link
                  href="/login"
                  className="relative z-20 text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  Masuk
                </Link>
                <NavbarButton
                  href="/register"
                  className="relative z-20 bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white shadow-xs"
                >
                  Mulai Gratis
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation Card */}
        <MobileNav isOpen={isMobileMenuOpen} visible={isScrolled}>
        <MobileNavHeader>
          <Logo />
          {isScrolled || isMobileMenuOpen ? (
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#111827]"
            />
          ) : (
            <div className="flex items-center gap-2">
              {user ? (
                <NavbarButton
                  href="/dashboard"
                  variant="dark"
                  className="px-3.5 py-1.5 text-xs font-bold"
                >
                  Dasbor
                </NavbarButton>
              ) : (
                <NavbarButton
                  href="/register"
                  className="bg-[oklch(0.54_0.19_258)] text-white px-3.5 py-1.5 text-xs font-bold"
                >
                  Mulai Gratis
                </NavbarButton>
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#111827]"
              />
            </div>
          )}
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <motion.div
            className="flex flex-col gap-1 w-full"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
            }}
          >
            {CRAVE_HRM_NAV.map((item, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 320, damping: 26 },
                    },
                  }}
                  key={item.name}
                  href={item.link}
                  onClick={(e) => handleNavClick(e, item)}
                  className="flex flex-col py-2 px-1 relative overflow-hidden group text-[#111827] hover:text-[#1B5CFE] transition-colors"
                >
                  <div className="flex items-baseline">
                    <span className="text-[26px] sm:text-[30px] font-black uppercase tracking-tight leading-none text-[#111827] group-hover:text-[#1B5CFE] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] sm:text-[12px] font-bold text-[#1B5CFE] ml-1">
                      {num}
                    </span>
                  </div>
                </motion.a>
              );
            })}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 320, damping: 26 },
                },
              }}
              className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5 w-full"
            >
              {user ? (
                <a
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-11.5 sm:h-12 rounded-full bg-[#161924] hover:bg-[#232738] text-white font-bold text-[13.5px] sm:text-[14px] shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-[0.99]"
                >
                  Buka Dasbor
                </a>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-11.5 sm:h-12 rounded-full bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white font-bold text-[13.5px] sm:text-[14px] shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-[0.99]"
                  >
                    Mulai Gratis (30 Hari)
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-11.5 sm:h-12 rounded-full bg-slate-50/70 hover:bg-slate-100 border border-slate-200/80 text-[#111827] font-semibold text-[13px] sm:text-[13.5px] shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-[0.99]"
                  >
                    Masuk ke Akun
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  </>
  );
}

export default LandingNavbar;
