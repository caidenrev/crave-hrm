import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <a
      href="/"
      className={cn("relative z-50 flex items-center gap-2.5 cursor-pointer select-none group", className)}
    >
      <img
        src="/light-mode-logo.png"
        alt="Crave HRM Logo"
        className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
      />
      <span className="text-[17px] font-extrabold tracking-[-0.03em] text-[#111827]">
        Crave <span className="text-[#6B7280] font-bold">HRM</span>
      </span>
    </a>
  );
}

export default Logo;
