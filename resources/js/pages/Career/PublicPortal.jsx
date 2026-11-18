import React, { useState, useEffect, useRef, useId } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
  Search,
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Briefcase,
  Building2,
  Wallet,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import CareerNavbar from "@/components/CareerNavbar";

const ACCENT = "oklch(0.54 0.19 258)";

const inputCls =
  "rounded-lg h-10 text-[13px] border-[#E5E7EB] bg-white focus-visible:ring-2 focus-visible:ring-[oklch(0.54_0.19_258/0.25)] focus-visible:border-[oklch(0.54_0.19_258)]";

/* Pola geometris setengah lingkaran untuk banner */
function HeroPattern({ className = "" }) {
  const S = 56;
  const R = S / 2;
  const cells = [
    ["R", "#1E3A8A"], ["L", "#38BDF8"], ["R", "#FFFFFF"],
    ["T", "#0B1220"], ["B", "#FFFFFF"], ["L", "#38BDF8"],
    ["B", "#0B1220"], ["R", "#1E3A8A"], ["L", "#FFFFFF"],
  ];
  const path = (dir, cx, cy) => {
    switch (dir) {
      case "R": return `M${cx} ${cy - R}A${R} ${R} 0 0 1 ${cx} ${cy + R}Z`;
      case "L": return `M${cx} ${cy - R}A${R} ${R} 0 0 0 ${cx} ${cy + R}Z`;
      case "T": return `M${cx - R} ${cy}A${R} ${R} 0 0 1 ${cx + R} ${cy}Z`;
      default: return `M${cx - R} ${cy}A${R} ${R} 0 0 0 ${cx + R} ${cy}Z`;
    }
  };
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${S * 3} ${S * 3}`}
      preserveAspectRatio="xMaxYMid slice"
      className={className}
    >
      {cells.map(([dir, fill], i) => (
        <path
          key={i}
          d={path(dir, (i % 3) * S + R, Math.floor(i / 3) * S + R)}
          fill={fill}
        />
      ))}
    </svg>
  );
}

/* Handwritten Eyebrow Badge with Doodle Arrow matching Landing Page */
function HandwriteTag({ text, tone = "accent", className = "" }) {
  const isLightBlue = tone === "light-blue";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 mb-3 font-handwriting select-none",
        isLightBlue ? "text-sky-300" : "text-[oklch(0.54_0.19_258)]",
        className
      )}
    >
      <span className="text-[22px] sm:text-[25px] font-bold tracking-wide">
        {text}
      </span>
      <svg
        width="32"
        height="22"
        viewBox="0 0 34 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0"
        aria-hidden="true"
      >
        <path
          d="M2 4C11 3 24 6 28 17M28 17L22 14M28 17L31 10"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* Ikon koper 3D (SVG), warna bervariasi per divisi */
const BAG_PALETTES = [
  { tile: "#EAF2FF", top: "#7DB2FF", mid: "#3B7BF0", low: "#1D4ED8", edge: "#1E3A8A" },
  { tile: "#EEF0FF", top: "#A5ABFF", mid: "#6366F1", low: "#4338CA", edge: "#312E81" },
  { tile: "#E6F7F5", top: "#6EE0D0", mid: "#14B8A6", low: "#0F766E", edge: "#134E4A" },
  { tile: "#F1F5F9", top: "#94A3B8", mid: "#475569", low: "#1E293B", edge: "#0F172A" },
];

function BriefcaseIcon({ name = "", size = "size-11" }) {
  const uid = useId().replace(/:/g, "");
  const hash = [...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const c = BAG_PALETTES[hash % BAG_PALETTES.length];
  const lid = `lid-${uid}`;
  const base = `base-${uid}`;
  const gold = `gold-${uid}`;

  return (
    <span
      className={cn(size, "rounded-xl grid place-items-center shrink-0")}
      style={{ background: c.tile }}
    >
      <svg viewBox="0 0 48 48" className="w-[74%] h-[74%]" aria-hidden>
        <defs>
          <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.top} />
            <stop offset="1" stopColor={c.mid} />
          </linearGradient>
          <linearGradient id={base} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.mid} />
            <stop offset="1" stopColor={c.low} />
          </linearGradient>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FEF3C7" />
            <stop offset="0.5" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* bayangan lantai */}
        <ellipse cx="24" cy="42.5" rx="14" ry="2" fill="#0F172A" opacity="0.14" />

        {/* pegangan */}
        <path
          d="M17 15v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"
          fill="none"
          stroke={c.edge}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* badan koper (bagian bawah) */}
        <rect x="5" y="14" width="38" height="27" rx="5.5" fill={`url(#${base})`} />

        {/* tutup koper (bagian atas) */}
        <path
          d="M5 25.5V19.5A5.5 5.5 0 0 1 10.5 14h27A5.5 5.5 0 0 1 43 19.5v6a28 7 0 0 1-38 0z"
          fill={`url(#${lid})`}
        />

        {/* garis lipatan */}
        <path
          d="M5.4 25.2c9 4.6 28.2 4.6 37.2 0"
          fill="none"
          stroke={c.edge}
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />

        {/* kilau tepi atas */}
        <rect x="9" y="16" width="16" height="2" rx="1" fill="#fff" opacity="0.45" />

        {/* kunci emas */}
        <rect x="19.5" y="24" width="9" height="8" rx="2.2" fill={`url(#${gold})`} />
        <rect x="19.5" y="24" width="9" height="8" rx="2.2" fill="none" stroke="#B45309" strokeOpacity="0.35" />
        <circle cx="24" cy="27.2" r="1.2" fill="#92400E" />
        <rect x="23.4" y="27.8" width="1.2" height="2.4" rx="0.6" fill="#92400E" />
      </svg>
    </span>
  );
}

