import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatTanggal } from "@/lib/formatters";
import {
  Area,
  AreaChart,
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
  Megaphone,
  Pin,
  PinOff,
  Plus,
  Search,
  AlertTriangle,
  FileText,
  Clock,
  Edit2,
  Trash2,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

const CATEGORY_MAP = {
  general: { label: "Umum", variant: "secondary" },
  policy: { label: "Kebijakan", variant: "outline" },
  urgent: { label: "Penting / Darurat", variant: "destructive" },
  event: { label: "Agenda & Acara", variant: "secondary" },
};

const PRIORITY_MAP = {
  normal: { label: "Biasa", variant: "secondary" },
  high: { label: "Tinggi", variant: "secondary" },
  urgent: { label: "Mendesak", variant: "destructive" },
};

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

export default function Index({ announcements, filters = {}, stats = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [showCharts, setShowCharts] = useState(true);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    title: "",
    content: "",
    category: "general",
    priority: "normal",
    is_pinned: false,
    published_at: new Date().toISOString().split("T")[0],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(
      "/announcements",
      { search, category: selectedCategory },
      { preserveState: true, replace: true }
    );
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    router.get(
      "/announcements",
      { search, category: cat },
      { preserveState: true, replace: true }
    );
  };

  const openCreateModal = () => {
    setEditingItem(null);
    reset();
    setData({
      title: "",
      content: "",
      category: "general",
      priority: "normal",
      is_pinned: false,
      published_at: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setData({
      title: item.title,
      content: item.content,
      category: item.category,
      priority: item.priority,
      is_pinned: Boolean(item.is_pinned),
      published_at: item.published_at || new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      put(`/announcements/${editingItem.id}`, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    } else {
      post("/announcements", {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      });
    }
  };

  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const confirmDelete = (item) => {
    setDeletingItem(item);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!deletingItem) return;
    router.delete(`/announcements/${deletingItem.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeletingItem(null);
      },
    });
  };

  const handleTogglePin = (id) => {
    router.patch(`/announcements/${id}/toggle-pin`, {}, { preserveScroll: true });
  };

  const items = announcements?.data || [];
  const pinnedItems = items.filter((i) => i.is_pinned);
  const regularItems = items.filter((i) => !i.is_pinned);

  // 1. Top Metrics Cards
  const topStats = [
    {
      label: "Total Pengumuman",
      value: String(stats.total ?? items.length),
      delta: "Aktif",
      up: true,
      icon: Megaphone,
    },
    {
      label: "Disematkan (Pinned)",
      value: String(stats.pinned ?? pinnedItems.length),
      delta: "Prioritas",
      up: true,
      icon: Pin,
    },
    {
      label: "Penting & Darurat",
      value: String(stats.urgent ?? 0),
      delta: (stats.urgent ?? 0) > 0 ? `${stats.urgent} Urgent` : "Nihil",
      up: (stats.urgent ?? 0) === 0,
      icon: AlertTriangle,
    },
    {
      label: "Edaran Kebijakan",
      value: String(stats.policy ?? 0),
      delta: "Regulasi",
      up: true,
      icon: FileText,
    },
  ];

  // 2. Chart Analytics: Category Distribution (Donut Pie)
  const categoryShare = useMemo(() => {
    const total = items.length || 1;
    const policyCount = items.filter((i) => i.category === "policy").length;
    const urgentCount = items.filter((i) => i.category === "urgent").length;
    const eventCount = items.filter((i) => i.category === "event").length;
    const generalCount = items.filter((i) => i.category === "general").length;

    return [
      {
        name: "Kebijakan",
        count: policyCount,
        value: Math.round((policyCount / total) * 100),
      },
      {
        name: "Penting / Darurat",
        count: urgentCount,
        value: Math.round((urgentCount / total) * 100),
      },
      {
        name: "Agenda & Acara",
        count: eventCount,
        value: Math.round((eventCount / total) * 100),
      },
      {
        name: "Informasi Umum",
        count: generalCount,
        value: Math.round((generalCount / total) * 100),
      },
    ].filter((c) => c.count > 0);
  }, [items]);

  // 3. Chart Analytics: Recent Publishing Trend (Monthly)
  const monthlyActivity = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return MONTH_SHORT.map((label, idx) => {
      const monthItems = items.filter((item) => {
        const d = new Date(item.published_at || item.created_at);
        return !isNaN(d.getTime()) && d.getMonth() === idx && d.getFullYear() === currentYear;
      });
      return {
        label,
        count: monthItems.length,
      };
    });
  }, [items]);

  return (
    <AuthenticatedLayout
      title="Pengumuman Internal"
      subtitle="Papan informasi resmi, kebijakan operasional, dan edaran manajemen perusahaan"
      actions={
        <Button
          onClick={openCreateModal}
          className="rounded-xl font-semibold shadow-xs text-xs sm:text-sm"
        >
          <Plus className="mr-1.5 size-4" />
          <span className="hidden sm:inline">Buat Pengumuman</span>
          <span className="sm:hidden">Buat</span>
        </Button>
      }
    >
      <Head title="Pengumuman Internal" />

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
        {showCharts && items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Left Chart: Tren Penerbitan Informasi */}
            <div className="card-soft p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-extrabold">Aktivitas Penerbitan Informasi</p>
                  <p className="text-[11px] text-muted-foreground">
                    Distribusi pengumuman dan edaran tahun {new Date().getFullYear()}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  Tahun Berjalan
                </Badge>
              </div>

              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyActivity}>
                    <defs>
                      <linearGradient id="fillAnnouncements" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="label"
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
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Pengumuman"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2.5}
                      fill="url(#fillAnnouncements)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Chart: Komposisi Kategori */}
            <div className="card-soft p-4">
              <p className="text-sm font-extrabold">Komposisi Kategori</p>
              <p className="text-[11px] text-muted-foreground">
                Persentase dari total {items.length} informasi aktif
              </p>

              <div className="mt-2 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryShare.length > 0 ? categoryShare : [{ name: "Umum", value: 100 }]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={44}
                      outerRadius={68}
                      paddingAngle={3}
                    >
                      {(categoryShare.length > 0 ? categoryShare : [{ name: "Umum", value: 100 }]).map((_, i) => (
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
                {categoryShare.map((c, i) => (
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

        {/* 3. TOOLBAR: Categories, Search & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border/40">
              {[
                { key: "all", label: "Semua" },
                { key: "policy", label: "Kebijakan" },
                { key: "urgent", label: "Mendesak" },
                { key: "event", label: "Acara" },
                { key: "general", label: "Umum" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryFilter(cat.key)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                    selectedCategory === cat.key
                      ? "bg-card text-foreground font-bold shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pengumuman..."
                className="pl-8 rounded-xl border-border/50 bg-background/50 text-xs h-8"
              />
            </form>

            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* 4. PINNED ANNOUNCEMENTS SPOTLIGHT */}
        {pinnedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Pin className="size-3.5" />
                <span>Pengumuman Tersemat Penting</span>
              </div>
              <Badge variant="default" className="rounded-full text-[10px] gap-1">
                <Pin className="size-2.5 fill-current" />
                {pinnedItems.length} Pinned
              </Badge>
            </div>

            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedItems.map((item) => (
                  <div
                    key={item.id}
                    className="card-soft p-5 border-2 border-primary/30 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <Badge
                          variant="default"
                          className="rounded-full text-[10px] gap-1 font-bold"
                        >
                          <Pin className="size-2.5 fill-current" />
                          Pinned
                        </Badge>
                        <Badge
                          variant={CATEGORY_MAP[item.category]?.variant || "secondary"}
                          className="rounded-full text-[10px]"
                        >
                          {CATEGORY_MAP[item.category]?.label || item.category}
                        </Badge>
                        <Badge
                          variant={PRIORITY_MAP[item.priority]?.variant || "secondary"}
                          className="rounded-full text-[10px]"
                        >
                          {PRIORITY_MAP[item.priority]?.label || item.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center ml-auto">
                          <Clock className="mr-1 size-3" />
                          {formatTanggal(item.published_at)}
                        </span>
                      </div>

                      <h4
                        onClick={() => openEditModal(item)}
                        className="text-base font-black tracking-tight text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h4>

                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {item.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {item.author?.name ? item.author.name.substring(0, 2).toUpperCase() : "AD"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground truncate max-w-[120px]">
                          {item.author?.name || "Admin HR"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePin(item.id)}
                          className="h-7 rounded-lg px-2 text-xs text-primary hover:bg-primary/10 font-semibold"
                          title="Lepas Sematan"
                        >
                          <PinOff className="size-3.5 mr-1" />
                          Lepas Pin
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                        >
                          <Edit2 className="size-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(item)}
                          className="h-7 rounded-lg px-2 text-xs text-destructive hover:bg-destructive/10"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {pinnedItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3 border border-primary/30 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                        <Pin className="size-4 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span
                            onClick={() => openEditModal(item)}
                            className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                          >
                            {item.title}
                          </span>
                          <Badge
                            variant={CATEGORY_MAP[item.category]?.variant || "secondary"}
                            className="rounded-full text-[10px]"
                          >
                            {CATEGORY_MAP[item.category]?.label || item.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-xl">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground hidden md:inline">
                        {formatTanggal(item.published_at)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => handleTogglePin(item.id)}>
                            <PinOff className="size-3.5 mr-2 text-primary" /> Lepas Sematan
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(item)}>
                            <Edit2 className="size-3.5 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => confirmDelete(item)} className="text-destructive">
                            <Trash2 className="size-3.5 mr-2" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. REGULAR ANNOUNCEMENTS FEED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Daftar Pengumuman Terbaru</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-semibold">
                {regularItems.length}
              </span>
            </h3>
          </div>

          {regularItems.length === 0 && pinnedItems.length === 0 ? (
            <div className="card-soft p-12 text-center border-dashed">
              <div className="mx-auto size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                <Megaphone className="size-6" />
              </div>
              <h4 className="text-base font-bold text-foreground">Belum ada pengumuman</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Tidak ada pengumuman yang sesuai dengan filter pencarian Anda. Klik tombol di bawah untuk membuat pengumuman pertama.
              </p>
              <Button
                onClick={openCreateModal}
                className="mt-4 rounded-xl font-semibold"
              >
                <Plus className="mr-1.5 size-4" />
                Buat Pengumuman Sekarang
              </Button>
            </div>
          ) : viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularItems.map((item) => (
                <div
                  key={item.id}
                  className="card-soft p-5 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <Badge
                        variant={CATEGORY_MAP[item.category]?.variant || "secondary"}
                        className="rounded-full text-[10px]"
                      >
                        {CATEGORY_MAP[item.category]?.label || item.category}
                      </Badge>
                      <Badge
                        variant={PRIORITY_MAP[item.priority]?.variant || "secondary"}
                        className="rounded-full text-[10px]"
                      >
                        {PRIORITY_MAP[item.priority]?.label || item.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto flex items-center">
                        <Clock className="mr-1 size-3" />
                        {formatTanggal(item.published_at)}
                      </span>
                    </div>

                    <h4
                      onClick={() => openEditModal(item)}
                      className="text-base font-bold text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px] bg-muted font-bold text-muted-foreground">
                          {item.author?.name ? item.author.name.substring(0, 2).toUpperCase() : "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[110px] text-foreground font-medium">
                        {item.author?.name || "Admin HR"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePin(item.id)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary"
                        title="Sematkan ke atas"
                      >
                        <Pin className="size-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(item)}
                        className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                      >
                        <Edit2 className="size-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(item)}
                        className="h-7 rounded-lg px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Hapus"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {regularItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          onClick={() => openEditModal(item)}
                          className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                        >
                          {item.title}
                        </span>
                        <Badge
                          variant={CATEGORY_MAP[item.category]?.variant || "secondary"}
                          className="rounded-full text-[10px]"
                        >
                          {CATEGORY_MAP[item.category]?.label || item.category}
                        </Badge>
                        <Badge
                          variant={PRIORITY_MAP[item.priority]?.variant || "secondary"}
                          className="rounded-full text-[10px]"
                        >
                          {PRIORITY_MAP[item.priority]?.label || item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-2xl">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      {formatTanggal(item.published_at)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleTogglePin(item.id)}>
                          <Pin className="size-3.5 mr-2 text-primary" /> Sematkan (Pin)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(item)}>
                          <Edit2 className="size-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => confirmDelete(item)} className="text-destructive">
                          <Trash2 className="size-3.5 mr-2" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DIALOG: BUAT / EDIT PENGUMUMAN */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              {editingItem ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sampaikan informasi penting, kebijakan operasional, atau agenda kegiatan kepada seluruh anggota tim.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Judul Pengumuman <span className="text-destructive">*</span>
              </label>
              <Input
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                placeholder="Contoh: Jadwal Libur Lebaran & Ketentuan Cuti Bersama 2026"
                className="rounded-xl"
                required
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Kategori
                </label>
                <select
                  value={data.category}
                  onChange={(e) => setData("category", e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="general">Umum</option>
                  <option value="policy">Kebijakan</option>
                  <option value="urgent">Penting / Darurat</option>
                  <option value="event">Agenda & Acara</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Tingkat Prioritas
                </label>
                <select
                  value={data.priority}
                  onChange={(e) => setData("priority", e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="normal">Biasa</option>
                  <option value="high">Tinggi</option>
                  <option value="urgent">Mendesak</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Tanggal Terbit
                </label>
                <Input
                  type="date"
                  value={data.published_at}
                  onChange={(e) => setData("published_at", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 sm:mt-5">
                <div>
                  <p className="text-xs font-semibold text-foreground">Sematkan ke Atas (Pin)</p>
                  <p className="text-[11px] text-muted-foreground">Tampilkan di sorotan utama</p>
                </div>
                <Switch
                  checked={data.is_pinned}
                  onCheckedChange={(checked) => setData("is_pinned", checked)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Isi Pengumuman <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={5}
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                placeholder="Tuliskan detail pengumuman secara lengkap dan jelas..."
                className="rounded-xl resize-none"
                required
              />
              {errors.content && <p className="text-xs text-destructive mt-1">{errors.content}</p>}
            </div>

            <DialogFooter className="pt-2">
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
                {processing ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Terbitkan Pengumuman"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG KONFIRMASI HAPUS */}
      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus Pengumuman?"
        description={`Apakah Anda yakin ingin menghapus pengumuman "${deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={executeDelete}
      />
    </AuthenticatedLayout>
  );
}
