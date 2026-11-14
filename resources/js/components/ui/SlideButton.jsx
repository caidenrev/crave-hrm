import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlideButton({
  onConfirm,
  title = "Presensi Masuk Sekarang",
  subtitle = "Geser untuk konfirmasi",
  confirmedTitle = "Presensi Berhasil Dicatat",
  confirmedSubtitle = "Kehadiran terverifikasi",
  isConfirmed = false,
  isLoading = false,
  disabled = false,
  variant = "primary", // "primary" | "destructive"
  className,
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(isConfirmed);

  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Sync with prop
  useEffect(() => {
    if (isConfirmed) {
      setCompleted(true);
    } else {
      setCompleted(false);
      setDragX(0);
    }
  }, [isConfirmed]);

  const getMaxDrag = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 200;
    const trackWidth = trackRef.current.clientWidth;
    const knobWidth = knobRef.current.clientWidth;
    return Math.max(0, trackWidth - knobWidth - 8); // 8px for 4px padding each side
  }, []);

  const handleStart = (clientX) => {
    if (disabled || isLoading || completed) return;
    startXRef.current = clientX - dragX;
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleMove = useCallback((clientX) => {
    if (!isDraggingRef.current || completed || disabled) return;
    const maxDrag = getMaxDrag();
    const newX = clientX - startXRef.current;
    const clampedX = Math.min(Math.max(0, newX), maxDrag);
    setDragX(clampedX);
  }, [completed, disabled, getMaxDrag]);

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current || completed || disabled) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const maxDrag = getMaxDrag();
    const threshold = maxDrag * 0.82; // 82% threshold to trigger

    if (dragX >= threshold) {
      setDragX(maxDrag);
      setCompleted(true);
      if (onConfirm) {
        onConfirm();
      }
    } else {
      // Snap back smoothly
      setDragX(0);
    }
  }, [completed, disabled, dragX, getMaxDrag, onConfirm]);

  // Touch Handlers (Mobile / PWA)
  const onTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = useCallback((e) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Mouse Handlers (Desktop)
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleEnd();
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleMove, handleEnd, onTouchMove, onTouchEnd]);

  // Compute text opacity based on drag progress
  const maxDrag = getMaxDrag();
  const progress = maxDrag > 0 ? dragX / maxDrag : 0;
  const textOpacity = completed ? 1 : Math.max(0.15, 1 - progress * 1.3);

  // Background color styles
  const isSuccessState = completed || isConfirmed;
  const trackBg = isSuccessState
    ? "bg-emerald-600 border-emerald-500 shadow-emerald-500/25"
    : variant === "destructive"
    ? "bg-destructive border-destructive shadow-destructive/25"
    : "bg-primary border-primary shadow-primary/25";

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-[62px] w-full select-none overflow-hidden rounded-full border p-1 shadow-lg transition-colors duration-300",
        trackBg,
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {/* Background Fill Layer showing slide progress */}
      {!isSuccessState && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all",
            variant === "destructive" ? "bg-rose-700/40" : "bg-white/20"
          )}
          style={{ width: `${Math.min(100, (dragX / (maxDrag || 1)) * 100 + 15)}%` }}
        />
      )}

      {/* Centered Action Text */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-12 text-center transition-opacity duration-200"
        style={{ opacity: textOpacity }}
      >
        <span className="text-sm font-bold tracking-tight text-white drop-shadow-xs sm:text-base">
          {isSuccessState ? confirmedTitle : title}
        </span>
        <span className="text-[11px] font-medium text-white/85">
          {isSuccessState ? confirmedSubtitle : subtitle}
        </span>
      </div>

      {/* Draggable Circular Knob (Thumb) */}
      <div
        ref={knobRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)",
        }}
        className={cn(
          "absolute top-1 bottom-1 flex h-[52px] w-[52px] cursor-grab items-center justify-center rounded-full bg-white shadow-md active:cursor-grabbing",
          isSuccessState
            ? "cursor-default text-emerald-600"
            : variant === "destructive"
            ? "text-destructive"
            : "text-primary",
          isLoading && "cursor-wait"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isSuccessState ? (
          <Check className="h-6 w-6 stroke-[3]" />
        ) : (
          <ArrowRight className="h-5 w-5 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </div>
  );
}
