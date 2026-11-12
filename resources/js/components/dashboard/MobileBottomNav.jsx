import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Clock,
  UtensilsCrossed,
  Users,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav({ onOpenMobileMenu }) {
  const { url } = usePage();

  const primaryItems = [
    { label: "Dasbor", href: "/", icon: LayoutDashboard },
    { label: "Presensi", href: "/attendance", icon: Clock },
    { label: "Kantin", href: "/canteen", icon: UtensilsCrossed },
    { label: "Karyawan", href: "/employees", icon: Users },
  ];

  const isMenuPageActive = !primaryItems.some(
    (item) => url === item.href || (item.href !== "/" && url.startsWith(item.href))
  );

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-1">
        {primaryItems.map((item) => {
          const isActive =
            url === item.href || (item.href !== "/" && url.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all",
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4.5" />
              <span className="text-[10px] font-semibold mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 5th Button: Open Full Mobile Menu Drawer */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className={cn(
            "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all",
            isMenuPageActive
              ? "text-primary font-bold scale-105"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Buka Semua Menu"
        >
          <Menu className="size-4.5" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
