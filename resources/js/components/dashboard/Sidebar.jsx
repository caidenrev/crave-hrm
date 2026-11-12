import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  Receipt,
  UtensilsCrossed,
  UserCheck,
  Users,
  Compass,
  Megaphone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  MoreVertical,
  LogOut,
  User as UserIcon,
  Camera,
  CalendarClock,
  ClipboardList,
  CheckSquare,
  Timer,
  MapPin,
  QrCode,
  ScanBarcode,
  Calculator,
  FileText,
  Landmark,
  Building2,
  Network,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanySwitcher } from "./CompanySwitcher";
import {
  MENU_OPERASIONAL,
  MENU_TALENTA,
  MENU_PENGATURAN,
} from "./navigationItems";
import { cn } from "@/lib/utils";

function Row({ collapsed, children, label }) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" className="rounded-lg text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({ collapsed, setCollapsed }) {
  const { url, props } = usePage();
  const user = props.auth?.user;
  const currentPath = url.split("?")[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  const menu = MENU_OPERASIONAL;
  const talenta = MENU_TALENTA;
  const pengaturan = MENU_PENGATURAN;

  const isGroupActive = (item) =>
    item.children?.some((c) => currentPath === c.href) ||
    (item.href !== "/" && currentPath.startsWith(item.href));

  const [openGroup, setOpenGroup] = useState(() => {
    const allItems = [...menu, ...talenta, ...pengaturan];
    const matched = allItems.find((item) => item.children && isGroupActive(item));
    return matched ? matched.href : null;
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const allItems = [...menu, ...talenta, ...pengaturan];
    const matched = allItems.find((item) => item.children && isGroupActive(item));
    if (matched) {
      setOpenGroup(matched.href);
    }
  }, [currentPath]);

  const toggleTheme = (dark) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  };

  const itemClass = (active) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
      collapsed && "justify-center px-0",
      active
        ? "bg-primary text-primary-foreground shadow-soft"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  const query = searchQuery.trim().toLowerCase();

  const filterItems = (items) => {
    if (!query) return items;
    return items
      .map((item) => {
        if (!item.children) {
          return item.label.toLowerCase().includes(query) ? item : null;
        }
        const parentMatch = item.label.toLowerCase().includes(query);
        const matchingChildren = item.children.filter((c) =>
          c.label.toLowerCase().includes(query)
        );
        if (parentMatch) return item;
        if (matchingChildren.length > 0) {
          return { ...item, children: matchingChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  const renderItem = (item) => {
    const Icon = item.icon;

    if (item.children) {
      const groupActive = isGroupActive(item);
      const open = !collapsed && (query ? true : openGroup === item.href);

      return (
        <div key={item.href} className="space-y-1">
          <Row collapsed={collapsed} label={item.label}>
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                  setOpenGroup(item.href);
                } else {
                  setOpenGroup(openGroup === item.href ? null : item.href);
                }
              }}
              className={cn(
                itemClass(false),
                "w-full",
                groupActive && "text-primary hover:text-primary"
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  <ChevronDown
                    className={cn("size-4 transition-transform", open && "rotate-180")}
                  />
                </>
              )}
            </button>
          </Row>

          <div
            className={cn(
              "grid transition-all duration-300 ease-out",
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="ml-5 space-y-1 border-l pl-3 pt-1">
                {item.children.map((child, i) => {
                  const ChildIcon = child.icon;
                  const childActive = currentPath === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        itemClass(childActive),
                        "transition-all duration-300 ease-out",
                        open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                      )}
                      style={{ transitionDelay: open ? `${60 + i * 60}ms` : "0ms" }}
                    >
                      <ChildIcon className="size-4 shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const isActive =
      currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));

    return (
      <Row key={item.href} collapsed={collapsed} label={item.label}>
        <Link href={item.href} className={itemClass(isActive)}>
          <Icon className="size-4.5 shrink-0" />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        </Link>
      </Row>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden border-r bg-sidebar transition-[width] duration-300 lg:block",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <TooltipProvider delayDuration={100}>
        <div className="flex h-full flex-col px-3 py-4">
          {/* Header Brand */}
          <div className="flex shrink-0 flex-col gap-3">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
              <div className="grid size-8 shrink-0 place-items-center">
                <img
                  src="/light-mode-logo.png"
                  alt="Crave"
                  className="size-8 object-contain dark:hidden"
                />
                <img
                  src="/dark-mode-logo.png"
                  alt="Crave"
                  className="size-8 object-contain hidden dark:block"
                />
              </div>
              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-base font-extrabold tracking-tight text-foreground">
                    Crave
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Human Resource Management
                  </p>
                </div>
              )}
            </div>

            {/* Company Switcher */}
            <CompanySwitcher collapsed={collapsed} />

            {/* Quick Search */}
            {collapsed ? (
              <Row collapsed label="Cari modul">
                <Button
                  variant="secondary"
                  size="icon"
                  className="mx-auto rounded-xl"
                  onClick={() => setCollapsed(false)}
                >
                  <Search className="size-4" />
                </Button>
              </Row>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari modul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl bg-muted pl-9 pr-9 border-transparent text-xs h-9"
                />
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto space-y-4 py-2 mt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Menu Operasional */}
            {filterItems(menu).length > 0 && (
              <div className="space-y-1">
                <p
                  className={cn(
                    "px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                    collapsed && "hidden"
                  )}
                >
                  Operasional
                </p>
                {filterItems(menu).map(renderItem)}
              </div>
            )}

            {/* Menu Talenta & Organisasi */}
            {filterItems(talenta).length > 0 && (
              <div className="space-y-1">
                <p
                  className={cn(
                    "px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                    collapsed && "hidden"
                  )}
                >
                  Talenta & Tim
                </p>
                {filterItems(talenta).map(renderItem)}
              </div>
            )}

            {/* Menu Pengaturan */}
            {filterItems(pengaturan).length > 0 && (
              <div className="space-y-1">
                <p
                  className={cn(
                    "px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                    collapsed && "hidden"
                  )}
                >
                  Pengaturan
                </p>
                {filterItems(pengaturan).map(renderItem)}
              </div>
            )}
          </div>

          {/* Theme & User Profile Footer */}
          <div className="mt-auto flex shrink-0 flex-col gap-3 pt-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleTheme(false)}
                  className={cn("rounded-xl p-2 transition-colors", !isDark && "bg-secondary text-secondary-foreground")}
                  title="Light mode"
                >
                  <Sun className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme(true)}
                  className={cn("rounded-xl p-2 transition-colors", isDark && "bg-secondary text-secondary-foreground")}
                  title="Dark mode"
                >
                  <Moon className="size-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => toggleTheme(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                    !isDark ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="size-4" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme(true)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                    isDark ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="size-4" /> Dark
                </button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl border bg-card p-2 shadow-soft outline-none hover:bg-accent transition-colors",
                    collapsed &&
                      "justify-center border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
                  )}
                >
                  <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border bg-muted shadow-2xs">
                    <img
                      src="/profile-logo.jpeg"
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  </div>
                  {!collapsed && (
                    <>
                      <div className="min-w-0 flex-1 leading-tight text-left">
                        <p className="truncate text-xs font-bold text-foreground">
                          {user?.name || "Eka Revandi"}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {user?.email || "founder@craveservices.my.id"}
                        </p>
                      </div>
                      <MoreVertical className="size-4 text-muted-foreground" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={12} className="w-56 rounded-xl">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  <span>Pengaturan Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Absolute Toggle Button on the right border */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-7 z-40 hidden size-7 rounded-full shadow-soft lg:flex bg-primary text-primary-foreground"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </TooltipProvider>
    </aside>
  );
}
