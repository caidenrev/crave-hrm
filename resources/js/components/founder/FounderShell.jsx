import { Link, usePage, router } from "@inertiajs/react";
import {
  Building2,
  CreditCard,
  ExternalLink,
  LayoutGrid,
  LogOut,
  Moon,
  Settings,
  ShieldAlert,
  Sun,
  Users,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "ringkasan", href: "/founder", label: "Ringkasan", icon: LayoutGrid },
  { id: "companies", href: "/founder/companies", label: "Perusahaan", icon: Building2 },
  { id: "invoices", href: "/founder/invoices", label: "Pembayaran", icon: CreditCard },
  { id: "leads", href: "/founder/leads", label: "Prospek Sales", icon: UserPlus },
  { id: "settings", href: "/founder/settings", label: "Pengaturan", icon: Settings },
];

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setDark(el.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return { dark, toggle: () => document.documentElement.classList.toggle("dark") };
}

export function FounderShell({ children }) {
  const { url, props } = usePage();
  const { dark, toggle } = useDark();
  const user = props.auth?.user;

  const currentPath = url.split("?")[0];
  const isActive = (href) => {
    if (href === "/founder") return currentPath === "/founder";
    return currentPath.startsWith(href);
  };

  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans antialiased text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card p-4 lg:flex">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="grid size-9 shrink-0 place-items-center">
            <img
              src="/light-mode-logo.png"
              alt="Crave"
              className="size-9 object-contain dark:hidden"
            />
            <img
              src="/dark-mode-logo.png"
              alt="Crave"
              className="size-9 object-contain hidden dark:block"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-extrabold tracking-tight text-foreground">
              Crave
            </p>
            <p className="truncate text-xs text-muted-foreground font-normal">
              Founder Console
            </p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t pt-4">
          <div className="px-1">
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || "founder@craveservices.my.id"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-xl"
              onClick={toggle}
              aria-label={dark ? "Mode terang" : "Mode gelap"}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl text-xs font-bold" onClick={handleLogout}>
              <LogOut className="size-4 mr-1.5" /> Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Mobile Header (Crave POS Parity) */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="leading-tight">
            <p className="text-xl font-black tracking-tight text-foreground">
              Crave
            </p>
            <p className="text-xs text-muted-foreground font-normal">Founder Console</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="size-9 rounded-full border border-border/80 bg-background/80 flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer"
              aria-label={dark ? "Mode terang" : "Mode gelap"}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="size-9 rounded-full border border-border/80 bg-background/80 flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer"
              aria-label="Keluar"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-3 pb-28 pt-4 sm:px-6 lg:pb-10 lg:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Frosted Glassmorphism - Crave POS Parity) */}
      <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md lg:hidden">
        <nav className="flex items-center justify-between rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-card/70 p-1.5 shadow-2xl backdrop-blur-2xl">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 text-[11px] transition-all",
                  active
                    ? "bg-black/10 dark:bg-white/15 text-foreground font-bold shadow-xs"
                    : "text-foreground/75 dark:text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 font-medium"
                )}
              >
                <Icon className={cn("size-5 shrink-0", active ? "text-foreground" : "text-foreground/80 dark:text-foreground/70")} />
                <span className="truncate tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
