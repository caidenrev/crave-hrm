import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  FileSpreadsheet,
  Store,
  DollarSign,
  UtensilsCrossed,
  Plus,
  Search,
  Calendar,
  Edit,
  PieChart as PieIcon,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah, formatTanggalId } from "@/lib/formatters";

export default function Reports({
  month = "2026-11",
  kpis,
  vendors = [],
  dailyTrend = [],
  vendorComposition = [],
  recentTransactions = [],
}) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState("all");

  // Vendor Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    code: "",
    name: "",
    pic_name: "",
    pic_phone: "",
    location: "",
    price_per_meal: 25000,
    status: "active",
    notes: "",
  });

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val);
    router.get("/canteen/settlement", { month: val }, { preserveState: true });
  };

  const openAddVendorModal = () => {
    setEditingVendor(null);
    setVendorForm({
      code: `VND-0${vendors.length + 1}`,
      name: "",
      pic_name: "",
      pic_phone: "",
      location: "",
      price_per_meal: 25000,
      status: "active",
      notes: "",
    });
    setIsVendorModalOpen(true);
  };

  const openEditVendorModal = (vendor) => {
    setEditingVendor(vendor);
    setVendorForm({
      code: vendor.code,
      name: vendor.name,
      pic_name: vendor.pic_name,
      pic_phone: vendor.pic_phone || "",
      location: vendor.location,
      price_per_meal: vendor.price_per_meal,
      status: vendor.status,
      notes: vendor.notes || "",
    });
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    if (editingVendor) {
      router.put(`/canteen/vendors/${editingVendor.id}`, vendorForm, {
        onSuccess: () => setIsVendorModalOpen(false),
      });
    } else {
      router.post("/canteen/vendors", vendorForm, {
        onSuccess: () => setIsVendorModalOpen(false),
      });
    }
  };

  // Filtered transactions
  const filteredTransactions = recentTransactions.filter((tx) => {
    const matchesSearch =
      tx.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.voucher_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.vendor_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVendor =
      selectedVendorFilter === "all" || tx.vendor_name === selectedVendorFilter;

    return matchesSearch && matchesVendor;
  });

  // 4 Top KPI Cards - 100% Matching Dashboard.jsx
  const kpiStats = [
    {
      label: "Total Porsi Terpakai",
      value: `${kpis?.total_meals ?? 0} Porsi`,
      delta: selectedMonth,
      up: true,
      icon: UtensilsCrossed,
    },
    {
      label: "Total Tagihan Katering",
      value: formatRupiah(kpis?.total_expenditure ?? 0),
      delta: "Tagihan Berjalan",
      up: true,
      icon: DollarSign,
    },
    {
      label: "Mitra Vendor Aktif",
      value: `${kpis?.active_vendors_count ?? 0} Booth`,
      delta: "Katering & Kantin",
      up: true,
      icon: Store,
    },
    {
      label: "Tingkat Pemanfaatan",
      value: `${kpis?.utilization_rate ?? 0}%`,
      delta: "Staf WFO Hadir",
      up: true,
      icon: Percent,
    },
  ];

  return (
    <AuthenticatedLayout
      title="Rekonsiliasi Vendor"
      subtitle="Rekapitulasi bulanan porsi makan & tagihan invoice katering mitra"
    >
      <Head title="Rekonsiliasi Vendor - Crave Canteen" />

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* 1. TOP METRICS CARDS (100% PARITY WITH DASHBOARD.JSX) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {kpiStats.map((s, i) => (
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
                  {s.up ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
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

        {/* TOOLBAR CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border border-border/50 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs">
              <Calendar className="size-4 text-primary" />
              <span className="text-muted-foreground">Periode:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="bg-transparent border-none text-foreground font-bold focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={openAddVendorModal}
              className="h-9 px-4 rounded-xl font-extrabold text-xs gap-2"
            >
              <Plus className="size-4" />
              Tambah Mitra Vendor
            </Button>
          </div>
        </div>

        {/* 2:1 ANALYTICS SECTION (MATCHING DASHBOARD.JSX) */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Trend AreaChart (2fr) */}
          <div className="card-soft p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-extrabold text-foreground">
                  Tren Konsumsi Porsi Harian
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Penebusan voucher makan harian sepanjang bulan berjalan
                </p>
              </div>
              <Badge variant="outline" className="text-xs rounded-full font-semibold">
                Bulan Ini
              </Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillCanteenTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                    }}
                    formatter={(val) => [`${val} Porsi`, "Total Makan"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#fillCanteenTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composition Donut/PieChart (1fr) */}
          <div className="card-soft p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-extrabold text-foreground">
                  Pangsa Mitra Kantin
                </p>
                <PieIcon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground mb-4">
                Distribusi porsi makan per vendor
              </p>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vendorComposition}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="porsi"
                    >
                      {vendorComposition.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`var(--color-chart-${(i % 5) + 1})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                      }}
                      formatter={(val, name, item) => [
                        `${val} Porsi (${item.payload.percentage}%)`,
                        item.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 pt-3 border-t border-border/50">
              {vendorComposition.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: `var(--color-chart-${(idx % 5) + 1})` }}
                    />
                    <span className="text-muted-foreground truncate font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-foreground shrink-0">
                    {item.porsi} porsi ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VENDOR SETTLEMENT SUMMARY TABLE */}
        <div className="card-soft overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Rekap Tagihan Mitra Katering ({selectedMonth})
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Rincian volume konsumsi dan total invoice per merchant
              </p>
            </div>
            <Badge variant="outline" className="rounded-full text-xs font-semibold">
              {vendors.length} Vendor
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/50">
                <tr>
                  <th className="py-3 px-4">Kode & Vendor</th>
                  <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                  <th className="py-3 px-4">Lokasi Booth</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                  <th className="py-3 px-4 text-center">Volume Porsi</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                          {vendor.code}
                        </span>
                        <span>{vendor.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      <div>{vendor.pic_name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {vendor.pic_phone || "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {vendor.location}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-foreground">
                      {formatRupiah(vendor.price_per_meal)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-foreground">
                      {vendor.total_porsi} Porsi
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-success">
                      {formatRupiah(vendor.total_tagihan)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant="outline"
                        className={
                          vendor.status === "active"
                            ? "bg-success/10 text-success border-success/30 font-semibold"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {vendor.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditVendorModal(vendor)}
                        className="h-8 px-2.5 rounded-xl text-xs gap-1 font-bold text-primary hover:bg-primary/10"
                      >
                        <Edit className="size-3.5" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILED TRANSACTION LOG TABLE */}
        <div className="card-soft overflow-hidden">
          <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Rincian Transaksi Penebusan ({filteredTransactions.length})
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Log audit individual per voucher yang berhasil diverifikasi
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari karyawan / kode..."
                  className="h-8 pl-8 rounded-xl text-xs"
                />
              </div>

              {/* Vendor Filter */}
              <div className="w-44 shrink-0 min-w-0">
                <Select
                  value={selectedVendorFilter}
                  onValueChange={setSelectedVendorFilter}
                >
                  <SelectTrigger className="w-full min-w-0 h-8 rounded-xl text-xs font-semibold overflow-hidden">
                    <SelectValue placeholder="Semua Vendor" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs max-w-xs">
                    <SelectItem value="all">Semua Vendor</SelectItem>
                    {vendors.map((v) => (
                      <SelectItem key={v.id} value={v.name}>
                        <span className="truncate">{v.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/50 sticky top-0 backdrop-blur">
                <tr>
                  <th className="py-3 px-4">Waktu Scan</th>
                  <th className="py-3 px-4">Kode Voucher</th>
                  <th className="py-3 px-4">Karyawan</th>
                  <th className="py-3 px-4">Departemen</th>
                  <th className="py-3 px-4">Vendor Merchant</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Tidak ada transaksi yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {tx.redeemed_at || tx.meal_date}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {tx.voucher_code}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-foreground">
                        <div>{tx.employee.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono font-normal">
                          NIK: {tx.employee.nik}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {tx.employee.department}
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {tx.vendor_name}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-success">
                        {formatRupiah(tx.nominal_value)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT VENDOR */}
      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl sm:rounded-3xl">
          <form onSubmit={handleSaveVendor}>
            <DialogHeader>
              <DialogTitle className="text-base font-black">
                {editingVendor ? "Edit Mitra Vendor" : "Tambah Mitra Vendor Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Konfigurasi merchant kantin mitra untuk penagihan invoice katering
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Kode Vendor</label>
                  <Input
                    required
                    value={vendorForm.code}
                    onChange={(e) => setVendorForm({ ...vendorForm, code: e.target.value })}
                    placeholder="VND-01"
                    className="h-9 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Harga per Porsi (Rp)</label>
                  <Input
                    type="number"
                    required
                    value={vendorForm.price_per_meal}
                    onChange={(e) =>
                      setVendorForm({ ...vendorForm, price_per_meal: Number(e.target.value) })
                    }
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Nama Vendor / Katering</label>
                <Input
                  required
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  placeholder="Katering Bu Siti (Prasmanan Nusantara)"
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Nama PIC</label>
                  <Input
                    required
                    value={vendorForm.pic_name}
                    onChange={(e) => setVendorForm({ ...vendorForm, pic_name: e.target.value })}
                    placeholder="Siti Rahayu"
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">No. Telepon / WhatsApp</label>
                  <Input
                    value={vendorForm.pic_phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, pic_phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Lokasi Booth</label>
                <Input
                  required
                  value={vendorForm.location}
                  onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                  placeholder="Lantai 1 Kantin Barat - Booth 01"
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              {editingVendor && (
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Status Operasional</label>
                  <Select
                    value={vendorForm.status}
                    onValueChange={(val) => setVendorForm({ ...vendorForm, status: val })}
                  >
                    <SelectTrigger className="h-9 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs">
                      <SelectItem value="active">Aktif (Melayani Voucher)</SelectItem>
                      <SelectItem value="inactive">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVendorModalOpen(false)}
                className="h-9 rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-9 rounded-xl font-bold text-xs"
              >
                Simpan Vendor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
