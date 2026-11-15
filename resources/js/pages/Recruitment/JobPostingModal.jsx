import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Users } from "lucide-react";

export function JobPostingModal({
  open,
  onOpenChange,
  job = null,
  departments = [],
  branches = [],
  designations = [],
}) {
  const isEditing = !!job;

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    title: "",
    branch_id: "",
    department_id: "",
    designation_id: "",
    employment_type: "PKWTT",
    workplace_type: "On-site",
    experience_level: "Mid Level",
    min_salary: "",
    max_salary: "",
    show_salary: true,
    description: "",
    requirements: "",
    benefits: "",
    vacancies_count: 1,
    deadline: "",
    status: "published",
  });

  useEffect(() => {
    if (job) {
      setData({
        title: job.title || "",
        branch_id: job.branch_id ? String(job.branch_id) : "",
        department_id: job.department_id ? String(job.department_id) : "",
        designation_id: job.designation_id ? String(job.designation_id) : "",
        employment_type: job.employment_type || "PKWTT",
        workplace_type: job.workplace_type || "On-site",
        experience_level: job.experience_level || "Mid Level",
        min_salary: job.min_salary ? String(Math.round(job.min_salary)) : "",
        max_salary: job.max_salary ? String(Math.round(job.max_salary)) : "",
        show_salary: job.show_salary ?? true,
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        vacancies_count: job.vacancies_count || 1,
        deadline: job.deadline ? job.deadline.split("T")[0] : "",
        status: job.status || "published",
      });
    } else {
      reset();
      clearErrors();
    }
  }, [job, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(`/recruitment/jobs/${job.id}`, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      post("/recruitment/jobs", {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-extrabold text-foreground">
                {isEditing ? "Edit Lowongan Pekerjaan" : "Terbitkan Lowongan Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Perbarui kriteria, gaji, dan deskripsi posisi pekerjaan."
                  : "Tambahkan posisi baru yang akan tampil di Portal Karir Publik."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Judul Posisi */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Judul Posisi Pekerjaan *
            </Label>
            <Input
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="Contoh: Senior Full Stack Engineer (React & Laravel)"
              className="rounded-xl h-9 text-xs"
              required
            />
            {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
          </div>

          {/* Departemen & Cabang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Departemen</Label>
              <select
                value={data.department_id}
                onChange={(e) => setData("department_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring"
              >
                <option value="">Pilih Departemen</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Kantor Cabang / Penempatan</Label>
              <select
                value={data.branch_id}
                onChange={(e) => setData("branch_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring"
              >
                <option value="">Pilih Cabang (Default: Kantor Pusat)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipe Kerja, Model Kerja, Pengalaman */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Status Kerja *</Label>
              <select
                value={data.employment_type}
                onChange={(e) => setData("employment_type", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring"
              >
                <option value="PKWTT">PKWTT (Tetap)</option>
                <option value="PKWT">PKWT (Kontrak)</option>
                <option value="Internship">Magang (Internship)</option>
                <option value="Freelance">Freelance / Proyek</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Model Kerja *</Label>
              <select
                value={data.workplace_type}
                onChange={(e) => setData("workplace_type", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring"
              >
                <option value="On-site">On-site (Kantor)</option>
                <option value="Hybrid">Hybrid (Kantor &amp; Remote)</option>
                <option value="Remote">100% Remote</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Tingkat Pengalaman *</Label>
              <select
                value={data.experience_level}
                onChange={(e) => setData("experience_level", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring"
              >
                <option value="Entry Level">Entry Level (&lt; 2 thn)</option>
                <option value="Mid Level">Mid Level (2 - 5 thn)</option>
                <option value="Senior Level">Senior Level (5+ thn)</option>
                <option value="Lead / Manager">Lead / Manager</option>
              </select>
            </div>
          </div>

          {/* Kompensasi Gaji */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">Rentang Gaji Bulanan (IDR)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Tampilkan di Publik</span>
                <Switch
                  checked={data.show_salary}
                  onCheckedChange={(val) => setData("show_salary", val)}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Gaji Minimum (Rp)</span>
                <Input
                  type="number"
                  value={data.min_salary}
                  onChange={(e) => setData("min_salary", e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="rounded-xl h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Gaji Maksimum (Rp)</span>
                <Input
                  type="number"
                  value={data.max_salary}
                  onChange={(e) => setData("max_salary", e.target.value)}
                  placeholder="Contoh: 20000000"
                  className="rounded-xl h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Kuota & Batas Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Jumlah Kuota *</Label>
              <Input
                type="number"
                min="1"
                value={data.vacancies_count}
                onChange={(e) => setData("vacancies_count", e.target.value)}
                className="rounded-xl h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Batas Akhir Lamaran</Label>
              <Input
                type="date"
                value={data.deadline}
                onChange={(e) => setData("deadline", e.target.value)}
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Status Publikasi *</Label>
              <select
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer outline-none focus:border-ring font-semibold"
              >
                <option value="published">Tayang (Published)</option>
                <option value="draft">Draf (Draft)</option>
                <option value="closed">Ditutup (Closed)</option>
              </select>
            </div>
          </div>

          {/* Deskripsi & Kualifikasi */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Deskripsi Pekerjaan *</Label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={3}
              placeholder="Ringkasan tugas, tanggung jawab, dan dampak posisi ini..."
              className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-ring resize-none"
              required
            />
            {errors.description && <p className="text-[11px] text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Persyaratan &amp; Kualifikasi</Label>
            <textarea
              value={data.requirements}
              onChange={(e) => setData("requirements", e.target.value)}
              rows={3}
              placeholder="• Minimal 3 tahun pengalaman kerja&#10;• Menguasai Laravel &amp; React&#10;• Kemampuan komunikasi baik"
              className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-ring resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Manfaat &amp; Fasilitas</Label>
            <textarea
              value={data.benefits}
              onChange={(e) => setData("benefits", e.target.value)}
              rows={2}
              placeholder="• Asuransi kesehatan &amp; BPJS lengkap&#10;• Voucher makan Crave Canteen harian&#10;• Workstation Apple"
              className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-ring resize-none"
            />
          </div>

          <DialogFooter className="mt-5 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs h-9"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="rounded-xl text-xs h-9 bg-primary text-primary-foreground font-bold"
            >
              {processing ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Terbitkan Lowongan")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

