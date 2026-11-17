"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
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

  const handleNavClick = (e, item) => {
    if (item.link?.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const target = document.querySelector(item.link);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <Navbar>
      {/* Desktop Navigation Body */}
      <NavBody visible={isScrolled}>
        <Logo className="shrink-0" />
        <NavItems
          items={CRAVE_HRM_NAV}
          isScrolled={isScrolled}
          onItemClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex items-center gap-2.5 justify-end hidden lg:flex shrink-0">
          {user ? (
            <NavbarButton
              href="/dashboard"
              variant="dark"
            >
              Buka Dasbor
            </NavbarButton>
          ) : (
            <>
              <a
                href="/login"
                className="text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                Masuk
              </a>
              <NavbarButton
                href="/register"
                className="bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white shadow-xs"
              >
                Mulai Gratis
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} visible={isScrolled}>
        <MobileNavHeader>
          <Logo />
          {isScrolled ? (
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
            className="flex flex-col gap-2 w-full"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
            }}
          >
            {CRAVE_HRM_NAV.map((item, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <motion.a
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 300, damping: 24 },
                    },
                  }}
                  key={item.name}
                  href={item.link}
                  onClick={(e) => handleNavClick(e, item)}
                  className="flex flex-col py-2 relative overflow-hidden group text-[#111827] hover:text-[#1B5CFE] transition-colors"
                >
                  <div className="flex items-start">
                    <span className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none text-[#111827]">
                      {item.name}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1B5CFE] ml-1 mt-0.5">
                      {num}
                    </span>
                  </div>
                </motion.a>
              );
            })}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 24 },
                },
              }}
              className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2"
            >
              {user ? (
                <NavbarButton
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#161924] text-white"
                >
                  Buka Dasbor
                </NavbarButton>
              ) : (
                <>
                  <NavbarButton
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-[oklch(0.54_0.19_258)] text-white font-bold"
                  >
                    Mulai Gratis (30 Hari)
                  </NavbarButton>
                  <NavbarButton
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-slate-100 text-[#111827] font-semibold"
                  >
                    Masuk ke Akun
                  </NavbarButton>
                </>
              )}
            </motion.div>
          </motion.div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default LandingNavbar;
