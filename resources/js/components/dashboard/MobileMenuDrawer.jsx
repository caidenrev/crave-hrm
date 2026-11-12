import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Search,
  ChevronDown,
  Sun,
  Moon,
  X,
  SlidersHorizontal,
  User as UserIcon,
  LogOut,
  MoreVertical,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
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
import { CompanySwitcher } from "./CompanySwitcher";
import {
  MENU_OPERASIONAL,
  MENU_TALENTA,
  MENU_PENGATURAN,
} from "./navigationItems";
import { cn } from "@/lib/utils";

export function MobileMenuDrawer({ open, onOpenChange }) {
  const { url, props } = usePage();
  const user = props.auth?.user;
  const currentPath = url.split("?")[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  const isGroupActive = (item) =>
    item.children?.some((c) => currentPath === c.href) ||
    (item.href !== "/" && currentPath.startsWith(item.href));

  const [openGroup, setOpenGroup] = useState(() => {
    const allItems = [...MENU_OPERASIONAL, ...MENU_TALENTA, ...MENU_PENGATURAN];
    const matched = allItems.find((item) => item.children && isGroupActive(item));
    return matched ? matched.href : null;
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const allItems = [...MENU_OPERASIONAL, ...MENU_TALENTA, ...MENU_PENGATURAN];
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
      active
        ? "bg-primary text-primary-foreground shadow-soft"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  const query = searchQuery.trim().toLowerCase();

  const filterItems = (items) => {
    if (!query) return items;
    return items
      .map((item) => {
        if (item.children) {
          const matchedChildren = item.children.filter((c) =>
            c.label.toLowerCase().includes(query)
          );
          if (matchedChildren.length > 0) {
            return { ...item, children: matchedChildren };
          }
        }
        if (item.label.toLowerCase().includes(query)) {
          return item;
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredMenu = filterItems(MENU_OPERASIONAL);
  const filteredTalenta = filterItems(MENU_TALENTA);
  const filteredPengaturan = filterItems(MENU_PENGATURAN);

  const renderItem = (item) => {
    const Icon = item.icon;

    if (item.children) {
      const groupActive = isGroupActive(item);
      const isOpen = query ? true : openGroup === item.href;

      return (
        <div key={item.href} className="space-y-1">
          <button
            type="button"
            onClick={() => setOpenGroup(openGroup === item.href ? null : item.href)}
            className={cn(
              itemClass(false),
              "w-full",
              groupActive && "text-primary hover:text-primary font-bold"
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            <span className="flex-1 truncate text-left">{item.label}</span>
            <ChevronDown
              className={cn("size-4 transition-transform", isOpen && "rotate-180")}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-out",
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="ml-5 space-y-1 border-l pl-3 pt-1">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive = currentPath === child.href;

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isChildActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
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
      <Link
        key={item.href}
        href={item.href}
        onClick={() => onOpenChange(false)}
        className={itemClass(isActive)}
      >
        <Icon className="size-4.5 shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[300px] sm:w-[320px] p-0 flex flex-col h-full bg-sidebar border-r border-border"
      >
        {/* Top Header Drawer with Brand & Close Button */}
        <div className="flex shrink-0 flex-col gap-3 px-3.5 pt-4 pb-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 shrink-0 place-items-center">
                <img
                  src={isDark ? "/dark-mode-logo.png" : "/light-mode-logo.png"}
                  alt="Crave HRM"
                  className="size-8 object-contain"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-base font-extrabold tracking-tight text-foreground">
                  Crave
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Human Resource Management
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Tutup Menu"
            >
              <X className="size-4" />
            </Button>
          </div>

          <CompanySwitcher />

          {/* Quick Module Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul..."
              className="rounded-xl bg-muted pl-9 pr-8 text-xs border-transparent focus-visible:border-primary/50"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto space-y-4 px-3.5 py-3">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Operasional
            </p>
            {filteredMenu.map(renderItem)}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Talenta & Tim
            </p>
            {filteredTalenta.map(renderItem)}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Pengaturan
            </p>
            {filteredPengaturan.map(renderItem)}
          </div>
        </div>

        {/* Bottom Theme & Account Footer */}
        <div className="mt-auto shrink-0 flex flex-col gap-2.5 p-3.5 border-t border-border/60 bg-sidebar">
          {/* Light / Dark Mode Toggle */}
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

          {/* User Profile Info */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-2xl border bg-card p-2 shadow-soft outline-none hover:bg-accent transition-colors">
                <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border bg-muted shadow-2xs">
                  <img
                    src="/profile-logo.jpeg"
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 leading-tight text-left">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user?.name || "Eka Revandi"}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {user?.email || "founder@craveservices.my.id"}
                  </p>
                </div>
                <MoreVertical className="size-4 text-muted-foreground" />
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
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenuDrawer;
