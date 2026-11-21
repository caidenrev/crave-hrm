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
  Crown,
  CreditCard,
  Calendar,
  Clock,
  Check,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getEmployeeAvatar } from "@/lib/avatars";
import { cn } from "@/lib/utils";

const ALL_MODULES = [
  { title: "Dashboard", subtitle: "Ringkasan metrik & KPI bisnis", href: "/dashboard", tag: "Operasional" },
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

  // Dynamic notifications from server
  const serverNotifications = auth?.notifications || [];
  const storageKey = auth?.user?.id ? `crave_read_notifs_${auth.user.id}` : "crave_read_notifs_guest";

  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setReadIds(saved ? JSON.parse(saved) : []);
    } catch {
      setReadIds([]);
    }
  }, [storageKey]);

  const getNotifMeta = (n) => {
    switch (n.type) {
      case "leave":
        return { icon: Calendar, color: "bg-primary text-white shadow-xs" };
      case "overtime":
        return { icon: Clock, color: "bg-amber-500 text-white shadow-xs" };
      case "claim":
        return { icon: Receipt, color: "bg-emerald-600 text-white shadow-xs" };
      case "subscription":
        return { icon: AlertTriangle, color: "bg-rose-500 text-white shadow-xs" };
      case "announcement":
        return { icon: Bell, color: "bg-indigo-600 text-white shadow-xs" };
      default:
        return { icon: Bell, color: "bg-primary text-white shadow-xs" };
    }
  };

  const notificationsList = serverNotifications.map((n) => ({
    ...n,
    ...getNotifMeta(n),
    read: readIds.includes(n.id),
  }));

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const handleMarkAllAsRead = (e) => {
    e?.stopPropagation();
    const allIds = serverNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleNotificationClick = (item) => {
    const updated = Array.from(new Set([...readIds, item.id]));
    setReadIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    if (item.href) {
      router.visit(item.href);
    }
  };

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
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur w-full min-w-0">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 w-full min-w-0">
        {/* Title & Subtitle */}
        <div className="flex min-w-0 flex-1 items-center pr-1 sm:pr-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base md:text-xl font-extrabold tracking-tight text-foreground truncate">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 max-w-[65vw] sm:max-w-none justify-end">
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

          {/* Founder Console Quick Switch Button */}
          {auth?.is_founder && (
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-soft transition-all"
            >
              <Link href="/founder">
                <Crown className="size-4 text-white fill-white" />
                <span>Founder Console</span>
              </Link>
            </Button>
          )}

          {/* Notifikasi */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative size-9 rounded-xl border border-border/70 bg-card p-0 shadow-soft hover:bg-accent hover:border-primary/40 outline-none transition-all flex items-center justify-center shrink-0 cursor-pointer text-foreground"
                aria-label="Notifikasi"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              sideOffset={8}
              collisionPadding={16}
              className="w-80 p-0 rounded-2xl shadow-soft border border-border/70 bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-foreground">Notifikasi</h3>
                  {unreadCount > 0 ? (
                    <Badge className="rounded-full text-[10px] px-2 py-0 bg-primary/15 text-primary border border-primary/20 hover:bg-primary/20">
                      {unreadCount} Baru
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0 text-muted-foreground border-border/60">
                      Semua Terbaca
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto p-1.5 space-y-1">
                {notificationsList.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <Check className="size-4.5 stroke-[2.5]" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Tidak Ada Notifikasi</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Semua tugas dan pengajuan sudah selesai.</p>
                  </div>
                ) : (
                  notificationsList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl p-2.5 transition-colors cursor-pointer group text-left",
                          item.read
                            ? "hover:bg-muted/40 opacity-75"
                            : "bg-primary/5 hover:bg-primary/10 border border-primary/15 shadow-2xs"
                        )}
                      >
                        <div className={cn("mt-0.5 rounded-full p-2 shrink-0", item.color)}>
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={cn("text-xs font-bold truncate", item.read ? "text-foreground" : "text-primary")}>
                              {item.title}
                            </p>
                            {!item.read && (
                              <span className="size-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t border-border/60 bg-muted/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="w-full text-xs h-8 text-primary font-semibold hover:text-primary hover:bg-primary/10 cursor-pointer disabled:opacity-40"
                >
                  {unreadCount > 0 ? "Tandai semua dibaca" : "Semua notifikasi telah dibaca"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="size-9 rounded-xl border border-border/70 bg-card p-0.5 shadow-soft hover:bg-accent hover:border-primary/40 outline-none transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Menu Pengguna"
              >
                <div className="size-full rounded-lg overflow-hidden shrink-0 border border-border/40 bg-white">
                  <img
                    src={getEmployeeAvatar(user)}
                    alt={user?.name || "Profil"}
                    decoding="async"
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
                  <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border bg-white shadow-2xs">
                    <img
                      src={getEmployeeAvatar(user)}
                      alt={user?.name || "Profil"}
                      decoding="async"
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
              {auth?.is_founder && (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer font-bold text-primary">
                    <Link href="/founder" className="flex items-center w-full">
                      <Crown className="mr-2 size-4 text-amber-500 fill-amber-500" />
                      <span>Founder Console</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/subscription" className="flex items-center w-full">
                  <CreditCard className="mr-2 size-4" />
                  <span>Langganan & Tagihan</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex items-center w-full">
                  <UserIcon className="mr-2 size-4" />
                  <span>Pengaturan Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/rbac" className="flex items-center w-full">
                  <ShieldCheck className="mr-2 size-4" />
                  <span>Hak Akses Peran</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile?tab=sessions" className="flex items-center w-full">
                  <Laptop2 className="mr-2 size-4" />
                  <span>Sesi Perangkat</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => router.post('/logout')}
              >
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
