import React, { useState, useMemo } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  ChevronRight,
  MapPin,
  Mail,
  Layers,
  Sparkles,
  ArrowUpRight,
  Edit2,
  Plus,
  Search,
  Filter,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrgChart({
  company = {},
  departments = [],
  branches = [],
  allEmployees = [],
  allDesignations = [],
  selectedBranchId = "all",
  stats = {},
}) {
  const [expandedDepts, setExpandedDepts] = useState(
    departments.reduce((acc, d) => ({ ...acc, [d.id]: true }), {})
  );
  const [currentBranch, setCurrentBranch] = useState(selectedBranchId || "all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State: Edit Placement
  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    data: placementData,
    setData: setPlacementData,
    patch: patchPlacement,
    processing: placementProcessing,
    errors: placementErrors,
    reset: resetPlacement,
  } = useForm({
    department_id: "",
    designation_id: "",
    branch_id: "",
  });

  // Modal State: Create Department
  const [createDeptModalOpen, setCreateDeptModalOpen] = useState(false);
  const {
    data: deptData,
    setData: setDeptData,
    post: postDept,
    processing: deptProcessing,
    errors: deptErrors,
    reset: resetDept,
  } = useForm({
    name: "",
    code: "",
    description: "",
  });

  const toggleDept = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const expandAll = () => {
    setExpandedDepts(departments.reduce((acc, d) => ({ ...acc, [d.id]: true }), {}));
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  const handleBranchChange = (branchId) => {
    setCurrentBranch(branchId);
    router.get(
      "/organization/chart",
      { branch_id: branchId },
      { preserveState: true, replace: true }
    );
  };

  const openPlacementModal = (emp) => {
    setEditingEmployee(emp);
    setPlacementData({
      department_id: emp.department_id ? String(emp.department_id) : "",
      designation_id: emp.designation_id ? String(emp.designation_id) : "",
      branch_id: emp.branch_id ? String(emp.branch_id) : "",
    });
    setPlacementModalOpen(true);
  };

  const handlePlacementSubmit = (e) => {
    e.preventDefault();
    if (!editingEmployee) return;

    patchPlacement(`/organization/chart/placement/${editingEmployee.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setPlacementModalOpen(false);
        resetPlacement();
        setEditingEmployee(null);
      },
    });
  };

  const handleDeptSubmit = (e) => {
    e.preventDefault();
    postDept("/organization/chart/departments", {
      preserveScroll: true,
      onSuccess: () => {
        setCreateDeptModalOpen(false);
        resetDept();
      },
    });
  };

  // Filtered designations based on selected department in placement modal
  const filteredDesignations = useMemo(() => {
    if (!placementData.department_id) return allDesignations;
    return allDesignations.filter(
      (d) => String(d.department_id) === String(placementData.department_id)
    );
  }, [allDesignations, placementData.department_id]);

  // Active branch name label
  const selectedBranchName = useMemo(() => {
    if (currentBranch === "all") return "Seluruh Kantor Cabang";
    const found = branches.find((b) => String(b.id) === String(currentBranch));
    return found ? found.name : "Kantor Cabang";
  }, [currentBranch, branches]);

  // Top Metrics
  const topStats = [
    {
      label: "Entitas Perusahaan",
      value: company.name || "Perusahaan Aktif",
      delta: company.is_holding ? "Holding" : "Subsidiary",
      up: true,
      icon: Building2,
      isHero: true,
    },
    {
      label: "Departemen / Divisi",
      value: String(stats.total_departments ?? departments.length),
      delta: "Aktif",
      up: true,
      icon: Layers,
    },
    {
      label: "Struktur Jabatan",
      value: String(stats.total_designations ?? allDesignations.length),
      delta: "Level",
      up: true,
      icon: Briefcase,
    },
    {
      label: "Karyawan Terpenempatan",
      value: String(stats.total_employees ?? 0),
      delta: currentBranch === "all" ? "Seluruh Tim" : "Cabang Ini",
      up: true,
      icon: Users,
    },
  ];

  return (
    <AuthenticatedLayout
      title="Struktur Organisasi"
      subtitle={`Bagan hierarki departemen, divisi, dan susunan talenta di ${selectedBranchName}`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="rounded-xl text-xs font-semibold"
          >
            Buka Semua
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="rounded-xl text-xs font-semibold"
          >
            Tutup Semua
          </Button>
          <Button
            onClick={() => setCreateDeptModalOpen(true)}
            className="rounded-xl font-semibold shadow-xs text-xs sm:text-sm"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Tambah Departemen</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      }
    >
      <Head title={`Struktur Organisasi — ${selectedBranchName}`} />

      <div className="space-y-4">
        {/* 1. TOP METRICS CARDS (Crave POS Dashboard Signature Look) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {topStats.map((s, i) => (
            <div
              key={s.label}
              className={
                "p-3 flex flex-col justify-between rounded-2xl sm:rounded-3xl sm:p-4 " +
                (i === 0 || i === 3 ? "col-span-2 md:col-span-1 " : "") +
                (i === 0
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary"
                  : "bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className={i === 0 ? "text-white" : "text-foreground"}>
                  <s.icon className="size-5 sm:size-6" />
                </span>
                <span
                  className={
                    "flex items-center gap-1 text-[12px] font-bold " +
                    (i === 0 ? "text-white" : "text-success")
                  }
                >
                  <ArrowUpRight className="size-4" />
                  {s.delta}
                </span>
              </div>
              <div className="mt-4">
                <p
                  className={
                    "text-xl font-black tracking-tight sm:text-2xl truncate " +
                    (i === 0 ? "text-white" : "text-foreground")
                  }
                  title={s.value}
                >
                  {s.value}
                </p>
                <p
                  className={
                    "text-[13px] font-medium mt-0.5 " +
                    (i === 0
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground")
                  }
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. BRANCH FILTER & SEARCH TOOLBAR (Setiap Cabang Beda-Beda) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
          {/* Branch Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
              <button
                type="button"
                onClick={() => handleBranchChange("all")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  currentBranch === "all"
                    ? "bg-card text-foreground font-bold shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Cabang
              </button>
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleBranchChange(String(b.id))}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                    String(currentBranch) === String(b.id)
                      ? "bg-card text-foreground font-bold shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search inside Hierarchy */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari talenta dalam struktur..."
              className="pl-8 rounded-xl border-border/50 bg-background/50 text-xs h-8"
            />
          </div>
        </div>

        {/* 3. HIERARCHY TREE VISUALIZATION */}
        <div className="space-y-6 pt-2">
          {/* Root Company Node */}
          <div className="flex flex-col items-center">
            <div className="card-soft p-5 border-2 border-primary/40 bg-card text-center max-w-lg w-full shadow-md">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="size-5 text-primary" />
                <h2 className="text-lg font-black tracking-tight text-foreground">
                  {company.name || "Crave Group Holding"}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {company.is_holding ? "Holding Company & Ekosistem Utama" : "Entitas Anak Perusahaan"} · {selectedBranchName}
              </p>
              {company.tax_id && (
                <Badge variant="outline" className="mt-2 text-[10px] rounded-md font-mono">
                  NPWP: {company.tax_id}
                </Badge>
              )}
            </div>

            {/* Connecting Central Stem */}
            <div className="h-6 w-0.5 bg-border/80" />
          </div>

          {/* Departments Tier */}
          {departments.length === 0 ? (
            <div className="card-soft p-12 text-center border-dashed max-w-lg mx-auto">
              <Layers className="mx-auto size-8 text-muted-foreground mb-2" />
              <h4 className="text-base font-bold text-foreground">Belum ada departemen</h4>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Belum ada departemen atau divisi yang terdaftar pada perusahaan ini.
              </p>
              <Button
                onClick={() => setCreateDeptModalOpen(true)}
                className="rounded-xl font-semibold"
              >
                <Plus className="mr-1.5 size-4" />
                Tambah Departemen Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {departments.map((dept) => {
                const isExpanded = Boolean(expandedDepts[dept.id]);
                const rawEmployees = dept.employees || [];

                // Filter by search query if any
                const employees = rawEmployees.filter((emp) => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    emp.nama_lengkap.toLowerCase().includes(q) ||
                    (emp.designation?.title && emp.designation.title.toLowerCase().includes(q)) ||
                    (emp.email && emp.email.toLowerCase().includes(q))
                  );
                });

                return (
                  <div
                    key={dept.id}
                    className="card-soft overflow-hidden border border-border/80 bg-card p-0 transition-all"
                  >
                    {/* Department Node Header */}
                    <div
                      onClick={() => toggleDept(dept.id)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="size-8 rounded-lg bg-card border border-border/70 flex items-center justify-center text-foreground hover:bg-muted"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black tracking-tight text-foreground">
                              {dept.name}
                            </h3>
                            {dept.code && (
                              <Badge variant="outline" className="text-[10px] font-bold rounded-md">
                                {dept.code}
                              </Badge>
                            )}
                          </div>
                          {dept.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {dept.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full text-[11px] font-bold">
                          {employees.length} Talenta
                        </Badge>
                      </div>
                    </div>

                    {/* Employees Card Grid within Department */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-background/50">
                        {employees.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-xs text-muted-foreground italic">
                              {rawEmployees.length === 0
                                ? "Belum ada talenta yang ditempatkan pada departemen ini untuk cabang yang dipilih."
                                : "Tidak ada talenta yang cocok dengan kata kunci pencarian."}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {employees.map((emp) => {
                              const initials = emp.nama_lengkap
                                ? emp.nama_lengkap
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "EM";

                              return (
                                <div
                                  key={emp.id}
                                  className="group card-soft p-3.5 flex items-start justify-between gap-3 bg-card hover:shadow-xs transition-all border border-border/70"
                                >
                                  <div className="flex items-start gap-3 min-w-0">
                                    <Avatar className="size-10 rounded-xl border border-border/60 shrink-0">
                                      <AvatarImage src={emp.avatar_url} />
                                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                                        {initials}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-foreground truncate">
                                        {emp.nama_lengkap}
                                      </p>
                                      <p className="text-[11px] font-semibold text-primary truncate mt-0.5">
                                        {emp.designation?.title || "Karyawan"}
                                      </p>

                                      <div className="mt-2 space-y-1 text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                                        <div className="flex items-center gap-1.5 truncate">
                                          <MapPin className="size-3 shrink-0 text-muted-foreground" />
                                          <span className="truncate">
                                            {emp.branch?.name || "Pusat / Tanpa Cabang"}
                                          </span>
                                        </div>
                                        {emp.email && (
                                          <div className="flex items-center gap-1.5 truncate">
                                            <Mail className="size-3 shrink-0 text-muted-foreground" />
                                            <span className="truncate">{emp.email}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Edit Placement Action Button */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openPlacementModal(emp)}
                                    className="h-7 rounded-lg px-2 text-xs font-semibold gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                                    title="Ubah Penempatan & Jabatan"
                                  >
                                    <Edit2 className="size-3" />
                                    <span>Edit</span>
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DIALOG: EDIT PENEMPATAN KARYAWAN */}
      <Dialog open={placementModalOpen} onOpenChange={setPlacementModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-black tracking-tight">
              Ubah Penempatan Organisasi
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pindahkan karyawan ke departemen, jabatan, atau cabang kantor yang sesuai.
            </DialogDescription>
          </DialogHeader>

          {editingEmployee && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 my-1">
              <Avatar className="size-9 rounded-xl border border-border/60 shrink-0">
                <AvatarImage src={editingEmployee.avatar_url} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                  {editingEmployee.nama_lengkap
                    ? editingEmployee.nama_lengkap.substring(0, 2).toUpperCase()
                    : "EM"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {editingEmployee.nama_lengkap}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  NIK: {editingEmployee.nik || "-"}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handlePlacementSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Departemen / Divisi <span className="text-destructive">*</span>
              </label>
              <select
                value={placementData.department_id}
                onChange={(e) => setPlacementData("department_id", e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Pilih Departemen...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.code ? `(${d.code})` : ""}
                  </option>
                ))}
              </select>
              {placementErrors.department_id && (
                <p className="text-xs text-destructive mt-1">{placementErrors.department_id}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Jabatan / Posisi <span className="text-destructive">*</span>
              </label>
              <select
                value={placementData.designation_id}
                onChange={(e) => setPlacementData("designation_id", e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Pilih Posisi / Jabatan...</option>
                {filteredDesignations.map((desig) => (
                  <option key={desig.id} value={desig.id}>
                    {desig.title} {desig.level ? `· Level ${desig.level}` : ""}
                  </option>
                ))}
              </select>
              {placementErrors.designation_id && (
                <p className="text-xs text-destructive mt-1">{placementErrors.designation_id}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Penempatan Kantor Cabang
              </label>
              <select
                value={placementData.branch_id}
                onChange={(e) => setPlacementData("branch_id", e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Kantor Pusat / Fleksibel (Tanpa Cabang)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.code ? `(${b.code})` : ""}
                  </option>
                ))}
              </select>
              {placementErrors.branch_id && (
                <p className="text-xs text-destructive mt-1">{placementErrors.branch_id}</p>
              )}
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPlacementModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={placementProcessing}
                className="rounded-xl font-semibold"
              >
                {placementProcessing ? "Menyimpan..." : "Simpan Penempatan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL DIALOG: TAMBAH DEPARTEMEN BARU */}
      <Dialog open={createDeptModalOpen} onOpenChange={setCreateDeptModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-black tracking-tight">
              Tambah Departemen Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat unit departemen atau divisi baru dalam struktur organisasi perusahaan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeptSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Nama Departemen <span className="text-destructive">*</span>
              </label>
              <Input
                value={deptData.name}
                onChange={(e) => setDeptData("name", e.target.value)}
                placeholder="Contoh: Digital Marketing & Growth"
                className="rounded-xl text-xs"
                required
              />
              {deptErrors.name && (
                <p className="text-xs text-destructive mt-1">{deptErrors.name}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Kode Departemen
              </label>
              <Input
                value={deptData.code}
                onChange={(e) => setDeptData("code", e.target.value)}
                placeholder="MKT"
                className="rounded-xl uppercase font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Deskripsi / Lingkup Tugas
              </label>
              <Input
                value={deptData.description}
                onChange={(e) => setDeptData("description", e.target.value)}
                placeholder="Deskripsi singkat fungsi departemen..."
                className="rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDeptModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={deptProcessing}
                className="rounded-xl font-semibold"
              >
                {deptProcessing ? "Menyimpan..." : "Simpan Departemen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
