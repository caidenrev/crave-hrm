import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Compass,
  Star,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  FileCheck2,
  Plus,
  ArrowUpRight,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Quote,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";
import { cn } from "@/lib/utils";

const COMPETENCIES = [
  {
    key: "score_technical",
    shortName: "Teknis & Mutu Kerja",
    name: "1. Keahlian Teknis & Mutu Kerja",
    desc: "Kedalaman kompetensi teknis, ketelitian hasil karya, dan kepatuhan standar SOP.",
  },
  {
    key: "score_communication",
    shortName: "Komunikasi & Kolaborasi",
    name: "2. Komunikasi & Kerjasama Tim",
    desc: "Kejelasan artikulasi gagasan, mendengar aktif, dan koordinasi lintas fungsi.",
  },
  {
    key: "score_initiative",
    shortName: "Inisiatif & Delivery",
    name: "3. Inisiatif & Kecepatan Kerja",
    desc: "Proaktif mengeksekusi solusi tanpa harus menunggu arahan bertingkat.",
  },
  {
    key: "score_problem_solving",
    shortName: "Pemecahan Masalah",
    name: "4. Analisis & Pemecahan Masalah",
    desc: "Kemampuan membedah akar kendala dan merumuskan langkah praktis yang efektif.",
  },
  {
    key: "score_integrity",
    shortName: "Integritas & Etika",
    name: "5. Integritas & Nilai Perusahaan",
    desc: "Kejujuran, ketepatan komitmen kerja, dan keselarasan dengan budaya Crave.",
  },
];

const RATING_LEVELS = [
  { val: 1, label: "Kurang", desc: "Jauh di bawah target" },
  { val: 2, label: "Perlu Dibina", desc: "Belum konsisten" },
  { val: 3, label: "Sesuai Ekspektasi", desc: "Memenuhi target" },
  { val: 4, label: "Melampaui Target", desc: "Hasil sangat baik" },
  { val: 5, label: "Istimewa", desc: "Role model & teladan" },
];

