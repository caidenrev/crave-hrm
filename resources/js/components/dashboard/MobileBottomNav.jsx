import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Clock,
  UtensilsCrossed,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { url } = usePage();

  const navItems = [
    { label: "Dasbor", href: "/", icon: LayoutDashboard },
    { label: "Presensi", href: "/attendance", icon: Clock },
    { label: "Kantin", href: "/canteen", icon: UtensilsCrossed },
    { label: "Karyawan", href: "/employees", icon: Users },
    { label: "Akses", href: "/organization/rbac-matrix", icon: SlidersHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive =
            url === item.href || (item.href !== "/" && url.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors",
                isActive
                  ? "text-primary font-bold"
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
      </div>
    </nav>
  );
}
