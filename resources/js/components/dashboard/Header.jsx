import React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
  Bell,
  Search,
  User as UserIcon,
  ShieldCheck,
  Laptop2,
  LogOut,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header({ title, subtitle, actions }) {
  const { auth } = usePage().props;
  const user = auth?.user || {
    name: "Eka Revandi",
    email: "founder@craveservices.my.id",
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        {/* Title & Subtitle */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold tracking-tight sm:text-xl text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari data atau modul..."
              className="w-64 rounded-xl pl-9 h-9 text-xs bg-muted/40 border-input"
            />
          </div>

          {actions}

          {/* Notifikasi */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-xl size-9"
              >
                <Bell className="size-4" />
                <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px] bg-primary text-primary-foreground">
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              collisionPadding={16}
              className="w-80 p-0 rounded-2xl shadow-soft"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-bold text-sm">Notifikasi</h3>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  3 Baru
                </Badge>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                <div className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="mt-0.5 rounded-full p-1.5 bg-primary/10 text-primary">
                    <Receipt className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Pengajuan Cuti Tahunan
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      Budi Santoso mengajukan cuti 3 hari (14-16 Nov 2026).
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      10 menit yang lalu
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="mt-0.5 rounded-full p-1.5 bg-warning/10 text-warning">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Lembur SPKL Menunggu Review
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      2 staf logistik mengajukan lembur 4 jam.
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      1 jam yang lalu
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-xs h-8 text-primary"
                >
                  Tandai semua dibaca
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border bg-card px-1.5 py-1 shadow-soft hover:bg-accent outline-none transition-colors sm:px-2 sm:py-1.5">
                <div className="size-6 rounded-full overflow-hidden shrink-0 border border-border bg-muted shadow-2xs sm:size-7">
                  <img
                    src="/profile-logo.jpeg"
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
                <div className="hidden leading-tight text-left sm:block">
                  <p className="text-xs font-bold text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {user?.email || "No Email"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-56 rounded-xl shadow-soft"
            >
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 size-4" />
                <span>Pengaturan Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShieldCheck className="mr-2 size-4" />
                <span>Hak Akses Peran</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Laptop2 className="mr-2 size-4" />
                <span>Sesi Perangkat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