const NAVY = "#0A2447";
const NAVY_2 = "#12306B";

const PERKS = [
  {
    title: "Kompensasi & kepatuhan",
    body: "Gaji kompetitif dengan kepatuhan penuh pada regulasi ketenagakerjaan: BPJS Kesehatan, BPJS Ketenagakerjaan, dan potongan PPh 21 TER yang transparan.",
  },
  {
    title: "Fasilitas harian",
    body: "Voucher makan digital lewat Crave Canteen Pass, perangkat kerja terkini, dan skema kerja fleksibel agar waktumu tetap seimbang.",
  },
  {
    title: "Pertumbuhan terbuka",
    body: "Evaluasi performa berkala yang objektif lewat 360 review, dengan jalur karir yang jelas dan terukur.",
  },
];

const TAG_TONES = {
  type: "bg-[#FFF3E3] text-[#B85C00]",
  place: "bg-[#E3F6F7] text-[#0B7F8A]",
  level: "bg-[#E8F5EC] text-[#2A7A4B]",
  dept: "bg-[#F3F4F6] text-[#374151]",
};

function Tag({ tone, children }) {
  if (!children) return null;
  return (
    <span className={cn("px-3 py-1 rounded-md text-xs font-medium", TAG_TONES[tone])}>
      {children}
    </span>
  );
}

function timeAgo(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return "Baru saja";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
}

function FilterSelect({ value, onChange, label, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        aria-label={label}
        className="appearance-none h-10 pl-4 pr-9 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#374151] cursor-pointer outline-none transition hover:border-[#9CA3AF] focus:border-[oklch(0.54_0.19_258)] focus:ring-4 focus:ring-[oklch(0.54_0.19_258/0.12)]"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
    </div>
  );
}

