import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { cn } from "@/lib/utils";

export default function AuthenticatedLayout({
  title,
  subtitle,
  actions,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Desktop SideNav */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-[padding] duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <Header
          title={title}
          subtitle={subtitle}
          actions={actions}
        />

        <main className="mx-auto max-w-[1400px] px-3 pb-24 pt-3 sm:px-6 sm:pt-4 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
