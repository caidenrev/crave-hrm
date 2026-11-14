import React from "react";
import { usePage, router, Link } from "@inertiajs/react";
import { Check, ChevronsUpDown, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CompanySwitcher({ collapsed = false }) {
  const { auth } = usePage().props;
  const activeCompany = auth?.active_company;
  const companies = auth?.companies || [];

  const handleSwitch = (companyId) => {
    if (companyId === activeCompany?.id) return;
    router.post(
      "/company/switch",
      { company_id: companyId },
      { preserveScroll: true }
    );
  };

  // Helper to extract a clean 1-2 letter initial
  const getInitial = (name) => {
    if (!name) return "C";
    const cleaned = name.replace(/^PT\s+/i, "").trim();
    return cleaned.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Pilih entitas perusahaan atau cabang"
          className={cn(
            "group flex w-full items-center justify-between gap-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/60 hover:border-border text-foreground transition-all duration-150 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
            collapsed ? "p-1.5 justify-center" : "px-2.5 py-2"
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Minimalist Monogram Badge */}
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/80 text-xs font-bold text-foreground transition-colors group-hover:border-border group-hover:bg-muted">
              {getInitial(activeCompany?.name)}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-xs font-semibold text-foreground">
                  {activeCompany?.name || "Pilih Perusahaan"}
                </div>
                <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {activeCompany?.is_holding ? "Holding Group" : "Subsidiary"}
                  {auth?.role && (
                    <span className="text-muted-foreground/80">
                      {" "}• {auth.role === "super_admin" ? "Super Admin" : auth.role.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl p-1.5 shadow-md border border-border/60 bg-popover text-popover-foreground animate-in fade-in-50 zoom-in-95 duration-100"
        align="start"
        sideOffset={6}
      >
        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
          Entitas Perusahaan
        </DropdownMenuLabel>
        
        <div className="space-y-0.5 mt-0.5">
          {companies.map((comp) => {
            const isActive = comp.id === activeCompany?.id;
            return (
              <DropdownMenuItem
                key={comp.id}
                onClick={() => handleSwitch(comp.id)}
                className={cn(
                  "flex items-center justify-between gap-2.5 rounded-lg px-2 py-1.5 text-xs cursor-pointer transition-colors outline-none",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold transition-colors",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/50 bg-muted/40 text-muted-foreground"
                    )}
                  >
                    {getInitial(comp.name)}
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className={cn("truncate text-xs", isActive ? "font-semibold text-foreground" : "text-foreground")}>
                      {comp.name}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground capitalize mt-0.5">
                      {comp.role ? comp.role.replace("_", " ") : (comp.is_holding ? "Holding" : "Subsidiary")}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <Check className="size-3.5 shrink-0 text-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1 border-border/40" />

        <DropdownMenuItem
          asChild
          className="rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Link href="/organization/branches" className="flex items-center gap-2 w-full">
            <Settings className="size-3.5 text-muted-foreground" />
            <span>Kelola Cabang &amp; Entitas</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
