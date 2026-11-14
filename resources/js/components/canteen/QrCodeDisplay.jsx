import React, { useMemo } from "react";
import { generateQRMatrix } from "@/lib/qrEncoder";
import { UtensilsCrossed } from "lucide-react";

export function QrCodeDisplay({ value, size = 240, className = "" }) {
  const qrData = useMemo(() => {
    if (!value) return null;
    try {
      return generateQRMatrix(value);
    } catch (e) {
      console.error("QR Code generation error:", e);
      return null;
    }
  }, [value]);

  if (!qrData) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-2xl bg-muted/40 border border-border/50 text-muted-foreground text-xs ${className}`}
      >
        Menyiapkan QR Code...
      </div>
    );
  }

  const { count, matrix } = qrData;
  const cellSize = 10;
  const margin = 16;
  const svgSize = count * cellSize + margin * 2;

  // Render cells as SVG rects
  const rects = [];
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c]) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={margin + c * cellSize}
            y={margin + r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="currentColor"
            className="text-slate-900"
          />
        );
      }
    }
  }

  // Center badge cutout
  const centerSize = 44;
  const centerOffset = svgSize / 2 - centerSize / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl sm:rounded-3xl bg-white border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ${className}`}
    >
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={size}
        height={size}
        className="w-full h-auto max-w-full"
      >
        {/* Background */}
        <rect width={svgSize} height={svgSize} fill="#FFFFFF" rx="14" />

        {/* QR Matrix Dots */}
        {rects}

        {/* Center Badge Cutout */}
        <rect
          x={centerOffset}
          y={centerOffset}
          width={centerSize}
          height={centerSize}
          rx="12"
          fill="#FFFFFF"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Center Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
          <UtensilsCrossed className="size-4.5" />
        </div>
      </div>
    </div>
  );
}
