import React, { useState } from "react";
import {
  Wallet,
  CalendarCheck,
  Smartphone,
  Check,
  MapPin,
  Camera,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = "oklch(0.54 0.19 258)";

const FEATURES = [
  {
    id: "payroll",
    icon: Wallet,
    title: "Kalkulasi otomatis gaji & pajak",
    body: "Hitung slip gaji ribuan karyawan dalam hitungan detik, tanpa rumus Excel manual yang rawan keliru.",
  },
  {
    id: "leave",
    icon: CalendarCheck,
    title: "Approval cuti & izin berjenjang",
    body: "Validasi berjenjang dari Supervisor hingga HRD dengan kalender cuti bersama SKB 3 Menteri resmi.",
  },
  {
    id: "ess",
    icon: Smartphone,
    title: "Employee Self-Service (ESS PWA)",
    body: "Akses mudah dari smartphone tanpa download aplikasi Play Store untuk absensi selfie dan unduh slip gaji.",
  },
];

/* ---------- Panel 1: ringkasan operasional ---------- */
function PayrollPanel() {
  const top = [
    ["Karyawan aktif", "1.250"],
    ["Slip terbit", "1.250"],
    ["Akurasi pajak", "100%"],
  ];
  const rows = [
    ["Presensi hari ini", "98,6%"],
    ["Kantin terklaim", "948 kupon"],
    ["Lembur tervalidasi", "42 jam"],
  ];
  return (
    <div className="w-full max-w-[560px] rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_20px_50px_-24px_rgba(17,24,39,0.25)] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold tracking-tight text-[#111827]">Ringkasan operasional</h3>
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#ECFDF5] text-[11px] font-semibold text-[#047857]">
          <span className="size-1.5 rounded-full bg-[#10B981]" />
          Masa pajak aktif
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {top.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] p-3.5">
            <p className="text-[11.5px] text-[#6B7280]">{label}</p>
            <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#111827] tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">Slip gaji periode ini</span>
          <span className="font-semibold text-[#111827] tabular-nums">1.250 / 1.250</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[#EEF0F3] overflow-hidden">
          <div className="h-full w-full rounded-full" style={{ background: ACCENT }} />
        </div>
      </div>

      <dl className="mt-5 divide-y divide-[#EEF0F3] border-t border-[#EEF0F3]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-3 text-[13px]">
            <dt className="text-[#6B7280]">{label}</dt>
            <dd className="font-semibold text-[#111827] tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Panel 2: approval berjenjang ---------- */
function LeavePanel() {
  const steps = [
    { who: "Supervisor", note: "Disetujui", state: "done" },
    { who: "Manager divisi", note: "Disetujui", state: "done" },
    { who: "HRD", note: "Menunggu validasi", state: "current" },
  ];
  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_20px_50px_-24px_rgba(17,24,39,0.25)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="size-10 rounded-full bg-[#EEF2FF] text-[oklch(0.42_0.17_258)] grid place-items-center text-sm font-bold">
          NP
        </span>
        <div>
          <p className="text-sm font-semibold text-[#111827]">Pengajuan cuti tahunan</p>
          <p className="text-xs text-[#6B7280]">Nadia Putri · 3 hari kerja</p>
        </div>
      </div>

      <ol className="mt-6">
        {steps.map((s, i) => (
          <li key={s.who} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "absolute left-[13px] top-7 bottom-0 w-px",
                  s.state === "done" ? "bg-[oklch(0.54_0.19_258)]" : "bg-[#E5E7EB]"
                )}
              />
            )}
            <span
              className={cn(
                "relative size-7 rounded-full grid place-items-center shrink-0",
                s.state === "done"
                  ? "text-white"
                  : "bg-white border-2 border-[oklch(0.54_0.19_258)]"
              )}
              style={s.state === "done" ? { background: ACCENT } : undefined}
            >
              {s.state === "done" ? (
                <Check className="size-4" />
              ) : (
                <span className="size-2 rounded-full" style={{ background: ACCENT }} />
              )}
            </span>
            <div className="-mt-0.5">
              <p className="text-sm font-semibold text-[#111827]">{s.who}</p>
              <p
                className={cn(
                  "text-xs",
                  s.state === "done" ? "text-[#047857]" : "text-[#B45309]"
                )}
              >
                {s.note}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 rounded-lg bg-[#F6F7F9] px-3.5 py-2.5 text-xs text-[#4B5563] leading-relaxed">
        Kalender cuti bersama SKB 3 Menteri otomatis ikut diperhitungkan.
      </p>
    </div>
  );
}

/* ---------- Panel 3: ESS di ponsel ---------- */
function EssPanel() {
  return (
    <div className="w-[260px] rounded-[2.2rem] border-[6px] border-[#111827] bg-white p-4 shadow-[0_24px_60px_-24px_rgba(17,24,39,0.5)]">
      <div className="mx-auto h-1.5 w-16 rounded-full bg-[#111827]/10" />

      <p className="mt-5 text-center text-4xl font-bold tracking-tight text-[#111827] tabular-nums">
        08:02
      </p>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#047857] font-medium">
        <MapPin className="size-3.5" />
        Dalam radius kantor
      </p>

      <div className="mt-5 mx-auto size-24 rounded-full border-2 border-dashed border-[#CBD5E1] grid place-items-center text-[#94A3B8]">
        <Camera className="size-7" />
      </div>
      <p className="mt-2 text-center text-[11px] text-[#6B7280]">Selfie untuk absensi</p>

      <button
        type="button"
        tabIndex={-1}
        className="mt-5 w-full h-10 rounded-xl text-white text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-95 active:scale-[0.99]"
        style={{ background: ACCENT }}
      >
        Absen masuk
      </button>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#EEF0F3] px-3.5 py-3">
        <span className="text-xs font-medium text-[#111827]">Slip gaji terbaru</span>
        <Download className="size-4 text-[#6B7280]" />
      </div>
    </div>
  );
}

const PANELS = { payroll: PayrollPanel, leave: LeavePanel, ess: EssPanel };

export default function FeatureShowcase({ embedded = false }) {
  const [active, setActive] = useState("payroll");
  const Panel = PANELS[active];

  const content = (
    <div className="w-full">
      <style>{`
        @keyframes fs-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fs-in { animation: fs-in .35s ease-out; }
        @media (prefers-reduced-motion: reduce) { .fs-in { animation: none; } }
      `}</style>

      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-[5fr_6fr] gap-6 items-stretch">
        {/* Daftar fitur */}
        <div role="tablist" aria-label="Fitur utama" className="flex flex-col gap-2">
          {FEATURES.map(({ id, icon: Icon, title, body }) => {
            const on = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(id)}
                className={cn(
                  "w-full text-left flex gap-4 rounded-2xl p-5 border transition-all cursor-pointer",
                  on
                    ? "bg-white border-[#E5E7EB] shadow-[0_10px_30px_-16px_rgba(17,24,39,0.25)]"
                    : "border-transparent hover:bg-[#F6F7F9]"
                )}
              >
                <span
                  className={cn(
                    "size-10 rounded-xl grid place-items-center shrink-0 transition-colors",
                    on ? "text-white" : "bg-[#F1F2F4] text-[#6B7280]"
                  )}
                  style={on ? { background: ACCENT } : undefined}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-[16px] tracking-tight text-[#111827]">
                    {title}
                  </span>
                  <span
                    className={cn(
                      "block mt-1 text-[14px] leading-relaxed",
                      on ? "text-[#4B5563]" : "text-[#6B7280]"
                    )}
                  >
                    {body}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel pratinjau */}
        <div
          role="tabpanel"
          className="relative rounded-3xl border border-[#ECEEF1] bg-[#F4F5F7] p-5 sm:p-8 min-h-[460px] flex items-center justify-center overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#DDE1E8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "linear-gradient(to bottom, black, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent 90%)",
            }}
          />
          <div key={active} className="fs-in relative w-full flex justify-center">
            <Panel />
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="w-full px-4 sm:px-6 py-16">
      {content}
    </section>
  );
}
