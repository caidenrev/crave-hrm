import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({ view = "card", onViewChange, className = "" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/40 bg-muted p-1 shadow-xs",
        className
      )}
      role="group"
      aria-label="Pilihan Tampilan"
    >
      <button
        type="button"
        onClick={() => onViewChange("card")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
          view === "card"
            ? "bg-card text-foreground shadow-soft font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Tampilan Kartu (Card View)"
        aria-pressed={view === "card"}
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">Kartu</span>
      </button>

      <button
        type="button"
        onClick={() => onViewChange("list")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
          view === "list"
            ? "bg-card text-foreground shadow-soft font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Tampilan Daftar (List View)"
        aria-pressed={view === "list"}
      >
        <List className="size-3.5" />
        <span className="hidden sm:inline">Daftar</span>
      </button>
    </div>
  );
}

