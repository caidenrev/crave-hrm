"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ShieldCheck,
  Building2,
  TrendingUp,
  Pause,
  Play,
  CheckCircle2,
} from "lucide-react";

const AUTO_PLAY_INTERVAL = 4500; // 4.5 detik per slide

export function TestimonialSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const length = testimonials.length;
  const touchStartX = useRef(null);
  const progressIntervalRef = useRef(null);

  // Ganti slide dengan arah transisi
  const changeSlide = useCallback((newIndex, newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(newIndex);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    const nextIdx = (currentIndex + 1) % length;
    changeSlide(nextIdx, 1);
  }, [currentIndex, length, changeSlide]);

  const prevSlide = useCallback(() => {
    const prevIdx = (currentIndex - 1 + length) % length;
    changeSlide(prevIdx, -1);
  }, [currentIndex, length, changeSlide]);

  const selectSlide = (idx) => {
    if (idx === currentIndex) return;
    const dir = idx > currentIndex ? 1 : -1;
    changeSlide(idx, dir);
  };

  // Timer animasi progress bar dan rotasi otomatis 4.5 detik
  useEffect(() => {
    if (!isPlaying || length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepTime = 50; // Update progress setiap 50ms
    const stepIncrement = (stepTime / AUTO_PLAY_INTERVAL) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, length, nextSlide]);

  // Touch gesture swipe untuk perangkat smartphone & tablet
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const current = testimonials[currentIndex] || testimonials[0];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.99,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  if (!current) return null;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. TOP INTERACTIVE CLIENT SWITCHER TABS (Clean Solid Style) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {testimonials.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectSlide(idx)}
                className={`group relative flex items-center gap-2.5 rounded-2xl px-3 sm:px-3.5 py-2 text-left transition-all overflow-hidden ${
                  isActive
                    ? "bg-white border-2 border-primary shadow-xs text-foreground"
                    : "bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Micro Avatar */}
                <div className="relative size-7 sm:size-8 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0] bg-[#F1F5F9]">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                  {isActive && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                  )}
                </div>

                {/* Name & Company */}
                <div className="min-w-0 pr-1">
                  <p
                    className={`text-[12px] sm:text-[13px] font-bold leading-tight truncate ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                    {item.company}
                  </p>
                </div>

                {/* Solid Countdown Progress Bar Underneath */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-100">
                    <motion.div
                      className="h-full bg-primary"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.05 }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Play/Pause Toggle & Slide Counter */}
        <div className="flex items-center gap-2 self-end sm:self-auto ml-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 text-[11px] font-bold text-slate-700 transition-colors shadow-2xs"
            title={isPlaying ? "Jeda rotasi otomatis" : "Lanjutkan rotasi otomatis"}
          >
            {isPlaying ? (
              <>
                <Pause className="size-3 text-primary" />
                <span className="hidden sm:inline">Auto</span>
              </>
            ) : (
              <>
                <Play className="size-3 text-slate-600" />
                <span className="hidden sm:inline">Jeda</span>
              </>
            )}
          </button>

          <span className="text-xs font-black tracking-tight text-foreground bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full shadow-2xs">
            0{currentIndex + 1} <span className="text-muted-foreground font-normal">/ 0{length}</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN SPOTLIGHT HERO CARD (Clean Solid Card - No Gradients) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] shadow-xs p-6 sm:p-8 md:p-10">
        {/* Solid Pattern Icon Watermark (Top Right) */}
        <div
          className="absolute top-5 right-8 text-[#E2E8F0] pointer-events-none select-none hidden sm:block"
          aria-hidden="true"
        >
          <Quote className="size-24 stroke-[1.5]" />
        </div>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
          >
            {/* Left Column: High-Res Executive Portrait & Trust Badge */}
            <div className="md:col-span-4 flex flex-col items-center sm:items-start">
              <div className="relative rounded-2xl overflow-hidden aspect-[23/26] w-full max-w-[240px] md:max-w-none bg-[#F1F5F9] shadow-xs border border-[#E2E8F0] group">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />

                {/* Floating Verified Badge (Solid Pure White) */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between rounded-xl bg-white px-2.5 py-1.5 shadow-xs border border-[#E2E8F0]">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                    <ShieldCheck className="size-3.5 text-primary shrink-0" />
                    <span>Terverifikasi</span>
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-black text-[11px]">
                    <Star className="size-3 fill-current" />
                    <span className="text-foreground">5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Headline Quote & Executive Credentials */}
            <div className="md:col-span-5 flex flex-col justify-between py-1">
              <div>
                {/* Solid Pattern Icon Accent */}
                <div className="inline-flex items-center justify-center size-8 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-primary mb-3">
                  <Quote className="size-4" />
                </div>

                {/* 5-Star Customer Rating & Quote Pill */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-700 bg-[#F1F5F9] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                    Skor 4.9 · Sangat Puas
                  </span>
                </div>

                {/* Quotation Body */}
                <blockquote className="font-semibold text-[16px] sm:text-[18px] md:text-[19px] leading-[1.55] tracking-tight text-[#111827]">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
              </div>

              {/* Executive Metadata */}
              <div className="pt-4 mt-5 border-t border-[#F1F2F6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-[15px] sm:text-[16px] text-[#111827] leading-tight">
                    {current.name}
                  </h3>
                  <p className="text-[12px] text-muted-foreground font-medium mt-0.5">
                    {current.role}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1 text-[11px] font-extrabold text-slate-700 shrink-0">
                  <Building2 className="size-3 text-primary" />
                  <span>{current.company}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Business Impact Metrics (Solid Cards) */}
            <div className="md:col-span-3 md:border-l md:border-[#F1F2F6] md:pl-6 flex flex-row md:flex-col justify-between gap-3 sm:gap-4 pt-3 md:pt-0 border-t border-[#F1F2F6] md:border-t-0">
              {/* Stat 1 Card (Solid Crave Light Card) */}
              <div className="flex-1 md:flex-none rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-primary mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Hasil Nyata</span>
                  <TrendingUp className="size-3.5 text-primary" />
                </div>
                <div className="font-black text-[28px] sm:text-[34px] text-primary leading-none tracking-tight">
                  {current.stat1}
                </div>
                <div className="text-[11px] sm:text-[12px] font-bold text-foreground mt-1 leading-snug">
                  {current.stat1Label}
                </div>
              </div>

              {/* Stat 2 Card (Solid Slate Card) */}
              <div className="flex-1 md:flex-none rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Kepatuhan</span>
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                </div>
                <div className="font-black text-[28px] sm:text-[34px] text-foreground leading-none tracking-tight">
                  {current.stat2}
                </div>
                <div className="text-[11px] sm:text-[12px] font-bold text-muted-foreground mt-1 leading-snug">
                  {current.stat2Label}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM SLIDER CONTROLS (Clean, Minimal & Tanpa Teks Kecil) */}
      <div className="mt-5 flex items-center justify-between px-2">
        {/* Clean Minimal Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-[#E2E8F0] hover:bg-slate-300"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Previous & Next Tactile Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="flex size-10 items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-slate-700 shadow-2xs hover:bg-[#F8FAFC] hover:text-primary active:scale-95 transition-all cursor-pointer"
            aria-label="Testimoni Sebelumnya"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="flex size-10 items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-slate-700 shadow-2xs hover:bg-[#F8FAFC] hover:text-primary active:scale-95 transition-all cursor-pointer"
            aria-label="Testimoni Selanjutnya"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSlider;
