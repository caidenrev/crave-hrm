import React from "react";
import { usePage, router } from "@inertiajs/react";
import { Building2, Check, ChevronsUpDown, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-full justify-between gap-2 border-sidebar-border bg-sidebar hover:bg-sidebar-accent/50 text-sidebar-foreground rounded-xl transition-all ${
            collapsed ? "px-2" : "px-3"
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col text-left truncate">
                <span className="truncate text-xs font-bold leading-tight">
                  {activeCompany?.name || "Pilih Perusahaan"}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {activeCompany?.is_holding ? "Holding Group" : "Subsidiary"}
                  {auth?.role && (
                    <span className="capitalize font-semibold text-primary">
                      &bull; {auth.role.replace("_", " ")}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          {!collapsed && <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-2xl p-1.5 shadow-soft border-border" align="start">
        <DropdownMenuLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-2 py-1.5">
          Entitas Perusahaan Aktif
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companies.map((comp) => {
          const isActive = comp.id === activeCompany?.id;
          return (
            <DropdownMenuItem
              key={comp.id}
              onClick={() => handleSwitch(comp.id)}
              className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-bold">{comp.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {comp.role.replace("_", " ")}
                  </span>
                </div>
              </div>
              {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