export default function PublicPortal({
  company,
  jobs = [],
  departments = [],
  branches = [],
  filters = {},
}) {
  const [searchQuery, setSearchQuery] = useState(filters.q || "");
  const [selectedDept, setSelectedDept] = useState(filters.department || "all");
  const [selectedType, setSelectedType] = useState(filters.type || "all");
  const [activeId, setActiveId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false); // dialog detail (mobile)
  const [applyJob, setApplyJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const companyName = company?.name || "Crave Group";
  const activeJob = jobs.find((j) => j.id === activeId) || jobs[0] || null;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const applyFilters = (q, dept, type) => {
    router.get(
      `/careers/${company?.slug || ""}`,
      { q, department: dept, type },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  // Debounce pencarian
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(
      () => applyFilters(searchQuery, selectedDept, selectedType),
      350
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("all");
    setSelectedType("all");
    applyFilters("", "all", "all");
  };

  const hasFilter =
    searchQuery || selectedDept !== "all" || selectedType !== "all";

  // Form lamaran
  const { data, setData, post, processing, errors, reset } = useForm({
    full_name: "",
    email: "",
    phone: "",
    current_company: "",
    current_title: "",
    linkedin_url: "",
    portfolio_url: "",
    cover_letter: "",
    resume: null,
  });
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const openApplyModal = (job) => {
    setDetailOpen(false);
    setApplyJob(job);
    reset();
    setAppliedSuccess(false);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyJob) return;
    post(`/careers/apply/${applyJob.slug}`, {
      onSuccess: () => setAppliedSuccess(true),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setData("resume", file);
  };

  const selectJob = (job) => {
    setActiveId(job.id);
    if (!isDesktop) setDetailOpen(true);
  };

  const salaryText = (job) => {
    if (!job.show_salary || !(job.min_salary || job.max_salary)) return null;
    return job.min_salary && job.max_salary
      ? `${formatRupiah(job.min_salary)} – ${formatRupiah(job.max_salary)} / bulan`
      : formatRupiah(job.min_salary || job.max_salary);
  };

  const locationOf = (job) =>
    job.branch?.name || company?.address || "Jakarta";

  /* Panel detail: kolom kanan (desktop) dan dialog (mobile) */
  const JobDetail = ({ job }) => {
    const salary = salaryText(job);
    const posted = timeAgo(job.published_at || job.created_at);
    const rows = [
      {
        icon: Briefcase,
        text: [job.employment_type, job.experience_level]
          .filter(Boolean)
          .join(" · "),
      },
      {
        icon: Building2,
        text: [job.department?.name || "Umum", job.workplace_type]
          .filter(Boolean)
          .join(" · "),
      },
      { icon: Wallet, text: salary },
    ].filter((r) => r.text);

    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{job.title}</h2>
        <p className="mt-2 text-sm text-[#374151]">
          {companyName} · {locationOf(job)}
          {posted && <span className="text-[#6B7280]"> · {posted}</span>}
        </p>

        <ul className="mt-6 space-y-3">
          {rows.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[13.5px] text-[#374151]">
              <Icon className="size-[18px] text-[#111827] shrink-0" />
              {text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => openApplyModal(job)}
          className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-lg text-white text-sm font-semibold transition hover:brightness-95 cursor-pointer"
          style={{ background: ACCENT }}
        >
          Lamar sekarang
          <ArrowUpRight className="size-4" />
        </button>

        {job.description && (
          <section className="mt-9">
            <h3 className="text-lg font-bold">Tentang pekerjaan</h3>
            <p className="mt-3 text-[13.5px] text-[#4B5563] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>
        )}

        {job.requirements && (
          <section className="mt-7">
            <h3 className="text-[15px] font-bold">Kualifikasi &amp; persyaratan</h3>
            <p className="mt-3 text-[13.5px] text-[#4B5563] leading-relaxed whitespace-pre-line">
              {job.requirements}
            </p>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Plus_Jakarta_Sans,sans-serif] antialiased selection:bg-[oklch(0.54_0.19_258)] selection:text-white flex flex-col">
      <Head title={`Karir - ${companyName}`} />

      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: NAVY }}
      >
        <HeroPattern className="absolute right-0 inset-y-0 h-full w-[300px] hidden md:block opacity-25" />

        <CareerNavbar companyName={companyName} />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-28 sm:pt-36 sm:pb-32">
          <HandwriteTag text="Kembangkan karir terbaikmu" tone="light-blue" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1] max-w-2xl">
            Temukan peran yang cocok untukmu
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/75 max-w-lg leading-relaxed">
            Lihat lowongan terbuka di {companyName} dan lamar langsung dalam
            beberapa menit.
          </p>
        </div>
      </section>

      {/* KARTU PENCARIAN (menimpa tepi hero) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 -mt-14">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters(searchQuery, selectedDept, selectedType);
          }}
          className="rounded-2xl bg-white border border-[#E9EBEF] shadow-[0_16px_40px_-16px_rgba(10,36,71,0.3)] p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <Search className="size-[18px] text-[#6B7280] shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari posisi atau keahlian"
              aria-label="Cari posisi"
              className="flex-1 min-w-0 h-11 text-[14px] bg-transparent placeholder:text-[#9CA3AF] outline-none"
            />
            {hasFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[13px] font-semibold text-[#374151] hover:text-[#111827] px-2 cursor-pointer"
              >
                Hapus
              </button>
            )}
            <button
              type="submit"
              className="h-11 px-6 rounded-lg text-white text-sm font-semibold transition hover:brightness-95 cursor-pointer"
              style={{ background: ACCENT }}
            >
              Cari
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#EEF0F3] flex flex-wrap gap-3">
            <FilterSelect
              label="Divisi"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                applyFilters(searchQuery, e.target.value, selectedType);
              }}
            >
              <option value="all">Semua divisi</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Tipe kerja"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                applyFilters(searchQuery, selectedDept, e.target.value);
              }}
            >
              <option value="all">Semua tipe kerja</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </FilterSelect>
          </div>
        </form>
      </div>

      {/* DAFTAR + DETAIL */}
      <main id="posisi" className="flex-1 max-w-6xl w-full mx-auto px-6 pt-12 pb-16 scroll-mt-20 sm:scroll-mt-24">
        <div className="flex items-baseline gap-2 mb-5" aria-live="polite">
          <h2 className="text-sm font-semibold">Lowongan tersedia</h2>
          <span className="text-sm text-[#9CA3AF]">{jobs.length}</span>
        </div>

        {jobs.length > 0 ? (
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 items-start">
            <ul className="space-y-4">
              {jobs.map((job) => {
                const selected = activeJob?.id === job.id;
                const posted = timeAgo(job.published_at || job.created_at);
                return (
                  <li key={job.id}>
                    <button
                      type="button"
                      onClick={() => selectJob(job)}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "w-full text-left rounded-xl bg-white p-5 border transition cursor-pointer",
                        selected && isDesktop
                          ? "border-[oklch(0.54_0.19_258)] ring-1 ring-[oklch(0.54_0.19_258)]"
                          : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <BriefcaseIcon name={job.department?.name || companyName} size="size-12" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold tracking-tight text-[16px]">
                              {job.title}
                            </h3>
                            {posted && (
                              <span className="text-[11px] text-[#6B7280] whitespace-nowrap pt-1">
                                {posted}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#6B7280] mt-0.5">{companyName}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#374151]">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="size-3.5 text-[#6B7280]" />
                              {job.department?.name || "Umum"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-[#6B7280]" />
                              {locationOf(job)}
                            </span>
                          </div>

                          <div className="mt-3.5 flex flex-wrap gap-2">
                            <Tag tone="type">{job.employment_type}</Tag>
                            <Tag tone="place">{job.workplace_type}</Tag>
                            <Tag tone="level">{job.experience_level}</Tag>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {isDesktop && activeJob && (
              <aside
                key={activeJob.id}
                className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl bg-white p-7 border border-[#E5E7EB]"
              >
                <JobDetail job={activeJob} />
              </aside>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] py-16 px-6 text-center">
            <div className="size-11 mx-auto rounded-full bg-[#F3F4F6] grid place-items-center text-[#6B7280]">
              <Search className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold">Belum ada posisi yang cocok</p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Coba ubah kata kunci atau hapus filter yang sedang aktif.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 h-9 px-4 rounded-lg border border-[#E5E7EB] text-xs font-semibold hover:border-[#111827] transition-colors cursor-pointer"
            >
              Tampilkan semua lowongan
            </button>
          </div>
        )}
      </main>

      {/* BUDAYA */}
      <section id="budaya" className="border-t border-[#EEF0F3] bg-[#F8F9FB] scroll-mt-20 sm:scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <HandwriteTag text="Budaya & benefit nyata" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            Bekerja bersama kami
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {PERKS.map(({ title, body }, idx) => (
              <div key={title} className="border-t-2 border-slate-200/90 pt-6">
                <span className="text-xs font-mono font-bold tracking-wider text-[oklch(0.54_0.19_258)] uppercase">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-bold text-base text-[#111827]">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (separuh putih, separuh navy seperti referensi) */}
      <div
        className="px-6"
        style={{
          background: `linear-gradient(to bottom, #F8F9FB 50%, ${NAVY} 50%)`,
        }}
      >
        <div
          className="relative overflow-hidden max-w-6xl mx-auto rounded-2xl px-8 sm:px-14 py-14 sm:py-16 text-white"
          style={{ background: NAVY_2 }}
        >
          <HeroPattern className="absolute right-0 inset-y-0 h-full w-[260px] hidden md:block opacity-40" />
          <div className="relative max-w-md">
            <HandwriteTag text="Mulai perjalanan barumu" tone="light-blue" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] leading-tight">
              Temukan peluang terbaikmu hari ini
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed">
              Pilih posisi yang sesuai dengan keahlianmu dan kirim lamaran
              dalam beberapa menit.
            </p>
            <a
              href="#posisi"
              onClick={hasFilter ? resetFilters : undefined}
              className="mt-7 inline-flex items-center h-11 px-6 rounded-lg text-white text-sm font-semibold transition hover:brightness-95"
              style={{ background: ACCENT }}
            >
              Lihat semua posisi
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-white" style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <img
                  src="/dark-mode-logo.png"
                  alt={`Logo ${companyName}`}
                  className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Crave <span className="font-bold text-white/60">HRM</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-sm">
                Portal karir resmi {companyName}. Lihat lowongan terbuka dan
                kirim lamaranmu langsung dari sini.
              </p>
            </div>

            <div>
              <h4 className="font-bold">Pencari kerja</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><a href="#posisi" className="hover:text-white transition-colors">Cari lowongan</a></li>
                <li><a href="#budaya" className="hover:text-white transition-colors">Budaya kerja</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold">Crave HRM</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk Portal HR</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/50">
            &copy; {new Date().getFullYear()} {companyName}. Semua hak dilindungi.
          </div>
        </div>
      </footer>

      {/* DIALOG DETAIL (mobile) */}
      <Dialog open={detailOpen && !isDesktop} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-xl">
          <DialogTitle className="sr-only">{activeJob?.title}</DialogTitle>
          <DialogDescription className="sr-only">Detail lowongan</DialogDescription>
          {activeJob && <JobDetail job={activeJob} />}
        </DialogContent>
      </Dialog>

      {/* DIALOG LAMARAN */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-7 bg-white border border-[#E5E7EB] shadow-xl">
          {appliedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <DialogTitle className="text-lg font-bold">Lamaran terkirim</DialogTitle>
              <DialogDescription className="text-[13px] text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                Terima kasih telah melamar sebagai{" "}
                <strong className="text-[#111827]">{applyJob?.title}</strong> di{" "}
                {companyName}. Berkasmu sudah tersimpan, dan tim kami akan
                menghubungimu jika profilmu sesuai.
              </DialogDescription>
              <div className="pt-3">
                <Button
                  onClick={() => setApplyModalOpen(false)}
                  className="rounded-lg text-xs font-semibold h-10 px-6 bg-[#111827] hover:bg-[#232738] text-white"
                >
                  Selesai
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className="text-left space-y-1 pb-4 border-b border-[#EEF0F3]">
                <DialogTitle className="text-lg font-bold tracking-tight">
                  Lamar sebagai {applyJob?.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6B7280]">
                  {applyJob?.department?.name || "Umum"} &bull; {applyJob?.workplace_type}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleApplySubmit} className="space-y-4 mt-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Nama lengkap *</Label>
                    <Input
                      value={data.full_name}
                      onChange={(e) => setData("full_name", e.target.value)}
                      placeholder="Budi Santoso"
                      className={inputCls}
                      required
                    />
                    {errors.full_name && <p className="text-[11px] text-red-500">{errors.full_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Email aktif *</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="budi@example.com"
                      className={inputCls}
                      required
                    />
                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Nomor WhatsApp / HP *</Label>
                    <Input
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder="08123456789"
                      className={inputCls}
                      required
                    />
                    {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Posisi saat ini</Label>
                    <Input
                      value={data.current_title}
                      onChange={(e) => setData("current_title", e.target.value)}
                      placeholder="Software Engineer"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Tautan LinkedIn</Label>
                    <Input
                      type="url"
                      value={data.linkedin_url}
                      onChange={(e) => setData("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#374151]">Portofolio / GitHub</Label>
                    <Input
                      type="url"
                      value={data.portfolio_url}
                      onChange={(e) => setData("portfolio_url", e.target.value)}
                      placeholder="https://github.com/..."
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#374151]">
                    Resume / CV (PDF atau DOCX, maks. 4 MB)
                  </Label>
                  <input
                    type="file"
                    id="resume-file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setData("resume", e.target.files[0])}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="resume-file"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-dashed p-3.5 cursor-pointer transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[oklch(0.54_0.19_258/0.3)]",
                      dragging
                        ? "border-[oklch(0.54_0.19_258)] bg-[oklch(0.97_0.02_258)]"
                        : "border-[#D1D5DB] bg-[#FAFAFA] hover:bg-[#F3F4F6]"
                    )}
                  >
                    <span className="size-9 rounded-lg bg-white border border-[#E5E7EB] grid place-items-center text-[#6B7280] shrink-0">
                      {data.resume ? <FileText className="size-4" /> : <UploadCloud className="size-4" />}
                    </span>
                    <span className="min-w-0 text-xs">
                      <span className="block font-semibold text-[#111827] truncate">
                        {data.resume ? data.resume.name : "Pilih atau seret file CV ke sini"}
                      </span>
                      <span className="block text-[#6B7280]">
                        {data.resume
                          ? `${(data.resume.size / 1024 / 1024).toFixed(2)} MB`
                          : "PDF atau DOCX"}
                      </span>
                    </span>
                  </label>
                  {errors.resume && <p className="text-[11px] text-red-500">{errors.resume}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#374151]">
                    Catatan singkat / cover letter
                  </Label>
                  <textarea
                    rows={3}
                    value={data.cover_letter}
                    onChange={(e) => setData("cover_letter", e.target.value)}
                    placeholder="Ceritakan singkat motivasimu"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white p-3 text-[13px] outline-none resize-none leading-relaxed focus:border-[oklch(0.54_0.19_258)] focus:ring-2 focus:ring-[oklch(0.54_0.19_258/0.25)]"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-[#EEF0F3] flex flex-row items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplyModalOpen(false)}
                    className="rounded-lg text-xs h-10 px-5 border-[#E5E7EB]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg text-xs font-semibold h-10 px-6 text-white cursor-pointer hover:brightness-95"
                    style={{ background: ACCENT }}
                  >
                    {processing ? "Mengirim..." : "Kirim lamaran"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}