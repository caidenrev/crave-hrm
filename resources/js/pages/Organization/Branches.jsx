import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  MapPin,
  Plus,
  Navigation,
  Globe,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LocateFixed,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export default function Branches({ branches = [], stats = {} }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "geofence"

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    code: "",
    address: "",
    latitude: "",
    longitude: "",
    radius_meters: 100,
    office_ips: [],
    office_ips_raw: "",
    is_active: true,
  });

  const openCreateModal = () => {
    setEditingBranch(null);
    reset();
    setData({
      name: "",
      code: "",
      address: "",
      latitude: "",
      longitude: "",
      radius_meters: 100,
      office_ips: [],
      office_ips_raw: "",
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBranch(b);
    const ips = Array.isArray(b.office_ips) ? b.office_ips : [];
    setData({
      name: b.name,
      code: b.code || "",
      address: b.address || "",
      latitude: b.latitude !== null ? String(b.latitude) : "",
      longitude: b.longitude !== null ? String(b.longitude) : "",
      radius_meters: b.radius_meters || 100,
      office_ips: ips,
      office_ips_raw: ips.join(", "),
      is_active: Boolean(b.is_active),
    });
    setModalOpen(true);
  };

  const handleDetectCurrentGps = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi Geolocation.");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        setData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(7),
          longitude: pos.coords.longitude.toFixed(7),
        }));
      },
      (err) => {
        setDetectingGps(false);
        alert(`Gagal mendeteksi lokasi GPS: ${err.message}. Pastikan izin akses lokasi browser telah diaktifkan.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedIps = data.office_ips_raw
      ? data.office_ips_raw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...data,
      office_ips: parsedIps,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      radius_meters: parseInt(data.radius_meters, 10) || 100,
    };

    if (editingBranch) {
      router.put(`/organization/branches/${editingBranch.id}`, payload, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      router.post("/organization/branches", payload, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const [deletingBranch, setDeletingBranch] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const confirmDelete = (branch) => {
    setDeletingBranch(branch);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!deletingBranch) return;
    router.delete(`/organization/branches/${deletingBranch.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeletingBranch(null);
      },
    });
  };

  const handleToggleActive = (id) => {
    router.patch(`/organization/branches/${id}/toggle-active`, {}, { preserveScroll: true });
  };

  // 1. KPI Top Metrics
  const topStats = [
    {
      label: "Total Kantor Cabang",
      value: String(stats.total ?? branches.length),
      delta: "Aktif",
      up: true,
      icon: Building2,
    },
    {
      label: "Cabang Operasional",
      value: String(stats.active ?? branches.filter((b) => b.is_active).length),
      delta: "Buka",
      up: true,
      icon: CheckCircle2,
    },
    {
      label: "Geofence Siap Pakai",
      value: String(stats.with_geofence ?? branches.filter((b) => b.latitude && b.longitude).length),
      delta: "GPS Valid",
      up: true,
      icon: Radio,
    },
    {
      label: "Cabang Nonaktif",
      value: String(stats.inactive ?? branches.filter((b) => !b.is_active).length),
      delta: (stats.inactive ?? 0) === 0 ? "Nihil" : `${stats.inactive} Cabang`,
      up: (stats.inactive ?? 0) === 0,
      icon: AlertCircle,
    },
  ];

  // 2. Chart Analytics: Employee Distribution per Branch
  const branchEmployeeData = useMemo(() => {
    if (branches.length === 0) return [];
    return branches.slice(0, 6).map((b) => ({
      name: b.code || b.name.split(" ")[0],
      fullName: b.name,
      karyawan: b.employees_count ?? 0,
    }));
  }, [branches]);

  // 3. Chart Analytics: Readiness Composition (Pie)
  const readinessShare = useMemo(() => {
    const total = branches.length || 1;
    const withGps = stats.with_geofence ?? branches.filter((b) => b.latitude && b.longitude).length;
    const activeNoGps = (stats.active ?? branches.filter((b) => b.is_active).length) - withGps;
    const inactive = stats.inactive ?? branches.filter((b) => !b.is_active).length;

    return [
      {
        name: "Geofence GPS Valid",
        count: withGps,
        value: Math.round((withGps / total) * 100),
      },
      {
        name: "Fleksibel / IP Jaringan",
        count: Math.max(0, activeNoGps),
        value: Math.round((Math.max(0, activeNoGps) / total) * 100),
      },
      {
        name: "Cabang Nonaktif",
        count: inactive,
        value: Math.round((inactive / total) * 100),
      },
    ].filter((item) => item.count > 0);
  }, [branches, stats]);

  // 4. Filtered Branches List
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchSearch =
        searchQuery === "" ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.code && b.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === "active") matchStatus = Boolean(b.is_active);
      else if (statusFilter === "inactive") matchStatus = !b.is_active;
      else if (statusFilter === "geofence") matchStatus = b.latitude !== null && b.longitude !== null;

      return matchSearch && matchStatus;
    });
  }, [branches, searchQuery, statusFilter]);

  return (
    <AuthenticatedLayout
      title="Cabang & Geofence"
      subtitle="Konfigurasi lokasi kantor cabang, batas koordinat GPS geofence, dan whitelist IP untuk presensi"
      actions={
        <Button
          onClick={openCreateModal}
          className="rounded-xl font-semibold shadow-xs text-xs sm:text-sm"
        >
          <Plus className="mr-1.5 size-4" />
          <span className="hidden sm:inline">Tambah Cabang Baru</span>
          <span className="sm:hidden">Tambah Cabang</span>
        </Button>
      }
    >
      <Head title="Cabang & Parameter Geofence" />

      <div className="space-y-4">
        {/* 1. TOP METRICS CARDS (Dashboard-Consistent Crave POS Look) */}
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
                    (i === 0
                      ? "text-white"
                      : s.up
                      ? "text-success"
                      : "text-destructive")
                  }
                >
                  <ArrowUpRight className="size-4" />
                  {s.delta}
                </span>
              </div>
              <div className="mt-4">
                <p
                  className={
                    "text-xl font-black tracking-tight sm:text-2xl " +
                    (i === 0 ? "text-white" : "text-foreground")
                  }
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

        {/* 2. CHARTS SECTION (Crave POS 2:1 Ratio Analytics) */}
        {branches.length > 0 && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Left Chart: Kapasitas Karyawan per Cabang */}
            <div className="card-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-extrabold">Distribusi Staf per Cabang</p>
                  <p className="text-[11px] text-muted-foreground">
                    Penempatan total karyawan di tiap unit operasional
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  Realtime
                </Badge>
              </div>

              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchEmployeeData}>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={28}
                    />
                    <Tooltip
                      formatter={(v) => [`${v} Karyawan`, "Penempatan"]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                      }}
                    />
                    <Bar
                      dataKey="karyawan"
                      fill="var(--color-chart-1)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Chart: Komposisi Kesiapan Geofence */}
            <div className="card-soft p-4">
              <p className="text-sm font-extrabold">Kesiapan Geofence Presensi</p>
              <p className="text-[11px] text-muted-foreground">
                Persentase cabang dengan validasi GPS aktif
              </p>

              <div className="mt-2 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={readinessShare.length > 0 ? readinessShare : [{ name: "Belum Diatur", value: 100 }]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={44}
                      outerRadius={68}
                      paddingAngle={3}
                    >
                      {(readinessShare.length > 0 ? readinessShare : [{ name: "Belum Diatur", value: 100 }]).map((_, i) => (
                        <Cell
                          key={i}
                          fill={chartColors[i % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `${v}%`}
                      contentStyle={{ borderRadius: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 mt-2">
                {readinessShare.map((c, i) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: chartColors[i % 4] }}
                      />
                      {c.name}
                    </span>
                    <span className="font-bold text-foreground">
                      {c.value}% ({c.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. TOOLBAR: Search, Status Filter & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
              {[
                { key: "all", label: "Semua" },
                { key: "active", label: "Aktif" },
                { key: "geofence", label: "GPS Valid" },
                { key: "inactive", label: "Nonaktif" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === tab.key
                      ? "bg-card text-foreground font-bold shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari cabang, kode, atau alamat..."
                className="pl-8 rounded-xl border-border/50 bg-background/50 text-xs h-8"
              />
            </div>

            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* 4. BRANCHES CONTENT: Card View vs Table View */}
        {filteredBranches.length === 0 ? (
          <div className="card-soft p-12 text-center border-dashed">
            <div className="mx-auto size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Building2 className="size-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              {branches.length === 0 ? "Belum ada kantor cabang terdaftar" : "Tidak ada cabang yang sesuai"}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {branches.length === 0
                ? "Daftarkan kantor cabang utama atau cabang operasional beserta batas radius geofence untuk sistem presensi cerdas."
                : "Coba ubah kata kunci pencarian atau ganti filter status di toolbar atas."}
            </p>
            {branches.length === 0 && (
              <Button
                onClick={openCreateModal}
                className="mt-4 rounded-xl font-semibold"
              >
                <Plus className="mr-1.5 size-4" />
                Tambah Cabang Sekarang
              </Button>
            )}
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((b) => {
              const hasGps = b.latitude !== null && b.longitude !== null;
              const ips = Array.isArray(b.office_ips) ? b.office_ips : [];

              return (
                <div
                  key={b.id}
                  className={`card-soft p-5 flex flex-col justify-between transition-all ${
                    b.is_active
                      ? "hover:shadow-md"
                      : "opacity-75 bg-card/60"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-black tracking-tight text-foreground leading-snug truncate">
                              {b.name}
                            </h4>
                            {b.code && (
                              <Badge variant="outline" className="text-[10px] font-mono font-bold rounded-md">
                                {b.code}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 line-clamp-2 leading-relaxed">
                            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                            <span>{b.address || "Alamat kantor belum ditentukan"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={Boolean(b.is_active)}
                          onCheckedChange={() => handleToggleActive(b.id)}
                          title={b.is_active ? "Nonaktifkan Cabang" : "Aktifkan Cabang"}
                        />
                      </div>
                    </div>

                    {/* Geofence Parameters Block */}
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs space-y-2 my-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <Radio className="size-3.5 text-primary" />
                          Radius Geofence:
                        </span>
                        <Badge variant="secondary" className="rounded-full text-[10px] font-bold">
                          {b.radius_meters || 100} meter
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/40">
                        <span>Koordinat GPS:</span>
                        {hasGps ? (
                          <a
                            href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                            title="Buka di Google Maps"
                          >
                            <span>{Number(b.latitude).toFixed(4)}, {Number(b.longitude).toFixed(4)}</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-destructive italic text-[11px]">Belum diatur</span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <span className="text-muted-foreground block mb-1 font-medium">IP Whitelist Kantor:</span>
                        {ips.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {ips.map((ip, i) => (
                              <span
                                key={i}
                                className="font-mono text-[10px] bg-card border border-border/60 px-2 py-0.5 rounded-md text-foreground font-semibold"
                              >
                                {ip}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            Semua IP diizinkan (fleksibel)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs mt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Users className="size-3.5 text-primary" />
                      <span>{b.employees_count ?? 0} Karyawan</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(b)}
                        className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                      >
                        <Edit2 className="size-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(b)}
                        className="h-7 rounded-lg px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Hapus Cabang"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-soft overflow-hidden p-0 border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-extrabold text-foreground">Nama & Kode Cabang</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground">Alamat Kantor</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground">Radius</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground">Koordinat</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground">Karyawan</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground text-center">Status</TableHead>
                  <TableHead className="text-xs font-extrabold text-foreground text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((b) => {
                  const hasGps = b.latitude !== null && b.longitude !== null;
                  return (
                    <TableRow key={b.id} className="hover:bg-muted/30">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Building2 className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-foreground">{b.name}</p>
                            {b.code && (
                              <span className="text-[10px] font-mono text-muted-foreground">{b.code}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate py-3">
                        {b.address || "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          {b.radius_meters || 100}m
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        {hasGps ? (
                          <a
                            href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{Number(b.latitude).toFixed(3)}, {Number(b.longitude).toFixed(3)}</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-destructive italic text-[11px]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-semibold py-3">
                        {b.employees_count ?? 0} orang
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Switch
                          checked={Boolean(b.is_active)}
                          onCheckedChange={() => handleToggleActive(b.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(b)}
                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(b)}
                            className="size-7 rounded-lg text-muted-foreground hover:text-destructive"
                            title="Hapus"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* MODAL DIALOG: TAMBAH / EDIT KANTOR CABANG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-xl p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-black tracking-tight">
              {editingBranch ? "Edit Kantor Cabang" : "Tambah Cabang Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tentukan koordinat posisi GPS dan batas radius presensi untuk verifikasi check-in staf di lokasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Nama Cabang / Unit <span className="text-destructive">*</span>
                </label>
                <Input
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Contoh: Kantor Pusat Crave HQ"
                  className="rounded-xl"
                  required
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Kode Cabang
                </label>
                <Input
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                  placeholder="HQ-01"
                  className="rounded-xl uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Alamat Fisik Kantor
              </label>
              <Textarea
                rows={2}
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan..."
                className="rounded-xl resize-none text-xs"
              />
            </div>

            {/* Geofence GPS Coordinates Block */}
            <div className="rounded-xl border border-border/70 bg-muted/40 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Navigation className="size-3.5 text-primary" />
                  Parameter Geofence Presensi GPS
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectCurrentGps}
                  disabled={detectingGps}
                  className="h-7 text-xs rounded-lg gap-1 border-border/70 bg-card font-semibold"
                >
                  <LocateFixed className="size-3" />
                  {detectingGps ? "Mendeteksi..." : "Deteksi Lokasi Saya"}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Latitude (-90..90)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={data.latitude}
                    onChange={(e) => setData("latitude", e.target.value)}
                    placeholder="-6.2088"
                    className="rounded-xl bg-card font-mono text-xs h-8"
                  />
                  {errors.latitude && <p className="text-xs text-destructive mt-1">{errors.latitude}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Longitude (-180..180)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={data.longitude}
                    onChange={(e) => setData("longitude", e.target.value)}
                    placeholder="106.8456"
                    className="rounded-xl bg-card font-mono text-xs h-8"
                  />
                  {errors.longitude && <p className="text-xs text-destructive mt-1">{errors.longitude}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Radius (Meter)
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="5000"
                    value={data.radius_meters}
                    onChange={(e) => setData("radius_meters", e.target.value)}
                    className="rounded-xl bg-card font-bold text-xs h-8"
                  />
                  {errors.radius_meters && <p className="text-xs text-destructive mt-1">{errors.radius_meters}</p>}
                </div>
              </div>
            </div>

            {/* IP Whitelist & Status Operasional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block flex items-center justify-between">
                  <span>Whitelist IP Publik (Opsional)</span>
                </label>
                <Input
                  value={data.office_ips_raw}
                  onChange={(e) => setData("office_ips_raw", e.target.value)}
                  placeholder="Contoh: 114.122.10.45, 180.252.90.12"
                  className="rounded-xl font-mono text-xs h-9"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Pisahkan koma jika &gt; 1 IP jaringan kantor.
                </p>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/30 sm:mt-0">
                <div>
                  <p className="text-xs font-semibold text-foreground">Status Cabang</p>
                  <p className="text-[10px] text-muted-foreground">Izinkan penempatan staf</p>
                </div>
                <Switch
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData("is_active", checked)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-xl font-semibold"
              >
                {processing ? "Menyimpan..." : editingBranch ? "Simpan Perubahan" : "Daftarkan Cabang"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG KONFIRMASI HAPUS */}
      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus Kantor Cabang?"
        description={`Apakah Anda yakin ingin menghapus data cabang "${deletingBranch?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={executeDelete}
      />
    </AuthenticatedLayout>
  );
}
