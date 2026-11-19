import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmActionDialog } from "@/components/ui/ConfirmActionDialog";
import {
  formatRupiah,
  formatTanggal,
  getInitials,
} from "@/lib/formatters";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ExternalLink,
  Star,
  Calendar,
  Video,
  FileText,
  UserCheck,
  CheckCircle2,
  Printer,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CandidateSheet({
  candidate,
  open,
  onOpenChange,
  onStageChange,
}) {
  if (!candidate) return null;

  // Local state for Stage (immediate visual sync)
  const [currentStage, setCurrentStage] = useState(candidate.stage || "applied");

  // Local state for Scorecard & Notes
  const [rating, setRating] = useState(candidate.rating || 0);
  const [interviewNotes, setInterviewNotes] = useState(candidate.interview_notes || "");
  const [interviewDate, setInterviewDate] = useState(
    candidate.interview_scheduled_at
      ? candidate.interview_scheduled_at.replace(" ", "T").substring(0, 16)
      : ""
  );
  const [meetingLink, setMeetingLink] = useState(candidate.interview_meeting_link || "");
  const [offeredSalary, setOfferedSalary] = useState(
    candidate.offered_salary ? String(Math.round(candidate.offered_salary)) : ""
  );

  const [savingScorecard, setSavingScorecard] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [converting, setConverting] = useState(false);
  const [confirmConvertOpen, setConfirmConvertOpen] = useState(false);
  const [deleteCandidateOpen, setDeleteCandidateOpen] = useState(false);
  const [deletingCandidate, setDeletingCandidate] = useState(false);

  const handleDeleteCandidate = () => {
    if (candidate.is_converted_to_employee && candidate.employee_id) {
      if (typeof window !== "undefined" && window.craveToast) {
        window.craveToast.error("Kandidat telah resmi menjadi Karyawan aktif. Hapus akun di Data Karyawan terlebih dahulu.");
      }
      return;
    }

    setDeletingCandidate(true);
    router.delete(`/recruitment/candidates/${candidate.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteCandidateOpen(false);
        setDeletingCandidate(false);
        onOpenChange(false);
      },
      onError: () => {
        setDeletingCandidate(false);
      },
    });
  };

  // Sync state whenever candidate prop changes
  useEffect(() => {
    if (candidate) {
      setCurrentStage(candidate.stage || "applied");
      setRating(candidate.rating || 0);
      setInterviewNotes(candidate.interview_notes || "");
      setInterviewDate(
        candidate.interview_scheduled_at
          ? candidate.interview_scheduled_at.replace(" ", "T").substring(0, 16)
          : ""
      );
      setMeetingLink(candidate.interview_meeting_link || "");
      setOfferedSalary(
        candidate.offered_salary ? String(Math.round(candidate.offered_salary)) : ""
      );
    }
  }, [candidate]);

  const handleStageClick = (targetStage) => {
    if (candidate.is_converted_to_employee) {
      if (typeof window !== "undefined" && window.craveToast) {
        window.craveToast.error("Kandidat telah resmi menjadi Karyawan. Status tahap rekrutmen terkunci permanen.");
      }
      return;
    }
    if (targetStage === currentStage) return;

    setCurrentStage(targetStage);
    onStageChange?.(candidate, targetStage);
  };

  const handleSaveScorecard = (e) => {
    e?.preventDefault();
    if (currentStage === "applied" && rating > 0) {
      if (typeof window !== "undefined" && window.craveToast) {
        window.craveToast.error("Penilaian rating hanya dapat diberikan setelah kandidat memasuki tahap Screening atau Wawancara.");
      }
      return;
    }

    setSavingScorecard(true);
    router.patch(
      `/recruitment/candidates/${candidate.id}/scorecard`,
      {
        rating: currentStage === "applied" ? 0 : rating,
        interview_notes: interviewNotes,
        offered_salary: offeredSalary || null,
      },
      {
        preserveScroll: true,
        onFinish: () => setSavingScorecard(false),
      }
    );
  };

  const handleSaveSchedule = (e) => {
    e?.preventDefault();
    setSavingSchedule(true);
    router.post(
      `/recruitment/candidates/${candidate.id}/schedule`,
      {
        interview_scheduled_at: interviewDate,
        interview_meeting_link: meetingLink,
        interview_notes: interviewNotes,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          if (["applied", "screening"].includes(currentStage)) {
            setCurrentStage("interview");
          }
        },
        onFinish: () => setSavingSchedule(false),
      }
    );
  };

  const handleExecuteConvert = () => {
    if (currentStage !== "hired") {
      if (typeof window !== "undefined" && window.craveToast) {
        window.craveToast.error("Kandidat harus berada di tahap Diterima (Hired) untuk dapat di-onboard.");
      }
      return;
    }

    setConverting(true);
    router.post(
      `/recruitment/candidates/${candidate.id}/convert`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setConfirmConvertOpen(false);
          setConverting(false);
        },
        onError: () => {
          setConverting(false);
        },
      }
    );
  };

  const stages = [
    { key: "applied", label: "Applied" },
    { key: "screening", label: "Screening" },
    { key: "interview", label: "Interview" },
    { key: "offering", label: "Offering" },
    { key: "hired", label: "Hired" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent showCloseButton={false} className="w-full sm:max-w-lg overflow-y-auto p-5">
          {/* Header Profil Pelamar */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b">
            <div className="flex items-center gap-3 min-w-0">
              <EmployeeAvatar
                person={candidate}
                name={candidate.full_name}
                className="size-12 border border-border/60"
                fallbackClassName="text-sm font-extrabold"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold truncate text-foreground">
                    {candidate.full_name}
                  </h2>
                  {candidate.is_converted_to_employee && (
                    <Badge variant="default" className="rounded-full text-[10px] bg-emerald-600 gap-1 shrink-0 font-bold">
                      <CheckCircle2 className="size-2.5" /> Karyawan
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  Melamar: <strong className="text-foreground">{candidate.job_posting?.title || "-"}</strong>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="rounded-full text-[10px] font-semibold uppercase">
                    Tahap: {candidate.is_converted_to_employee ? "Hired (Karyawan)" : currentStage}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Sumber: {candidate.source}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={Boolean(candidate.is_converted_to_employee && candidate.employee_id)}
                onClick={() => setDeleteCandidateOpen(true)}
                className="rounded-xl size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                title={candidate.is_converted_to_employee && candidate.employee_id ? "Tidak dapat dihapus: Karyawan aktif" : "Hapus Berkas Pelamar"}
              >
                <Trash2 className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-xl size-8 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="Tutup Panel"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stage Mover Pipeline */}
          <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/50">
            {candidate.is_converted_to_employee ? (
              <div className="flex items-center gap-2.5 p-1 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-bold">Status Terkunci: Resmi Menjadi Karyawan</p>
                  <p className="text-[11px] font-normal text-muted-foreground mt-0.5">
                    Kandidat telah resmi di-onboard ke Master Data Karyawan. Tahap rekrutmen terkunci permanen.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <span className="text-[11px] font-bold text-foreground block mb-2">
                  Ubah Status Tahap Kandidat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stages.map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => handleStageClick(st.key)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer",
                        currentStage === st.key
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-background border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tabs Informasi */}
          <div className="mt-4">
            <Tabs defaultValue="profil" className="w-full">
              <TabsList className="grid grid-cols-3 w-full rounded-xl mb-4 h-9">
                <TabsTrigger value="profil" className="text-xs cursor-pointer">
                  Profil &amp; CV
                </TabsTrigger>
                <TabsTrigger value="scorecard" className="text-xs cursor-pointer">
                  Scorecard
                </TabsTrigger>
                <TabsTrigger value="onboard" className="text-xs cursor-pointer">
                  Onboarding
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: PROFIL & CV */}
              <TabsContent value="profil" className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-2.5 text-xs">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <span className="truncate font-semibold text-foreground">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-2.5 text-xs">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground">{candidate.phone}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pekerjaan Saat Ini:</span>
                    <span className="font-semibold text-foreground">
                      {candidate.current_title ? `${candidate.current_title} di ${candidate.current_company || '-'}` : "Tidak disebutkan"}
                    </span>
                  </div>
                  {candidate.linkedin_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Profil LinkedIn:</span>
                      <a
                        href={candidate.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        Buka LinkedIn <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                  {candidate.portfolio_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Portofolio / GitHub:</span>
                      <a
                        href={candidate.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        Buka Portofolio <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Resume / CV Box */}
                <div className="card-soft p-3 bg-card border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Berkas Resume / CV</p>
                      <p className="text-[10px] text-muted-foreground">
                        {candidate.resume_path ? "File dokumen terlampir" : "Tidak ada file CV terlampir"}
                      </p>
                    </div>
                  </div>
                  {candidate.resume_path ? (
                    <a
                      href={candidate.resume_path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Buka Dokumen <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                {/* Surat Lamaran / Cover Letter */}
                {candidate.cover_letter && (
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-foreground">Surat Lamaran / Catatan Pelamar:</Label>
                    <div className="p-3 rounded-xl bg-muted/40 border text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                      {candidate.cover_letter}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: SCORECARD & INTERVIEW */}
              <TabsContent value="scorecard" className="space-y-3.5">
                {/* Star Rating Picker */}
                <div className="p-3 rounded-xl bg-muted/40 border space-y-2">
                  <Label className="text-xs font-bold text-foreground">Penilaian Keseluruhan (Rating)</Label>

                  {currentStage === "applied" ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>Rating Penilaian Terkunci pada Tahap Applied</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Penilaian rating bintang dan evaluasi dibuka mulai tahap <strong>Screening (Seleksi Berkas)</strong> atau <strong>Wawancara</strong>. Pindahkan kandidat ke tahap Screening terlebih dahulu untuk mulai menilai kualifikasi.
                      </p>
                      <div className="flex items-center gap-1 opacity-40 pt-0.5 pointer-events-none">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="size-5 text-muted-foreground" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                          title={`Beri rating ${star} bintang`}
                        >
                          <Star
                            className={cn(
                              "size-6",
                              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-foreground ml-2">
                        {rating > 0 ? `${rating} dari 5 Bintang` : "Belum dinilai"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Interview Scheduler */}
                <div className="p-3 rounded-xl border space-y-3 bg-card">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Jadwal Sesi Wawancara</span>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Waktu Interview (Tanggal &amp; Jam)</Label>
                    <Input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Tautan Rapat Online (Google Meet / Zoom)</Label>
                    <div className="relative">
                      <Video className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/abc-defg-hij"
                        className="rounded-xl h-9 text-xs pl-9"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    disabled={savingSchedule || !interviewDate}
                    onClick={handleSaveSchedule}
                    className="w-full rounded-xl text-xs font-bold h-8 cursor-pointer"
                  >
                    {savingSchedule ? "Menyimpan Jadwal..." : "Jadwalkan & Pindahkan ke Interview"}
                  </Button>
                </div>

                {/* Catatan Wawancara */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Catatan Penilaian &amp; Hasil Wawancara</Label>
                  <textarea
                    rows={4}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Tuliskan catatan teknis, kelebihan kandidat, dan pertimbangan tim..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-ring resize-none leading-relaxed"
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={savingScorecard}
                    onClick={handleSaveScorecard}
                    className="rounded-xl text-xs font-bold h-8 cursor-pointer"
                  >
                    {savingScorecard ? "Menyimpan..." : "Simpan Scorecard & Catatan"}
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 3: PENAWARAN & 1-CLICK ONBOARD */}
              <TabsContent value="onboard" className="space-y-4">
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Kompensasi Penawaran Kerja (Offering)</span>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Gaji Pokok yang Disepakati (Rp)</Label>
                    <Input
                      type="number"
                      value={offeredSalary}
                      onChange={(e) => setOfferedSalary(e.target.value)}
                      placeholder="Contoh: 18000000"
                      className="rounded-xl h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/recruitment/candidates/${candidate.id}/offering`, "_blank")}
                      className="rounded-xl text-xs font-bold h-8 gap-1.5 flex-1 cursor-pointer"
                    >
                      <Printer className="size-3.5" /> Cetak Surat Penawaran
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveScorecard}
                      disabled={savingScorecard}
                      className="rounded-xl text-xs font-bold h-8 cursor-pointer"
                    >
                      Simpan
                    </Button>
                  </div>
                </div>

                {/* 1-Click Onboard Execution Area */}
                <div className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span className="text-xs font-bold text-foreground">Status Onboarding Karyawan Baru</span>
                  </div>

                  {candidate.is_converted_to_employee ? (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div>
                          <p className="font-bold">Kandidat Telah Resmi Di-onboard</p>
                          <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                            Data kandidat telah resmi dikonversi menjadi Akun Karyawan aktif di Master Data Karyawan dan otomatis terhubung ke sistem presensi, cuti, serta payroll.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => router.visit('/employees')}
                          className="rounded-xl text-xs font-bold h-7 gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                        >
                          Lihat di Master Data Karyawan <ExternalLink className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ) : currentStage !== "hired" ? (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                        <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>Syarat Onboarding Belum Terpenuhi</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Kandidat saat ini masih berada di tahap <strong className="text-foreground uppercase font-black">{currentStage}</strong>. Untuk menjaga integritas data kepegawaian, kandidat harus melalui proses evaluasi seleksi dan dipindahkan ke tahap <strong className="text-foreground font-black">Diterima (Hired)</strong> sebelum dapat di-onboard ke Master Data Karyawan.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleStageClick("hired")}
                        className="rounded-xl text-xs font-bold h-8 bg-amber-600 hover:bg-amber-700 text-white gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="size-3.5" /> Pindahkan ke Tahap Hired
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Kandidat telah lolos seleksi dan berada di tahap <strong className="text-foreground font-bold">Diterima (Hired)</strong>. Tekan tombol di bawah untuk membuat akun master karyawan secara instan.
                      </p>

                      <Button
                        type="button"
                        onClick={() => setConfirmConvertOpen(true)}
                        className="w-full rounded-xl text-xs font-bold h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs cursor-pointer"
                      >
                        <UserCheck className="size-4" /> 1-Click Onboard ke Karyawan Baru
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog for 1-Click Onboard */}
      <ConfirmActionDialog
        open={confirmConvertOpen}
        onOpenChange={setConfirmConvertOpen}
        title="Konfirmasi Onboarding Karyawan"
        description={`Apakah Anda yakin ingin mengonversi pelamar ${candidate.full_name} menjadi akun Karyawan Baru resmi? NIK karyawan akan dibuat otomatis dan data akan terdaftar di Master Data Karyawan.`}
        confirmLabel="Ya, Onboard Sekarang"
        cancelLabel="Batal"
        onConfirm={handleExecuteConvert}
        loading={converting}
        variant="success"
        icon={UserCheck}
      />

      {/* Confirmation Dialog for Delete Candidate */}
      <ConfirmActionDialog
        open={deleteCandidateOpen}
        onOpenChange={setDeleteCandidateOpen}
        title="Hapus Berkas Pelamar"
        description={`Apakah Anda yakin ingin menghapus seluruh berkas lamaran atas nama ${candidate.full_name}? Tindakan ini akan menghapus data pelamar dari sistem rekrutmen secara permanen.`}
        confirmLabel="Ya, Hapus Berkas"
        cancelLabel="Batal"
        onConfirm={handleDeleteCandidate}
        loading={deletingCandidate}
        variant="destructive"
        icon={Trash2}
      />
    </>
  );
}
