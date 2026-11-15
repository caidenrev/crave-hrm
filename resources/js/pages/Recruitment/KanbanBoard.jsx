import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Users,
  Briefcase,
  UserCheck,
  Video,
  Award,
  Plus,
  ExternalLink,
  Search,
  Filter,
  Star,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobPostingModal } from "./JobPostingModal";
import { CandidateSheet } from "./CandidateSheet";
import { ConfirmActionDialog } from "@/components/ui/ConfirmActionDialog";
import { formatRupiah, formatTanggal, getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function KanbanBoard({
  candidates = [],
  jobPostings = [],
  selectedJobId = "all",
  search = "",
  archiveFilter = "active",
  archivedCount = 0,
  metrics = {},
  departments = [],
  branches = [],
  designations = [],
  companySlug = "crave-holding",
}) {
  const [activeView, setActiveView] = useState("kanban"); // "kanban" | "jobs"
  const [searchQuery, setSearchQuery] = useState(search);
  const [jobFilter, setJobFilter] = useState(selectedJobId);
  const [archiveMode, setArchiveMode] = useState(archiveFilter);

  // Modals state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteJobTarget, setDeleteJobTarget] = useState(null);
  const [deleteJobDialogOpen, setDeleteJobDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSheetOpen, setCandidateSheetOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Keep selected candidate synced with fresh data from candidates prop
  React.useEffect(() => {
    if (selectedCandidate) {
      const fresh = candidates.find((c) => c.id === selectedCandidate.id);
      if (fresh) {
        setSelectedCandidate(fresh);
      }
    }
  }, [candidates]);

  const STAGES = [
    { key: "applied", label: "Applied", desc: "Pelamar Baru", border: "border-slate-500/30", badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300" },
    { key: "screening", label: "Screening", desc: "Seleksi Berkas", border: "border-blue-500/30", badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
    { key: "interview", label: "Interview", desc: "Sesi Wawancara", border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { key: "offering", label: "Offering", desc: "Penawaran Kerja", border: "border-purple-500/30", badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
    { key: "hired", label: "Hired", desc: archiveMode === "active" ? "Diterima (< 20 hari)" : "Diterima / Onboard", border: "border-emerald-500/40", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { key: "rejected", label: "Rejected", desc: archiveMode === "active" ? "Tidak Lolos (< 20 hari)" : "Tidak Lolos", border: "border-rose-500/30", badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
  ];

  const handleFilterChange = (newJobId, newSearch, newArchive) => {
    const archiveParam = newArchive !== undefined ? newArchive : archiveMode;
    router.get(
      "/recruitment",
      {
        job_id: newJobId,
        search: newSearch,
        archive: archiveParam,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleStageAdvance = (candidate, targetStage) => {
    if (candidate.is_converted_to_employee) {
      if (typeof window !== "undefined" && window.craveToast) {
        window.craveToast.error("Kandidat telah resmi menjadi Karyawan. Status tahap rekrutmen terkunci permanen.");
      }
      return;
    }
    router.patch(
      `/recruitment/candidates/${candidate.id}/stage`,
      { stage: targetStage },
      { preserveScroll: true }
    );
  };

  const openCandidateDetail = (cand) => {
    setSelectedCandidate(cand);
    setCandidateSheetOpen(true);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setJobModalOpen(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobModalOpen(true);
  };

  const confirmDeleteJob = (job) => {
    setDeleteJobTarget(job);
    setDeleteJobDialogOpen(true);
  };

  const executeDeleteJob = () => {
    if (!deleteJobTarget) return;
    router.delete(`/recruitment/jobs/${deleteJobTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteJobDialogOpen(false),
    });
  };

  const handleCopyPublicLink = (job) => {
    const url = `${window.location.origin}/careers/${companySlug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(job.id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Group candidates by stage
  const groupedCandidates = STAGES.reduce((acc, stage) => {
    acc[stage.key] = candidates.filter((c) => c.stage === stage.key);
    return acc;
  }, {});

  return (
    <AuthenticatedLayout
      title="Crave E-Recruitment"
      subtitle="Kelola rekrutmen talenta, portal karir publik, pipeline ATS, dan onboarding karyawan baru"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/careers/${companySlug}`, "_blank")}
            className="rounded-xl text-xs font-semibold h-9 gap-1.5 shadow-soft"
          >
            <ExternalLink className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Lihat</span> Portal Karir
          </Button>

          <Button
            size="sm"
            onClick={handleCreateJob}
            className="rounded-xl text-xs font-bold h-9 bg-primary text-primary-foreground gap-1.5 shadow-soft"
          >
            <Plus className="size-4" />
            <span>Tambah Lowongan</span>
          </Button>
        </div>
      }
    >
      <Head title="Crave E-Recruitment & ATS Kanban" />

      <div className="space-y-6">
        {/* Top 4 KPI Cards (Crave POS Design Tokens: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Hero Blue */}
          <div className="rounded-2xl p-5 bg-primary text-primary-foreground shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
                Total Pelamar Masuk
              </span>
              <Users className="size-5 text-primary-foreground/80" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black tracking-tight">
                {metrics.total_candidates || 0}
              </div>
              <div className="text-[12px] text-primary-foreground/80 mt-0.5">
                {metrics.open_jobs_count || 0} lowongan aktif dibuka
              </div>
            </div>
          </div>

          {/* Card 2: Interview */}
          <div className="card-soft p-5 bg-card border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tahap Interview
              </span>
              <Video className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black tracking-tight text-foreground">
                {metrics.interview_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                Kandidat dijadwalkan wawancara
              </div>
            </div>
          </div>

          {/* Card 3: Offering */}
          <div className="card-soft p-5 bg-card border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tahap Penawaran (Offering)
              </span>
              <Award className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black tracking-tight text-foreground">
                {metrics.offering_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                Surat penawaran kerja dikirim
              </div>
            </div>
          </div>

          {/* Card 4: Hired */}
          <div className="card-soft p-5 bg-card border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Diterima &amp; Onboard
              </span>
              <UserCheck className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black tracking-tight text-foreground">
                {metrics.hired_count || 0}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                Kandidat lolos seleksi final
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Pills & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/40 p-2 rounded-2xl border border-border/50">
          {/* Sub-Route Navigation Pills */}
          <div className="flex items-center rounded-xl bg-card p-1 shadow-2xs border border-border/60">
            <button
              type="button"
              onClick={() => setActiveView("kanban")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all",
                activeView === "kanban"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Papan Kanban ATS
            </button>
            <button
              type="button"
              onClick={() => setActiveView("jobs")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all",
                activeView === "jobs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Kelola Lowongan ({jobPostings.length})
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search candidate */}
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange(jobFilter, e.target.value);
                }}
                placeholder="Cari nama pelamar..."
                className="pl-8 rounded-xl h-8 text-xs bg-background"
              />
            </div>

            {/* Filter Job Posting */}
            <select
              value={jobFilter}
              onChange={(e) => {
                setJobFilter(e.target.value);
                handleFilterChange(e.target.value, searchQuery);
              }}
              className="h-8 rounded-xl border border-input bg-background px-3 text-xs font-semibold cursor-pointer outline-none focus:border-ring max-w-[220px] truncate"
            >
              <option value="all">Semua Lowongan ({jobPostings.length})</option>
              {jobPostings.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.candidates_count || 0})
                </option>
              ))}
            </select>

            {/* Filter Archive Window (20 Hari) */}
            <select
              value={archiveMode}
              onChange={(e) => {
                setArchiveMode(e.target.value);
                handleFilterChange(jobFilter, searchQuery, e.target.value);
              }}
              className="h-8 rounded-xl border border-input bg-background px-2.5 text-xs font-semibold cursor-pointer outline-none focus:border-ring"
            >
              <option value="active">Pipeline Aktif (20 Hari)</option>
              <option value="all">
                Semua Riwayat {archivedCount > 0 ? `(+${archivedCount} arsip)` : ""}
              </option>
            </select>
          </div>
        </div>

        {/* VIEW 1: ATS KANBAN BOARD */}
        {activeView === "kanban" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1200px] items-start">
              {STAGES.map((stage, sIdx) => {
                const stageCandidates = groupedCandidates[stage.key] || [];

                return (
                  <div
                    key={stage.key}
                    className="flex-1 min-w-[220px] rounded-2xl bg-muted/30 border border-border/60 p-3 flex flex-col"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-tight text-foreground uppercase">
                          {stage.label}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn("rounded-full text-[10px] font-extrabold px-1.5 py-0 h-4 min-w-4 flex items-center justify-center", stage.badge)}
                        >
                          {stageCandidates.length}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {stage.desc}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="space-y-2.5 min-h-[400px]">
                      {stageCandidates.length > 0 ? (
                        stageCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="card-soft p-3.5 bg-card border border-border/70 hover:border-primary/50 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
                            onClick={() => openCandidateDetail(candidate)}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Avatar className="size-7 shrink-0 border border-border/50">
                                    <AvatarFallback className="bg-primary/10 text-[10px] font-black text-primary uppercase">
                                      {getInitials(candidate.full_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                      {candidate.full_name}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {candidate.current_title || candidate.email}
                                    </p>
                                  </div>
                                </div>

                                {candidate.rating > 0 && (
                                  <div className="flex items-center text-amber-500 text-[10px] font-bold shrink-0">
                                    <Star className="size-3 fill-amber-400 text-amber-400 mr-0.5" />
                                    {candidate.rating}
                                  </div>
                                )}
                              </div>

                              {/* Position Applied Badge */}
                              <div className="mt-2.5">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground truncate max-w-full">
                                  {candidate.job_posting?.title || "-"}
                                </span>
                              </div>

                              {/* Interview schedule badge if present */}
                              {candidate.interview_scheduled_at && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                                  <Clock className="size-2.5 shrink-0" />
                                  <span className="truncate">
                                    {formatTanggal(candidate.interview_scheduled_at)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Card Actions Footer */}
                            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
                              {/* If candidate is already converted to employee, show locked official status */}
                              {candidate.is_converted_to_employee ? (
                                <div className="w-full flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Resmi Karyawan
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {candidate.employee?.nik || "Active"}
                                  </span>
                                </div>
                              ) : stage.key === "hired" ? (
                                <div className="w-full">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCandidateDetail(candidate);
                                    }}
                                    className="w-full h-7 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                                  >
                                    <UserCheck className="size-3" /> Onboard Karyawan
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {candidate.source}
                                  </span>

                                  {/* Quick Step Buttons */}
                                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                    {sIdx > 0 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleStageAdvance(candidate, STAGES[sIdx - 1].key)}
                                        className="size-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                                        title={`Mundurkan ke ${STAGES[sIdx - 1].label}`}
                                      >
                                        <ChevronLeft className="size-3.5" />
                                      </Button>
                                    )}
                                    {sIdx < STAGES.length - 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleStageAdvance(candidate, STAGES[sIdx + 1].key)}
                                        className="size-6 p-0 rounded-md text-primary hover:bg-primary/10 cursor-pointer"
                                        title={`Majukan ke ${STAGES[sIdx + 1].label}`}
                                      >
                                        <ChevronRight className="size-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-32 rounded-xl border border-dashed border-border/60 flex items-center justify-center text-center p-3 text-[11px] text-muted-foreground">
                          Belum ada kandidat
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: JOB VACANCIES MANAGEMENT */}
        {activeView === "jobs" && (
          <div className="card-soft bg-card border border-border/70 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-foreground">
                  Daftar Lowongan Pekerjaan
                </h3>
                <p className="text-xs text-muted-foreground">
                  Kelola status publikasi, batas waktu, dan kualifikasi rekrutmen
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleCreateJob}
                className="rounded-xl text-xs font-bold h-8 bg-primary text-primary-foreground gap-1.5"
              >
                <Plus className="size-3.5" /> Tambah Posisi
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Posisi Pekerjaan</TableHead>
                    <TableHead className="text-xs font-bold">Departemen &amp; Cabang</TableHead>
                    <TableHead className="text-xs font-bold">Model Kerja</TableHead>
                    <TableHead className="text-xs font-bold text-center">Pelamar</TableHead>
                    <TableHead className="text-xs font-bold">Batas Lamaran</TableHead>
                    <TableHead className="text-xs font-bold text-center">Status</TableHead>
                    <TableHead className="text-xs font-bold text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobPostings.length > 0 ? (
                    jobPostings.map((job) => (
                      <TableRow key={job.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="font-extrabold text-xs text-foreground">
                            {job.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {job.employment_type} &bull; {job.experience_level}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs font-semibold">
                            {job.department?.name || "Umum"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {job.branch?.name || "Kantor Pusat"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
                            {job.workplace_type}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center font-bold text-xs">
                          {job.candidates_count || 0}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {job.deadline ? formatTanggal(job.deadline) : "Tanpa Batas"}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant={job.status === "published" ? "default" : "secondary"}
                            className="rounded-full text-[10px] font-semibold capitalize"
                          >
                            {job.status === "published" ? "Tayang" : job.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyPublicLink(job)}
                              className="size-7 p-0 rounded-lg"
                              title="Salin Link Portal Karir"
                            >
                              {copiedSlug === job.id ? (
                                <Check className="size-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="size-3.5 text-muted-foreground" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditJob(job)}
                              className="size-7 p-0 rounded-lg text-primary"
                              title="Edit Lowongan"
                            >
                              <Edit className="size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDeleteJob(job)}
                              className="size-7 p-0 rounded-lg text-destructive"
                              title="Hapus Lowongan"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                        Belum ada lowongan pekerjaan. Silakan klik Tambah Lowongan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Lowongan */}
      <JobPostingModal
        open={jobModalOpen}
        onOpenChange={setJobModalOpen}
        job={editingJob}
        departments={departments}
        branches={branches}
        designations={designations}
      />

      {/* Drawer Sheet Detail & Scorecard Pelamar */}
      <CandidateSheet
        candidate={selectedCandidate}
        open={candidateSheetOpen}
        onOpenChange={setCandidateSheetOpen}
        onStageChange={handleStageAdvance}
      />

      {/* Confirmation Dialog Hapus Lowongan */}
      <ConfirmActionDialog
        open={deleteJobDialogOpen}
        onOpenChange={setDeleteJobDialogOpen}
        title="Hapus Lowongan Pekerjaan"
        description={`Apakah Anda yakin ingin menghapus lowongan "${deleteJobTarget?.title}"? Seluruh berkas pelamar terkait posisi ini akan dihapus.`}
        confirmLabel="Hapus Lowongan"
        cancelLabel="Batal"
        onConfirm={executeDeleteJob}
        variant="destructive"
        icon={Trash2}
      />
    </AuthenticatedLayout>
  );
}

