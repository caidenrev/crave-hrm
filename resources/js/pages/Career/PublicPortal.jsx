import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Search,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileText,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleFilter = (q, dept, type) => {
    router.get(
      `/careers/${company?.slug || ""}`,
      { q, department: dept, type },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Application Form
  const { data, setData, post, processing, errors, reset, progress } = useForm({
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Head title={`Karir & Lowongan Kerja - ${company?.name || 'Crave Group'}`} />

      {/* Public Header / Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/light-mode-logo.png"
              alt="Logo"
              className="h-8 w-auto dark:hidden"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <img
              src="/dark-mode-logo.png"
              alt="Logo"
              className="h-8 w-auto hidden dark:block"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="leading-tight">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground">
                {company?.name || "CRAVE GROUP"}
              </span>
              <span className="text-[10px] text-muted-foreground block font-medium">
                Portal Karir Resmi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="size-9 rounded-xl border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Ganti Tema Light/Dark"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.visit('/')}
              className="rounded-xl text-xs font-semibold h-9"
            >
              Portal Karyawan (HR)
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-bold text-primary border-primary/30 bg-primary/5">
            Peluang Karir Crave Group
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            Bangun Masa Depan Ekosistem SaaS &amp; Bisnis Modern
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bergabunglah bersama talenta terbaik dalam mengembangkan produk inovatif berkelas dunia. Temukan posisi yang selaras dengan aspirasi dan keahlian Anda.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-card border border-border/70 p-2 shadow-soft">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleFilter(e.target.value, selectedDept, selectedType);
                  }}
                  placeholder="Cari nama posisi, keahlian, atau deskripsi..."
                  className="pl-9 rounded-xl border-0 bg-transparent text-xs h-10 shadow-none focus-visible:ring-0"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleFilter(searchQuery, selectedDept, e.target.value);
                }}
                className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold cursor-pointer outline-none focus:border-ring"
              >
                <option value="all">Semua Tipe Kerja</option>
                <option value="On-site">On-site (Kantor)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("all");
                  handleFilter(searchQuery, "all", selectedType);
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-all",
                  selectedDept === "all"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "bg-muted text-muted-foreground hover:text-foreground"
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
                    "rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-all",
                    selectedDept === String(dept.id)
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Job Vacancies Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              Lowongan Pekerjaan Tersedia
            </h2>
            <p className="text-xs text-muted-foreground">
              Menampilkan {jobs.length} posisi aktif yang sedang membuka pendaftaran
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card-soft p-5 bg-card border border-border/70 hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
                      {job.department?.name || "Umum"}
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
                      {job.workplace_type}
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
                      {job.employment_type}
                    </Badge>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {job.branch?.name || "Kantor Pusat Jakarta"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3.5 text-muted-foreground" />
                      {job.experience_level}
                    </span>
                  </div>

                  {job.show_salary && (job.min_salary || job.max_salary) && (
                    <div className="mt-3 text-xs font-mono font-bold text-primary">
                      {job.min_salary && job.max_salary
                        ? `${formatRupiah(job.min_salary)} – ${formatRupiah(job.max_salary)} / bln`
                        : formatRupiah(job.min_salary || job.max_salary)}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-3 mt-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    {job.vacancies_count} posisi tersedia
                  </span>

                  <Button
                    size="sm"
                    onClick={() => openApplyModal(job)}
                    className="rounded-xl text-xs font-bold h-8 bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs"
                  >
                    Lamar Posisi Ini <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-soft p-12 text-center bg-card border border-border/60 max-w-md mx-auto space-y-3">
            <div className="size-12 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
              <Briefcase className="size-6" />
            </div>
            <h3 className="text-sm font-extrabold text-foreground">
              Tidak Ada Posisi yang Sesuai
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau ubah filter divisi kerja di bagian atas.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("all");
                setSelectedType("all");
                handleFilter("", "all", "all");
              }}
              className="rounded-xl text-xs"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30 py-8 px-4 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">
          &copy; {new Date().getFullYear()} {company?.name || "PT Crave Global Group"}. All rights reserved.
        </p>
        <p className="mt-1 text-[11px]">
          Powered by Crave HRM Enterprise Suite &bull; Perekrutan Resmi Berintegritas
        </p>
      </footer>

      {/* Modal Formulir Lamaran Pekerjaan */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl p-6">
          {appliedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <DialogTitle className="text-lg font-extrabold text-foreground">
                Lamaran Anda Berhasil Terkirim!
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Terima kasih telah melamar untuk posisi <strong>{selectedJob?.title}</strong> di {company?.name}. Tim Talent Acquisition kami akan segera meninjau profil dan berkas Anda.
              </DialogDescription>
              <Button
                onClick={() => setApplyModalOpen(false)}
                className="rounded-xl text-xs font-bold h-9 bg-primary text-primary-foreground mt-2"
              >
                Kembali ke Daftar Lowongan
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-extrabold text-foreground">
                  Lamar Pekerjaan: {selectedJob?.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Isi formulir di bawah ini dengan informasi akurat dan lampirkan berkas CV terbaru Anda.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleApplySubmit} className="space-y-3.5 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Nama Lengkap *</Label>
                    <Input
                      value={data.full_name}
                      onChange={(e) => setData("full_name", e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="rounded-xl h-9 text-xs"
                      required
                    />
                    {errors.full_name && <p className="text-[11px] text-destructive">{errors.full_name}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Email Aktif *</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="budi@email.com"
                      className="rounded-xl h-9 text-xs"
                      required
                    />
                    {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Nomor WhatsApp / HP *</Label>
                    <Input
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder="081234567890"
                      className="rounded-xl h-9 text-xs"
                      required
                    />
                    {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Pekerjaan / Jabatan Saat Ini</Label>
                    <Input
                      value={data.current_title}
                      onChange={(e) => setData("current_title", e.target.value)}
                      placeholder="Contoh: Frontend Developer"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Tautan LinkedIn</Label>
                    <Input
                      type="url"
                      value={data.linkedin_url}
                      onChange={(e) => setData("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">Portofolio / GitHub URL</Label>
                    <Input
                      type="url"
                      value={data.portfolio_url}
                      onChange={(e) => setData("portfolio_url", e.target.value)}
                      placeholder="https://github.com/username"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Upload Resume / CV */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Unggah Resume / CV (PDF max 4MB)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-muted/20">
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setData("resume", e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="resume-file" className="cursor-pointer space-y-1 block">
                      <UploadCloud className="size-7 mx-auto text-muted-foreground" />
                      <p className="text-xs font-bold text-foreground">
                        {data.resume ? data.resume.name : "Klik untuk pilih file CV Anda"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Mendukung format PDF, DOCX (Maksimal 4 MB)
                      </p>
                    </label>
                  </div>
                  {errors.resume && <p className="text-[11px] text-destructive">{errors.resume}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Surat Lamaran Singkat (Cover Letter)</Label>
                  <textarea
                    rows={3}
                    value={data.cover_letter}
                    onChange={(e) => setData("cover_letter", e.target.value)}
                    placeholder="Ceritakan secara ringkas mengapa Anda antusias melamar posisi ini..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-ring resize-none leading-relaxed"
                  />
                </div>

                <DialogFooter className="mt-4 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplyModalOpen(false)}
                    className="rounded-xl text-xs h-9"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl text-xs font-bold h-9 bg-primary text-primary-foreground shadow-xs cursor-pointer"
                  >
                    {processing ? "Mengirimkan Berkas..." : "Kirim Lamaran Sekarang"}
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