export default function PerformanceIndex({
  metrics = {},
  radarData = [],
  reviewsAboutMe = [],
  reviewsToFill = [],
  allReviews = [],
  currentEmployee = null,
  employees = [],
  flash = {},
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("aboutMe");
  const [chartViewMode, setChartViewMode] = useState("radar"); // "radar" | "bars"

  const { data, setData, post, processing, reset, errors } = useForm({
    review_id: "",
    employee_id: "",
    reviewer_type: "peer",
    score_technical: 4,
    score_communication: 4,
    score_initiative: 4,
    score_problem_solving: 4,
    score_integrity: 5,
    strengths: "",
    improvements: "",
  });

  const handleOpenEvaluationModal = (pendingReview = null) => {
    if (pendingReview) {
      setData({
        review_id: pendingReview.id,
        employee_id: String(pendingReview.employee_id),
        reviewer_type: pendingReview.reviewer_type || "peer",
        score_technical: pendingReview.score_technical || 4,
        score_communication: pendingReview.score_communication || 4,
        score_initiative: pendingReview.score_initiative || 4,
        score_problem_solving: pendingReview.score_problem_solving || 4,
        score_integrity: pendingReview.score_integrity || 5,
        strengths: pendingReview.strengths || "",
        improvements: pendingReview.improvements || "",
      });
    } else {
      const defaultEmp = employees.find((e) => e.id !== currentEmployee?.id);
      setData({
        review_id: "",
        employee_id: defaultEmp ? String(defaultEmp.id) : "",
        reviewer_type: "peer",
        score_technical: 4,
        score_communication: 4,
        score_initiative: 4,
        score_problem_solving: 4,
        score_integrity: 5,
        strengths: "",
        improvements: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    post("/performance/evaluate", {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        reset();
      },
    });
  };

  const getRaterBadge = (type) => {
    switch (type) {
      case "self":
        return (
          <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
            Self Review
          </Badge>
        );
      case "supervisor":
        return (
          <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
            Atasan Langsung
          </Badge>
        );
      case "peer":
        return (
          <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
            Rekan Sejawat
          </Badge>
        );
      case "subordinate":
        return (
          <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
            Bawahan Langsung
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
            {type}
          </Badge>
        );
    }
  };

  return (
    <AuthenticatedLayout
      title="360 Performance Review"
      subtitle={`Siklus evaluasi multi-rater terpadu (Self, Atasan, Rekan Sejawat & Bawahan) · Periode ${metrics.cycle_name || "Q4 2026"}`}
      actions={
        <Button
          size="sm"
          onClick={() => handleOpenEvaluationModal(null)}
          className="rounded-xl font-bold shadow-soft text-xs gap-1.5"
        >
          <Plus className="size-4" />
          <span>Beri Penilaian 360</span>
        </Button>
      }
    >
      <Head title="360 Performance Review : Crave HRM" />

      <div className="space-y-4 sm:space-y-5">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card p-4 text-xs font-semibold text-foreground shadow-2xs">
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* 4 Top KPI Cards (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3.5 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white">
                <Star className="size-5 sm:size-6 fill-white/20" />
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-white/90">
                <ArrowUpRight className="size-3.5" />
                {metrics.cycle_name || "Q4 2026"}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-2xl font-black tracking-tight sm:text-3xl text-white">
                {metrics.avg_score || "4.59"}{" "}
                <span className="text-xs font-medium text-white/75">/ 5.0</span>
              </div>
              <div className="text-[12px] text-white/80">Indeks Kompetensi Rata-Rata</div>
            </div>
          </div>

          {/* Card 1: Partisipasi Review */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3.5 shadow-soft sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <FileCheck2 className="size-5 sm:size-6 text-primary" />
              </span>
              <Badge variant="outline" className="rounded-full text-[10px] font-bold text-foreground">
                {metrics.completion_rate || 100}% Selesai
              </Badge>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                {metrics.completed_reviews || 0} / {metrics.total_reviews || 0}
              </div>
              <div className="text-[12px] text-muted-foreground">Evaluator Telah Mengisi</div>
            </div>
          </div>

          {/* Card 2: Menunggu Feedback Saya */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3.5 shadow-soft sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Clock className="size-5 sm:size-6 text-muted-foreground" />
              </span>
              <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
                Tenggat: 28 Nov
              </Badge>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                {metrics.pending_reviews_for_me || 0} Karyawan
              </div>
              <div className="text-[12px] text-muted-foreground">Perlu Evaluasi Anda</div>
            </div>
          </div>

          {/* Card 3: Dimensi Tertinggi (Clean Metric Icon, NO SPARKLES) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3.5 shadow-soft sm:rounded-3xl sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                <Target className="size-5 sm:size-6 text-primary" />
              </span>
              <Badge variant="outline" className="rounded-full text-[10px] font-bold text-foreground">
                Skor 5.0 / 5.0
              </Badge>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-base font-extrabold tracking-tight text-foreground sm:text-lg truncate">
                Integritas &amp; Etika
              </div>
              <div className="text-[12px] text-muted-foreground">Dimensi Paling Solid</div>
            </div>
          </div>
        </div>

        {/* Main Section: Radar Chart + Qualitative Insights */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Radar Chart Card */}
          <div className="card-soft p-4 sm:p-5 bg-card border border-border/60 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
                    <Compass className="size-4 text-primary" />
                    Radar Kompetensi 360
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Perbandingan penilaian Self, Atasan Langsung, dan Rekan Sejawat.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
                    <button
                      type="button"
                      onClick={() => setChartViewMode("radar")}
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[11px] font-semibold transition-all cursor-pointer",
                        chartViewMode === "radar"
                          ? "bg-card text-foreground font-bold shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Radar
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartViewMode("bars")}
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[11px] font-semibold transition-all cursor-pointer",
                        chartViewMode === "bars"
                          ? "bg-card text-foreground font-bold shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Skor Bar
                    </button>
                  </div>

                  <Badge variant="outline" className="rounded-full text-[10px] font-semibold text-muted-foreground">
                    Target: 4.0
                  </Badge>
                </div>
              </div>

              {/* Chart Body */}
              {chartViewMode === "radar" ? (
                <div className="mt-2 h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                      <PolarGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "var(--color-foreground)", fontSize: 11, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 5]}
                        tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-card)",
                          color: "var(--color-foreground)",
                          fontSize: 12,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                        iconType="circle"
                      />
                      <Radar
                        name="Self Review"
                        dataKey="Self"
                        stroke="#1B5CFE"
                        fill="#1B5CFE"
                        fillOpacity={0.25}
                      />
                      <Radar
                        name="Atasan Langsung"
                        dataKey="Supervisor"
                        stroke="#4338CA"
                        fill="#4338CA"
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="Rekan Sejawat"
                        dataKey="Peer"
                        stroke="#059669"
                        fill="#059669"
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-4 space-y-3.5">
                  {radarData.map((item) => (
                    <div key={item.subject} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">{item.subject}</span>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>Self: <strong>{item.Self}</strong></span>
                          <span>Atasan: <strong>{item.Supervisor}</strong></span>
                          <span>Peer: <strong>{item.Peer}</strong></span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(item.Self / 5) * 100}%` }}
                          title={`Self: ${item.Self}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom 3 Summary Pillars */}
            <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block font-medium">Self Review</span>
                <span className="font-extrabold text-foreground text-sm">4.58</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block font-medium">Atasan Langsung</span>
                <span className="font-extrabold text-foreground text-sm">4.62</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block font-medium">Rata-Rata Peer</span>
                <span className="font-extrabold text-foreground text-sm">4.56</span>
              </div>
            </div>
          </div>

          {/* Qualitative Insights Card */}
          <div className="card-soft p-4 sm:p-5 bg-card border border-border/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/50">
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
                    <MessageSquare className="size-4 text-primary" />
                    Kutipan Feedback &amp; Masukan
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Sintesis umpan balik objektif dari seluruh rater.
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full text-[10px] font-semibold text-muted-foreground">
                  Anonim
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                {/* Strengths Card */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-primary" />
                      Kekuatan Utama (Strengths)
                    </span>
                    <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
                      Atasan Langsung
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Kepemimpinan teknis sangat solid, arsitektur sistem monolit modern berjalan stabil, dan kepatuhan regulasi ketenagakerjaan terimplementasi akurat."
                  </p>
                </div>

                {/* Improvements Card */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="size-4 text-muted-foreground" />
                      Area Pengembangan (Growth Opportunity)
                    </span>
                    <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
                      Rekan Sejawat
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Perlu mendelegasikan beberapa tugas operasional teknis agar lebih fokus ke strategi jangka panjang, dan buat dokumentasi SOP tertulis untuk tim junior."
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Identitas reviewer sejawat dilindungi demi menjaga objektivitas hasil penilaian 360.</span>
            </div>
          </div>
        </div>

        {/* Tabbed Reviews Section */}
        <div className="card-soft p-4 sm:p-5 bg-card border border-border/60">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <TabsList className="rounded-xl h-9">
                <TabsTrigger value="aboutMe" className="text-xs px-3 font-semibold">
                  Review Tentang Saya ({reviewsAboutMe.length})
                </TabsTrigger>
                <TabsTrigger value="toFill" className="text-xs px-3 font-semibold">
                  Perlu Saya Isi ({reviewsToFill.length})
                </TabsTrigger>
                <TabsTrigger value="allTeam" className="text-xs px-3 font-semibold">
                  Matriks Evaluasi Tim ({allReviews.length})
                </TabsTrigger>
              </TabsList>

              <Badge variant="outline" className="rounded-full text-xs font-semibold text-muted-foreground">
                Periode Aktif: {metrics.cycle_name || "Q4 2026"}
              </Badge>
            </div>

            {/* TAB 1: Review Tentang Saya */}
            <TabsContent value="aboutMe" className="mt-4 space-y-3">
              {reviewsAboutMe.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground rounded-2xl border border-dashed border-border/60">
                  Belum ada evaluasi yang masuk untuk Anda pada siklus ini.
                </div>
              ) : (
                <div className="grid gap-3.5 md:grid-cols-2">
                  {reviewsAboutMe.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-border/60 bg-card p-4 space-y-3.5 shadow-2xs hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <EmployeeAvatar
                            person={r.reviewer || r.employee}
                            size="sm"
                            className="size-8"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {r.reviewer?.nama_lengkap || (r.reviewer_type === "self" ? "Self Evaluation" : "Anonim (Rekan Sejawat)")}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {getRaterBadge(r.reviewer_type)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 font-black text-xs text-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border/40">
                          <Star className="size-3 fill-amber-500 text-amber-500" />
                          <span>{r.overall_score || "0.0"} / 5.0</span>
                        </div>
                      </div>

                      {/* 5 Competency Bars */}
                      <div className="space-y-1.5 text-xs">
                        {COMPETENCIES.map((comp) => {
                          const val = Number(r[comp.key]) || 0;
                          return (
                            <div key={comp.key} className="flex items-center justify-between gap-3 text-[11px]">
                              <span className="text-muted-foreground truncate w-36">
                                {comp.shortName}
                              </span>
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${(val / 5) * 100}%` }}
                                />
                              </div>
                              <span className="font-bold text-foreground text-[11px] w-6 text-right">
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Qualitative Comments */}
                      <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
                        {r.strengths && (
                          <div className="rounded-xl bg-muted/30 p-2.5 space-y-0.5">
                            <span className="font-bold text-foreground text-[11px] block">
                              Kekuatan Utama:
                            </span>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {r.strengths}
                            </p>
                          </div>
                        )}
                        {r.improvements && (
                          <div className="rounded-xl bg-muted/30 p-2.5 space-y-0.5">
                            <span className="font-bold text-foreground text-[11px] block">
                              Area Pengembangan:
                            </span>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {r.improvements}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: Perlu Saya Isi */}
            <TabsContent value="toFill" className="mt-4 space-y-3">
              {reviewsToFill.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground rounded-2xl border border-dashed border-border/60">
                  Semua formulir penilaian yang ditugaskan kepada Anda telah rampung diisi.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {reviewsToFill.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <EmployeeAvatar
                          person={r.employee}
                          size="default"
                          className="size-10"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-foreground truncate">
                              {r.employee?.nama_lengkap || "Karyawan"}
                            </p>
                            {getRaterBadge(r.reviewer_type)}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {r.employee?.department?.name || "Divisi Operasional"} · NIK: {r.employee?.nik || "-"}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleOpenEvaluationModal(r)}
                        className="rounded-xl text-xs font-bold gap-1 shadow-soft shrink-0"
                      >
                        <span>Nilai</span>
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB 3: Matriks Evaluasi Tim (Shadcn Table) */}
            <TabsContent value="allTeam" className="mt-4">
              <div className="rounded-2xl border border-border/60 overflow-hidden bg-card">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="font-bold text-xs text-muted-foreground">Karyawan</TableHead>
                      <TableHead className="font-bold text-xs text-muted-foreground">Evaluator</TableHead>
                      <TableHead className="font-bold text-xs text-muted-foreground">Hubungan Kerja</TableHead>
                      <TableHead className="font-bold text-xs text-muted-foreground">Skor Rata-Rata</TableHead>
                      <TableHead className="font-bold text-xs text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allReviews.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-xs text-foreground">
                          <div className="flex items-center gap-2">
                            <EmployeeAvatar person={r.employee} size="sm" className="size-7" />
                            <span>{r.employee?.nama_lengkap || "Karyawan"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.reviewer?.nama_lengkap || (r.reviewer_type === "self" ? "Diri Sendiri" : "Anonim (Peer)")}
                        </TableCell>
                        <TableCell>{getRaterBadge(r.reviewer_type)}</TableCell>
                        <TableCell className="font-black text-xs text-foreground">
                          {r.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <Star className="size-3 fill-amber-500 text-amber-500" />
                              {r.overall_score} / 5.0
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {r.status === "completed" ? (
                            <Badge variant="outline" className="rounded-full text-[10px] font-semibold text-foreground">
                              Selesai
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
                              Menunggu
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* MODAL FORM EVALUASI 360 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Compass className="size-4 text-primary" />
              Formulir Evaluasi 360 Performance ({metrics.cycle_name || "Q4 2026"})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Berikan penilaian objektif pada skala 1–5 untuk kelima dimensi kompetensi inti Crave.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEvaluation} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Karyawan yang Dinilai *</Label>
                <Select
                  value={String(data.employee_id)}
                  onValueChange={(val) => setData("employee_id", val)}
                >
                  <SelectTrigger className="rounded-xl text-xs h-9">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)} className="text-xs">
                        {emp.nama_lengkap} ({emp.nik})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee_id && (
                  <p className="text-xs text-destructive">{errors.employee_id}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Peran Evaluator *</Label>
                <Select
                  value={data.reviewer_type}
                  onValueChange={(val) => setData("reviewer_type", val)}
                >
                  <SelectTrigger className="rounded-xl text-xs h-9">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="peer" className="text-xs">Rekan Sejawat (Peer)</SelectItem>
                    <SelectItem value="supervisor" className="text-xs">Atasan Langsung (Lead)</SelectItem>
                    <SelectItem value="subordinate" className="text-xs">Bawahan Langsung</SelectItem>
                    <SelectItem value="self" className="text-xs">Diri Sendiri (Self)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reviewer_type && (
                  <p className="text-xs text-destructive">{errors.reviewer_type}</p>
                )}
              </div>
            </div>

            {/* 5 Likert Competency Segments */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Skala Penilaian 5 Kompetensi
                </span>
                <span className="text-[10px] text-muted-foreground">
                  1 = Kurang s.d. 5 = Istimewa
                </span>
              </div>

              {COMPETENCIES.map((comp) => {
                const currentVal = Number(data[comp.key]) || 4;
                const activeLevel = RATING_LEVELS.find((l) => l.val === currentVal);
                return (
                  <div
                    key={comp.key}
                    className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground block">
                          {comp.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {comp.desc}
                        </span>
                      </div>
                      <Badge variant="outline" className="rounded-full text-[10px] font-bold shrink-0 ml-2">
                        {currentVal} · {activeLevel?.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {RATING_LEVELS.map((level) => (
                        <button
                          key={level.val}
                          type="button"
                          onClick={() => setData(comp.key, level.val)}
                          className={cn(
                            "py-2 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5",
                            currentVal === level.val
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                              : "bg-card text-muted-foreground border-border/60 hover:bg-muted/60 text-xs"
                          )}
                        >
                          <span className="text-xs">{level.val}</span>
                          <span className="text-[9px] truncate w-full px-0.5 opacity-90 hidden sm:block">
                            {level.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Kekuatan Utama (Strengths)</Label>
                <Textarea
                  placeholder="Ceritakan kontribusi terbaik atau teladan positif yang ditunjukkan karyawan..."
                  value={data.strengths}
                  onChange={(e) => setData("strengths", e.target.value)}
                  rows={2}
                  className="rounded-xl text-xs bg-card"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Area Pengembangan (Growth Opportunities)</Label>
                <Textarea
                  placeholder="Saran konstruktif agar performa kerja dapat lebih optimal ke depannya..."
                  value={data.improvements}
                  onChange={(e) => setData("improvements", e.target.value)}
                  rows={2}
                  className="rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                {processing ? "Menyimpan..." : "Kirim Penilaian 360"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
