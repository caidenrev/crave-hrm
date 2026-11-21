import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const STATE_LABEL = {
  trial: "Trial",
  active: "Aktif",
  grace: "Tenggang",
  expired: "Tidak aktif",
  suspended: "Ditangguhkan",
};

/** Warna status konsisten dengan Crave POS */
export const STATE_COLOR = {
  active: "var(--color-success, #10b981)",
  trial: "var(--color-chart-2, #3b82f6)",
  grace: "var(--color-warning, #f59e0b)",
  expired: "var(--color-destructive, #ef4444)",
  suspended: "var(--color-muted-foreground, #6b7280)",
};

export const INVOICE_LABEL = {
  pending: "Menunggu",
  paid: "Lunas",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
};

export const METHOD_LABEL = {
  manual: "Manual (founder)",
  qris: "QRIS",
  bank_transfer: "Transfer bank",
  echannel: "Mandiri Bill",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  credit_card: "Kartu kredit",
  cstore: "Minimarket",
  lainnya: "Lainnya",
};

export const tanggal = (iso, pattern = "d MMM yyyy") => {
  if (!iso) return "-";
  try {
    return format(new Date(iso), pattern, { locale: id });
  } catch (e) {
    return "-";
  }
};

export function rupiah(value) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Rp ringkas untuk sumbu grafik & kartu ringkasan: 1,2 jt · 850 rb */
export function rupiahShort(value) {
  if (!value) return "Rp 0";
  const abs = Math.abs(value);
  const fmt = (n) => n.toLocaleString("id-ID", { maximumFractionDigits: n >= 100 ? 0 : 1 });
  if (abs >= 1_000_000_000) return `Rp ${fmt(value / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `Rp ${fmt(value / 1_000_000)} jt`;
  if (abs >= 1_000) return `Rp ${fmt(value / 1_000)} rb`;
  return `Rp ${String(Math.round(value))}`;
}

export const angka = (n) => (n ?? 0).toLocaleString("id-ID");

export const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border, #e2e8f0)",
  background: "var(--color-popover, #ffffff)",
  color: "var(--color-popover-foreground, #0f172a)",
  fontSize: 12,
};

export function Tile({ className, children, tone = "card" }) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-3xl border p-5 transition-shadow",
        tone === "primary"
          ? "border-transparent bg-primary text-primary-foreground shadow-soft"
          : "bg-card shadow-soft",
        className
      )}
    >
      {children}
    </section>
  );
}

export function TileTitle({ title, hint, right, inverted }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-extrabold tracking-tight">{title}</h2>
        {hint && (
          <p className={cn("text-[11px]", inverted ? "text-primary-foreground/75" : "text-muted-foreground")}>
            {hint}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

/** Perubahan terhadap periode sebelumnya */
export function Delta({ current, previous, inverted }) {
  if (previous === 0 && current === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs", inverted ? "text-primary-foreground/75" : "text-muted-foreground")}>
        <Minus className="size-3" /> belum ada data
      </span>
    );
  }
  if (previous === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", inverted ? "text-primary-foreground" : "text-emerald-500")}>
        <ArrowUpRight className="size-3.5" /> baru
      </span>
    );
  }
  const pct = ((current - previous) / previous) * 100;
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
        inverted ? "text-primary-foreground" : up ? "text-emerald-500" : "text-red-500"
      )}
    >
      <Icon className="size-3.5" />
      {Math.abs(pct).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%
    </span>
  );
}

export function StateBadge({ state }) {
  const s = state || "trial";
  const color =
    s === "active"
      ? "#10b981"
      : s === "trial"
      ? "#3b82f6"
      : s === "grace"
      ? "#f59e0b"
      : s === "suspended"
      ? "#6b7280"
      : "#ef4444";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {STATE_LABEL[s] ?? s}
    </span>
  );
}

export function InvoiceBadge({ status }) {
  const color =
    status === "paid"
      ? "#10b981"
      : status === "pending"
      ? "#f59e0b"
      : "#6b7280";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {INVOICE_LABEL[status] ?? status}
    </span>
  );
}

export function Empty({ children }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

export function Segmented({ value, options, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border bg-muted p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
            o.value === value
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
