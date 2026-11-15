import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  Menu,
} from "lucide-react";
import GlassNav from "@/components/dashboard/GlassNav";

const tabs = [
  { id: "dashboard", label: "Dasbor", to: "/dashboard", icon: LayoutDashboard, noFill: true },
  { id: "attendance", label: "Presensi", to: "/attendance", icon: Clock, noFill: true },
  { id: "leave", label: "Cuti", to: "/leave", icon: CalendarDays, noFill: true },
  { id: "payroll", label: "Payroll", to: "/payroll", icon: FileSpreadsheet, noFill: true },
  { id: "menu", label: "Lainnya", to: "#menu", icon: Menu, noFill: true },
];

function useHtmlDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setDark(el.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const getTabFromUrl = (pathname) => {
  const currentPath = (pathname || "").split("?")[0];
  if (currentPath === "/dashboard" || currentPath.startsWith("/dashboard")) return "dashboard";
  if (currentPath.startsWith("/attendance")) return "attendance";
  if (currentPath.startsWith("/leave")) return "leave";
  if (currentPath.startsWith("/payroll")) return "payroll";
  return "menu";
};

export function MobileBottomNav({ onOpenMobileMenu }) {
  const { url } = usePage();
  const dark = useHtmlDark();

  const [activeTab, setActiveTab] = useState(() => getTabFromUrl(url));

  useEffect(() => {
    setActiveTab(getTabFromUrl(url));
  }, [url]);

  const handleChange = (id) => {
    if (id === "menu") {
      onOpenMobileMenu?.();
      return;
    }
    // Optimistically update activeTab so the spring animation begins immediately on tap
    setActiveTab(id);
    const target = tabs.find((t) => t.id === id);
    if (target?.to && target.to !== "#menu") {
      router.visit(target.to);
    }
  };

  return (
    <div
      className="lg:hidden fixed bottom-4 inset-x-3 z-[9999] mx-auto pointer-events-auto"
      style={{ maxWidth: 480 }}
    >
      <GlassNav
        tabs={tabs}
        value={activeTab}
        theme={dark ? "dark" : "light"}
        onChange={handleChange}
      />
    </div>
  );
}

export default MobileBottomNav;
