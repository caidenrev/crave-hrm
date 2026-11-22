"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEAM_MEMBERS = [
  {
    id: "founder",
    tab: "Founder",
    name: "Eka Revandi",
    role: "Founder & Lead Software Engineer",
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
              </div>

              {/* 2. Silhouette Graphic: At bottom, mentok batas div */}
              <div
                className="relative md:absolute md:right-[3%] md:bottom-0 w-full md:w-[48%] h-[260px] sm:h-[320px] md:h-[88%] flex items-end justify-center pointer-events-none z-0 mt-6 md:mt-0"
                aria-hidden="true"
              >
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
