import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
  Search,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const companyName = company?.name || "Crave Group";

  const handleFilter = (q, dept, type) => {
    router.get(
      `/careers/${company?.slug || ""}`,
      { q, department: dept, type },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Application Form
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

  const openApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    reset();
    setAppliedSuccess(false);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    post(`/careers/apply/${selectedJob.slug}`, {
      onSuccess: () => {
        setAppliedSuccess(true);
      },
    });
  };

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Plus_Jakarta_Sans,sans-serif] antialiased selection:bg-[#111827] selection:text-white flex flex-col justify-between">
      <Head title={`Karir - ${companyName}`} />

      {/* MINIMAL TOP NAVIGATION */}
      <header className="border-b border-[#F0F0F0] bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/light-mode-logo.png"
              alt="Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-extrabold text-[17px] tracking-tight text-[#111827]">
              Crave <span className="text-[#6B7280]">HRM</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-[13px] font-medium text-[#4B5563]">
            <Link href="/" className="hover:text-[#111827] transition-colors">
              Beranda
            </Link>
            <Link
              href="/login"
              className="h-9 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#111827] text-[#111827] font-semibold flex items-center transition-colors"
            >
              Masuk Portal HR
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-14 sm:py-20">
        {/* HERO: DIRECT, ELEGANT, QUIET */}
        <section className="mb-14 text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
            Karir di {companyName}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed">
            Kami membangun platform manajemen SDM dan payroll terdepan untuk Indonesia. Temukan peran yang tepat untuk mengembangkan keahlian dan potensi Anda.
          </p>

          {/* SEARCH & FILTERS */}
          <div className="mt-8 pt-8 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 size-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilter(e.target.value, selectedDept, selectedType);
                }}
                placeholder="Cari posisi atau keahlian..."
                className="w-full pl-10 pr-4 h-11 text-[13.5px] rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleFilter(searchQuery, selectedDept, e.target.value);
                }}
                className="h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#374151] cursor-pointer outline-none focus:border-[#111827]"
              >
                <option value="all">Semua Tipe Kerja</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>

              {(searchQuery || selectedDept !== "all" || selectedType !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDept("all");
                    setSelectedType("all");
                    handleFilter("", "all", "all");
                  }}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* DEPARTMENT TABS */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedDept("all");
                handleFilter(searchQuery, "all", selectedType);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors",
                selectedDept === "all"
                  ? "bg-[#111827] text-white"
                  : "bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]"
              )}
            >
              Semua Divisi ({jobs.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  setSelectedDept(String(dept.id));
                  handleFilter(searchQuery, String(dept.id), selectedType);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors",
                  selectedDept === String(dept.id)
                    ? "bg-[#111827] text-white"
                    : "bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E7EB]"
                )}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </section>

        {/* JOBS LISTING: CLEAN SCANNABLE ROWS */}
        <section className="mb-20">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">
              Posisi Tersedia ({jobs.length})
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="divide-y divide-[#F0F0F0]">
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="py-6 transition-colors hover:bg-[#FAFAFA] -mx-4 px-4 rounded-xl cursor-pointer"
                    onClick={() => toggleExpand(job.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                            {job.title}
                          </h3>
                        </div>

                        {/* Plain Metadata Without Icon/Badge Clutter */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#6B7280]">
                          <span>{job.department?.name || "Umum"}</span>
                          <span>&bull;</span>
                          <span>{job.branch?.name || company?.address || "Jakarta"}</span>
                          <span>&bull;</span>
                          <span>{job.workplace_type}</span>
                          <span>&bull;</span>
                          <span>{job.employment_type}</span>
                          {job.experience_level && (
                            <>
                              <span>&bull;</span>
                              <span>{job.experience_level}</span>
                            </>
                          )}
                        </div>

                        {job.show_salary && (job.min_salary || job.max_salary) && (
                          <div className="text-xs font-semibold text-[#111827] pt-0.5">
                            {job.min_salary && job.max_salary
                              ? `${formatRupiah(job.min_salary)} – ${formatRupiah(job.max_salary)} / bulan`
                              : formatRupiah(job.min_salary || job.max_salary)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1"
                        >
                          <span>{isExpanded ? "Tutup Detail" : "Lihat Detail"}</span>
                          {isExpanded ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => openApplyModal(job, e)}
                          className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#232738] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Lamar Posisi
                        </button>
                      </div>
                    </div>

                    {/* EXPANDABLE DETAILS */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-[#F0F0F0] text-sm text-[#374151] space-y-4 max-w-3xl">
                        {job.description && (
                          <div>
                            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                              Deskripsi Pekerjaan
                            </h4>
                            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                              {job.description}
                            </p>
                          </div>
                        )}

                        {job.requirements && (
                          <div>
                            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                              Kualifikasi &amp; Persyaratan
                            </h4>
                            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                              {job.requirements}
                            </p>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={(e) => openApplyModal(job, e)}
                            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[oklch(0.54_0.19_258)] hover:bg-[oklch(0.48_0.20_258)] text-white text-xs font-semibold transition-colors"
                          >
                            <span>Lamar Posisi Ini</span>
                            <ArrowRight className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-[#6B7280]">
              <p className="text-sm">Tidak ada posisi yang sesuai dengan kriteria pencarian.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("all");
                  setSelectedType("all");
                  handleFilter("", "all", "all");
                }}
                className="mt-3 text-xs font-semibold text-[#111827] underline cursor-pointer"
              >
                Tampilkan semua lowongan
              </button>
            </div>
          )}
        </section>

        {/* WORK CULTURE: EDITORIAL & RESTRAINED */}
        <section className="pt-12 border-t border-[#F0F0F0]">
          <h2 className="text-xl font-bold tracking-tight text-[#111827] mb-6">
            Bekerja Bersama Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-[#4B5563] leading-relaxed">
            <div>
              <h3 className="font-bold text-[#111827] mb-1.5">Kompensasi &amp; Kepatuhan</h3>
              <p className="text-xs leading-relaxed text-[#6B7280]">
                Paket gaji yang kompetitif dengan kepatuhan penuh regulasi ketenagakerjaan Indonesia, termasuk jaminan BPJS Kesehatan, BPJS Ketenagakerjaan, dan potongan PPh 21 TER yang transparan.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#111827] mb-1.5">Fasilitas Harian</h3>
              <p className="text-xs leading-relaxed text-[#6B7280]">
                Voucher makan digital harian melalui Crave Canteen Pass, dukungan perangkat kerja komputasi terkini, dan skema kerja fleksibel untuk keseimbangan waktu.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#111827] mb-1.5">Pertumbuhan Terbuka</h3>
              <p className="text-xs leading-relaxed text-[#6B7280]">
                Evaluasi performa berkala yang objektif dan transparan dari berbagai sudut pandang (360 review) dengan jalur perkembangan karir yang terukur.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-[#F0F0F0] py-8 text-xs text-[#6B7280]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111827]">Crave HRM</span>
            <span>&bull;</span>
            <span>Portal Karir Resmi {companyName}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#111827] transition-colors">
              Beranda
            </Link>
            <Link href="/login" className="hover:text-[#111827] transition-colors">
              Masuk
            </Link>
            <span>&copy; {new Date().getFullYear()} {companyName}.</span>
          </div>
        </div>
      </footer>

      {/* APPLICATION DIALOG MODAL */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 sm:p-7 bg-white border border-[#E5E7EB] shadow-xl">
          {appliedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <DialogTitle className="text-lg font-bold text-[#111827]">
                Lamaran Terkirim
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                Terima kasih telah melamar posisi <strong>{selectedJob?.title}</strong> di {companyName}. Berkas Anda telah tersimpan dan tim kami akan menghubungi Anda jika profil Anda sesuai.
              </DialogDescription>
              <div className="pt-3">
                <Button
                  onClick={() => setApplyModalOpen(false)}
                  className="rounded-xl text-xs font-semibold h-10 px-5 bg-[#111827] hover:bg-[#232738] text-white"
                >
                  Selesai
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className="text-left space-y-1 pb-3 border-b border-[#F0F0F0]">
                <DialogTitle className="text-base font-bold text-[#111827]">
                  Lamar: {selectedJob?.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6B7280]">
                  {selectedJob?.department?.name || "Umum"} &bull; {selectedJob?.workplace_type}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleApplySubmit} className="space-y-3.5 mt-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Nama Lengkap *</Label>
                    <Input
                      value={data.full_name}
                      onChange={(e) => setData("full_name", e.target.value)}
                      placeholder="Budi Santoso"
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                      required
                    />
                    {errors.full_name && (
                      <p className="text-[11px] text-red-500">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Email Aktif *</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="budi@example.com"
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                      required
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Nomor WhatsApp / HP *</Label>
                    <Input
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder="08123456789"
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                      required
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Posisi Saat Ini</Label>
                    <Input
                      value={data.current_title}
                      onChange={(e) => setData("current_title", e.target.value)}
                      placeholder="Software Engineer"
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Tautan LinkedIn</Label>
                    <Input
                      type="url"
                      value={data.linkedin_url}
                      onChange={(e) => setData("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-[#374151]">Portofolio / GitHub</Label>
                    <Input
                      type="url"
                      value={data.portfolio_url}
                      onChange={(e) => setData("portfolio_url", e.target.value)}
                      placeholder="https://github.com/..."
                      className="rounded-xl h-10 text-xs border-[#E5E7EB]"
                    />
                  </div>
                </div>

                {/* CV File Upload */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#374151]">
                    Resume / CV (PDF maks. 4MB)
                  </Label>
                  <div className="border border-dashed border-[#D1D5DB] rounded-xl p-3.5 text-center bg-[#FAFAFA] hover:bg-[#F3F4F6] transition-colors">
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setData("resume", e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="resume-file" className="cursor-pointer block text-xs">
                      <span className="font-semibold text-[#111827]">
                        {data.resume ? data.resume.name : "Pilih file CV (PDF/DOCX)"}
                      </span>
                    </label>
                  </div>
                  {errors.resume && (
                    <p className="text-[11px] text-red-500">{errors.resume}</p>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#374151]">
                    Catatan Singkat / Cover Letter
                  </Label>
                  <textarea
                    rows={3}
                    value={data.cover_letter}
                    onChange={(e) => setData("cover_letter", e.target.value)}
                    placeholder="Sampaikan motivasi singkat Anda..."
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-xs outline-none focus:border-[#111827] resize-none leading-relaxed"
                  />
                </div>

                <DialogFooter className="mt-5 pt-3 border-t border-[#F0F0F0] flex flex-row items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplyModalOpen(false)}
                    className="rounded-xl text-xs h-10 px-4 border-[#E5E7EB]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl text-xs font-semibold h-10 px-5 bg-[#111827] hover:bg-[#232738] text-white cursor-pointer"
                  >
                    {processing ? "Mengirim..." : "Kirim Lamaran"}
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
