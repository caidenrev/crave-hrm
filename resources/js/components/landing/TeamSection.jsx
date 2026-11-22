"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEAM_MEMBERS = [
  {
    id: "founder",
    tab: "Founder",
    name: "Eka Revandi",
    role: "Founder & Lead Software Engineer",
    photo: "/images/foto-eka-revandi.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/caidenrev",
      instagram: "https://www.instagram.com/caidenrev",
    },
    heading: "Pendiri yang menjaga arah dan visi produk.",
    col1: "Eka memulai produk ini dari masalah nyata yang ia temui sendiri. Ia memastikan setiap fitur yang dibangun punya alasan yang jelas.",
    col2: "Ia memegang visi, strategi, dan hubungan dengan pengguna, supaya tim selalu bergerak ke arah yang sama.",
  },
  {
    id: "developer",
    tab: "Developer",
    name: "Aufa Wafi Daifullah",
    role: "Full-Stack Developer",
    heading: "Developer yang mengubah ide jadi produk yang berjalan.",
    col1: "Aufa membangun fondasi teknis produk, dari arsitektur sampai fitur yang dipakai sehari-hari oleh pengguna.",
    col2: "Ia mengutamakan kode yang rapi, performa yang cepat, dan sistem yang mudah dikembangkan ke depannya.",
  },
  {
    id: "pm",
    tab: "Project Manager",
    name: "Egi Witra Aditya",
    role: "Project Manager & QA",
    heading: "Project manager yang menjaga semuanya tetap tepat waktu.",
    col1: "Egi menghubungkan visi founder dengan pekerjaan developer lewat rencana yang jelas dan prioritas yang masuk akal.",
    col2: "Ia memantau progres, mengurai hambatan, dan memastikan setiap rilis sampai ke pengguna sesuai jadwal.",
  },
];

export function TeamSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);

  const currentMember = TEAM_MEMBERS[activeTab];

  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % TEAM_MEMBERS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      setActiveTab(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="w-full">
      {/* Stage: Interactive Stage Container Matching About Reference */}
      <div
        className="relative w-full max-w-[1240px] mx-auto min-h-[580px] md:min-h-[660px] lg:min-h-[700px] rounded-[24px] sm:rounded-[28px] overflow-hidden text-white shadow-[0_24px_64px_-16px_rgba(27,79,224,0.35)]"
        style={{
          background: "linear-gradient(165deg, #3a78ff 0%, #1b4fe0 45%, #06163f 100%)",
        }}
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Pill Tabs */}
        <div
          className="absolute z-30 top-6 sm:top-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 flex items-center gap-1.5 p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg"
          role="tablist"
          aria-label="Anggota tim"
        >
          {TEAM_MEMBERS.map((member, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={member.id}
                ref={(el) => (tabRefs.current[index] = el)}
                role="tab"
                id={`tab-${member.id}`}
                aria-controls={`panel-${member.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "bg-white text-[#0b2a80] shadow-md scale-[1.02]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {member.tab}
              </button>
            );
          })}
        </div>

        {/* Tab Panel with AnimatePresence */}
        <div className="relative w-full h-full min-h-[580px] md:min-h-[660px] lg:min-h-[700px] flex flex-col justify-between pt-24 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMember.id}
              role="tabpanel"
              id={`panel-${currentMember.id}`}
              aria-labelledby={`tab-${currentMember.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
              className="relative w-full h-full flex-1 flex flex-col justify-between p-6 pb-0 sm:p-10 sm:pb-0 md:p-14"
            >
              {/* 1. Copy: Top on mobile, left-aligned */}
              <div className="relative z-10 md:absolute md:left-12 md:bottom-[26%] lg:bottom-[28%] max-w-[560px] text-left">
                <div className="inline-block px-3 py-1 mb-3.5 sm:mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[12px] font-semibold text-white/90">
                  {currentMember.role}
                </div>
                <h3 className="font-bold text-[22px] sm:text-[28px] lg:text-[34px] leading-[1.2] tracking-[-0.02em] text-white mb-4 sm:mb-6 max-w-[20ch] text-left">
                  {currentMember.heading}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-7 text-[13.5px] sm:text-[14.5px] leading-[1.75] text-white/80 text-left">
                  <p>{currentMember.col1}</p>
                  <p>{currentMember.col2}</p>
                </div>

                {/* Social Links (LinkedIn & Instagram) */}
                {currentMember.socials && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-5 sm:mt-6">
                    {currentMember.socials.linkedin && (
                      <a
                        href={currentMember.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-[12.5px] font-semibold backdrop-blur-sm border border-white/20 transition-all shadow-sm group select-none cursor-pointer"
                        aria-label={`${currentMember.name} LinkedIn`}
                      >
                        <svg className="size-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.96 0-1.74.77-1.74 1.73a1.74 1.74 0 0 0 1.74 1.74c.95 0 1.73-.78 1.73-1.74 0-.96-.78-1.73-1.73-1.73z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {currentMember.socials.instagram && (
                      <a
                        href={currentMember.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-[12.5px] font-semibold backdrop-blur-sm border border-white/20 transition-all shadow-sm group select-none cursor-pointer"
                        aria-label={`${currentMember.name} Instagram`}
                      >
                        <svg className="size-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Photo / Silhouette Graphic: At bottom, mentok batas div */}
              <div
                className="relative md:absolute md:right-[3%] lg:right-[6%] md:bottom-0 w-full md:w-[46%] lg:w-[44%] h-[280px] sm:h-[340px] md:h-[90%] lg:h-[95%] flex items-end justify-center pointer-events-none z-0 mt-6 md:mt-0"
                aria-hidden="true"
              >
                {currentMember.photo ? (
                  <img
                    src={currentMember.photo}
                    alt={currentMember.name}
                    className="h-full w-auto max-h-[580px] object-contain object-bottom drop-shadow-[0_24px_50px_rgba(0,0,0,0.4)] block align-bottom select-none"
                    style={{ display: "block", verticalAlign: "bottom" }}
                  />
                ) : (
                  <svg
                    viewBox="0 0 200 220"
                    className="h-full w-auto text-white/[0.14] drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] block align-bottom"
                    fill="currentColor"
                    role="img"
                    aria-label={`Siluet ${currentMember.name}`}
                    style={{ display: "block", verticalAlign: "bottom" }}
                  >
                    <circle cx="100" cy="72" r="46" />
                    <path d="M10 220c0-52 40-88 90-88s90 36 90 88z" />
                  </svg>
                )}
              </div>

              {/* 3. Giant Name Watermark at Bottom */}
              <div
                className="relative md:absolute md:left-12 md:right-12 md:bottom-5 z-10 pointer-events-none select-none -mt-12 sm:-mt-16 md:mt-0 pb-5 md:pb-0 overflow-hidden text-left"
              >
                <span className="inline-block font-extrabold tracking-[-0.055em] leading-[0.9] text-white/95 text-[38px] sm:text-[58px] md:text-[clamp(3.5rem,7.5vw,7.8rem)] whitespace-nowrap">
                  {currentMember.name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default TeamSection;
