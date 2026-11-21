"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Building2 } from "lucide-react";

const AUTO_PLAY_INTERVAL = 5500; // 5.5 detik rotasi otomatis yang tenang

export function TestimonialSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const length = testimonials.length;
  const touchStartX = useRef(null);
  const progressIntervalRef = useRef(null);

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

  // Timer rotasi otomatis dan progress bar halus
  useEffect(() => {
    if (isPaused || length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepTime = 50;
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
  }, [isPaused, length, nextSlide]);

  // Touch gesture swipe untuk mobile & tablet
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
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 320, damping: 30 },
        opacity: { duration: 0.28 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 320, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  if (!current) return null;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* MAIN TESTIMONIAL CARD (Clean Minimalist Enterprise Surface) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-9 md:p-11 transition-all">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-11 items-center"
          >
            {/* Left Column: Portrait & Identity */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative aspect-[4/4.8] w-full max-w-[220px] sm:max-w-[240px] lg:max-w-none rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="size-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Verified Customer Badge */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-3.5">
                <ShieldCheck className="size-4 text-primary shrink-0" />
                <span>Klien Terverifikasi Crave HRM</span>
              </div>
            </div>

            {/* Right Column: Quotation, Executive Info & Key Results */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1.5 mb-3.5 justify-center lg:justify-start">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-1">
                    5.0 • Sangat Puas
                  </span>
                </div>

                {/* The Quotation */}
                <blockquote className="font-bold text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.5] tracking-tight text-slate-900 text-center lg:text-left">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center lg:text-left">
                  <div>
                    <h3 className="font-extrabold text-[16px] sm:text-[17px] text-slate-900 leading-snug">
                      {current.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                      {current.role}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/80 px-3.5 py-1 text-xs font-semibold text-slate-700 self-center sm:self-auto shrink-0">
                    <Building2 className="size-3.5 text-primary shrink-0" />
                    <span>{current.company}</span>
                  </div>
                </div>
              </div>

              {/* Key Business Results Metrics */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-4 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Dampak Nyata
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-primary leading-tight tracking-tight mt-1">
                    {current.stat1}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                    {current.stat1Label}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-4 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Standar Kepatuhan
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-slate-900 leading-tight tracking-tight mt-1">
                    {current.stat2}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                    {current.stat2Label}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* MINIMALIST BOTTOM CONTROLS (Clean Progress Indicators & Arrows) */}
      <div className="mt-5 flex items-center justify-between px-2 sm:px-3">
        {/* Segmented Timeline Progress Bars */}
        <div className="flex items-center gap-2 sm:gap-3">
          {testimonials.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectSlide(idx)}
                className="group flex flex-col items-start gap-1 cursor-pointer py-1 text-left"
                aria-label={`Pilih testimoni ${item.name}`}
              >
                <div className="h-1.5 w-12 sm:w-16 rounded-full bg-slate-200 overflow-hidden transition-all duration-300">
                  {isActive ? (
                    <motion.div
                      className="h-full bg-primary"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.05 }}
                    />
                  ) : (
                    <div className="h-full w-0 group-hover:w-full group-hover:bg-slate-300 transition-all duration-200" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold transition-colors hidden sm:inline ${
                    isActive ? "text-primary font-bold" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {item.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimal Tactile Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-slate-300 active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Testimoni Sebelumnya"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-slate-300 active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Testimoni Selanjutnya"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSlider;
