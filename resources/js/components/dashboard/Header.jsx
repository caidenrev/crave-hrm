import React, { useState, useRef, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
  Bell,
  Search,
  User as UserIcon,
  ShieldCheck,
  Laptop2,
  LogOut,
  AlertTriangle,
  Receipt,
  Menu,
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

const ALL_MODULES = [
  { title: "Dashboard", subtitle: "Ringkasan metrik & KPI bisnis", href: "/", tag: "Operasional" },
  { title: "Data Karyawan", subtitle: "Daftar talenta & profil karyawan", href: "/employees", tag: "Talenta" },
  { title: "Pengumuman Internal", subtitle: "Papan edaran & kebijakan resmi", href: "/announcements", tag: "Pengaturan" },
  { title: "Cabang & Geofence", subtitle: "Lokasi cabang & koordinat presensi", href: "/organization/branches", tag: "Organisasi" },
  { title: "Struktur Organisasi", subtitle: "Bagan hierarki departemen & divisi", href: "/organization/chart", tag: "Organisasi" },
  { title: "Matriks Izin RBAC", subtitle: "Matriks wewenang 5 peran pengguna", href: "/organization/rbac-matrix", tag: "Organisasi" },
  { title: "Kalender Hari Libur", subtitle: "Kalender libur nasional SKB 3 Menteri", href: "/calendar", tag: "Operasional" },
  { title: "Presensi Harian", subtitle: "Presensi GPS selfie & jadwal shift", href: "/attendance", tag: "Operasional" },
  { title: "Klaim & Lembur", subtitle: "Pengajuan lembur & reimbursement", href: "/claims", tag: "Operasional" },
  { title: "Crave Canteen", subtitle: "Voucher makan QR & merchant POS", href: "/canteen", tag: "Operasional" },
  { title: "Payroll Management", subtitle: "Kalkulasi PPh 21, BPJS & slip gaji", href: "/payroll", tag: "Kompensasi" },
];

export function Header({ title, subtitle, actions, onOpenMobileMenu }) {
  const { auth } = usePage().props;
  const user = auth?.user || {
    name: "Eka Revandi",
    email: "founder@craveservices.my.id",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const filteredModules = searchQuery.trim()
    ? ALL_MODULES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectModule = (href) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.visit(href);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2.5 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        {/* Title & Subtitle + Mobile Hamburger */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5 pr-1 sm:pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="size-8 rounded-xl text-muted-foreground hover:text-foreground lg:hidden shrink-0 -ml-1"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="size-4.5" />
          </Button>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold tracking-tight sm:text-xl text-foreground truncate">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-[11px] text-muted-foreground sm:text-xs truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Functional Global Search Bar */}
          <div ref={searchRef} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Cari data atau modul..."
              className="w-40 md:w-48 lg:w-56 focus:w-64 rounded-xl pl-9 h-9 text-xs bg-muted/40 border-border/50 transition-all duration-200"
            />

            {/* Quick Navigation Results Dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute left-0 top-full mt-1.5 w-80 rounded-2xl border border-border/70 bg-card p-1.5 shadow-soft z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Hasil Pencarian Modul ({filteredModules.length})
                </div>
                {filteredModules.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    Modul tidak ditemukan.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {filteredModules.map((m) => (
                      <button
                        key={m.href}
                        type="button"
                        onClick={() => handleSelectModule(m.href)}
                        className="w-full flex items-center justify-between gap-2 rounded-xl p-2 text-left hover:bg-muted/60 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {m.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {m.subtitle}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 font-medium rounded-md">
                          {m.tag}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
              <button
                className="size-9 rounded-xl border border-border/70 bg-card p-0.5 shadow-soft hover:bg-accent hover:border-primary/40 outline-none transition-all flex items-center justify-center shrink-0"
                aria-label="Menu Pengguna"
              >
                <div className="size-full rounded-lg overflow-hidden shrink-0 border border-border/40 bg-muted">
                  <img
                    src="/profile-logo.jpeg"
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-60 rounded-xl shadow-soft p-1"
            >
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border bg-muted shadow-2xs">
                    <img
                      src="/profile-logo.jpeg"
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {user?.name || "Eka Revandi"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user?.email || "founder@craveservices.my.id"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
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
