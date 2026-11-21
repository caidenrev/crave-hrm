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
  { id: "leads", href: "/founder/leads", label: "Prospek Sales", icon: UserPlus },
  { id: "companies", href: "/founder/companies", label: "Perusahaan", icon: Building2 },
  { id: "invoices", href: "/founder/invoices", label: "Pembayaran", icon: CreditCard },
  { id: "settings", href: "/founder/settings", label: "Pengaturan & Paket", icon: Settings },
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
        <div className="flex items-center gap-3 px-2 py-1">
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
              Crave <span className="text-primary">HRM</span>
            </p>
            <p className="truncate text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Founder Console
            </p>
          </div>
        </div>

        {/* Quick return to HRM Tenant */}
        <div className="mt-4 px-1">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <span>Buka HRM Tenant</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t pt-3">
          <div className="px-2">
            <p className="truncate text-xs font-bold text-foreground">{user?.name || "Eka Revandi"}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.email || "founder@craveservices.my.id"}</p>
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
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
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
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-tight text-foreground">
                Crave <span className="text-primary">HRM</span>
              </p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Founder Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-primary flex items-center gap-1 border border-primary/20 rounded-lg px-2 py-1"
            >
              HRM
              <ExternalLink className="size-3" />
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl size-8"
              onClick={toggle}
              aria-label={dark ? "Mode terang" : "Mode gelap"}
            >
              {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl size-8" onClick={handleLogout} aria-label="Keluar">
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-3 pb-28 pt-4 sm:px-6 lg:pb-10 lg:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-4 left-3 right-3 z-40 mx-auto lg:hidden max-w-md">
        <nav className="flex items-center justify-around rounded-2xl border bg-card/95 p-1.5 shadow-2xl backdrop-blur">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
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
