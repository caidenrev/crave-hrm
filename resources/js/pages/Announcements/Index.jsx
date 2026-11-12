import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { formatTanggal } from "@/lib/formatters";
import {
  Megaphone,
  Pin,
  PinOff,
  Plus,
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const CATEGORY_MAP = {
  general: { label: "Umum", color: "bg-slate-100 text-slate-700 border-slate-200" },
  policy: { label: "Kebijakan", color: "bg-blue-50 text-blue-700 border-blue-200" },
  urgent: { label: "Penting / Darurat", color: "bg-rose-50 text-rose-700 border-rose-200" },
  event: { label: "Agenda & Acara", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const PRIORITY_MAP = {
  normal: { label: "Biasa", badge: "bg-slate-100 text-slate-600" },
  high: { label: "Tinggi", badge: "bg-amber-100 text-amber-700" },
  urgent: { label: "Mendesak", badge: "bg-rose-100 text-rose-700 font-bold" },
};

export default function Index({ announcements, filters = {}, stats = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState("card");

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

  const handleDelete = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      confirmDelete(item);
    } else {
      router.delete(`/announcements/${id}`, { preserveScroll: true });
    }
  };

  const items = announcements?.data || [];
  const pinnedItems = items.filter((i) => i.is_pinned);
  const regularItems = items.filter((i) => !i.is_pinned);

  return (
    <AuthenticatedLayout
      title="Pengumuman Internal"
      subtitle="Papan informasi resmi, kebijakan operasional, dan edaran manajemen perusahaan"
      actions={
        <Button
          onClick={openCreateModal}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm text-xs sm:text-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Buat Pengumuman</span>
          <span className="sm:hidden">Buat</span>
        </Button>
      }
    >
      <Head title="Pengumuman Internal" />

      {/* 1. TOP METRICS CARDS (Dashboard-Consistent Signature Look) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 mb-6">
        {/* Card 0: Hero Card */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary">
          <div className="flex items-start justify-between gap-2">
            <span className="text-white">
              <Megaphone className="size-5 sm:size-6" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-white">
              <ArrowUpRight className="size-4" />
              Aktif
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-white">
              {stats.total ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-primary-foreground/80">
              Total Pengumuman
            </p>
          </div>
        </div>

        {/* Card 1: Disematkan */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Pin className="size-5 sm:size-6 text-blue-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-blue-600">
              <ArrowUpRight className="size-4" />
              Prioritas
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.pinned ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Disematkan (Pinned)
            </p>
          </div>
        </div>

        {/* Card 2: Penting & Darurat */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <AlertTriangle className="size-5 sm:size-6 text-rose-600" />
            </span>
            <span
              className={
                "flex items-center gap-1 text-[12px] font-bold " +
                ((stats.urgent ?? 0) > 0 ? "text-rose-600" : "text-success")
              }
            >
              {(stats.urgent ?? 0) > 0 ? (
                <>
                  <ArrowUpRight className="size-4" />
                  {stats.urgent} Urgent
                </>
              ) : (
                <>
                  <ArrowUpRight className="size-4" />
                  Nihil
                </>
              )}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.urgent ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Penting & Darurat
            </p>
          </div>
        </div>

        {/* Card 3: Kebijakan & SOP */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <FileText className="size-5 sm:size-6 text-indigo-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-indigo-600">
              <ArrowUpRight className="size-4" />
              Regulasi
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.policy ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Edaran Kebijakan
            </p>
          </div>
        </div>
      </div>

      {/* Compact Unified Toolbar: Categories, Search, and ViewToggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
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
                  "rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-all",
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
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

      {/* Pinned Announcements Spotlight (if any) */}
      {pinnedItems.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Pin className="h-3.5 w-3.5" />
            <span>Pengumuman Tersemat Penting</span>
          </div>

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedItems.map((item) => (
                <Card
                  key={item.id}
                  className="relative rounded-2xl border-2 border-primary/40 bg-card shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Solid Corner Ribbon - Crave POS Standard */}
                  <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden pointer-events-none">
                    <div className="absolute transform rotate-45 bg-primary text-white text-[10px] font-black tracking-wider py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-xs">
                      PINNED
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2.5 pr-8">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          CATEGORY_MAP[item.category]?.color || CATEGORY_MAP.general.color
                        }`}
                      >
                        {CATEGORY_MAP[item.category]?.label || item.category}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          PRIORITY_MAP[item.priority]?.badge || PRIORITY_MAP.normal.badge
                        }`}
                      >
                        {PRIORITY_MAP[item.priority]?.label || item.priority}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center ml-auto">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatTanggal(item.published_at)}
                      </span>
                    </div>

                    <h4 className="text-lg font-black tracking-tight text-foreground line-clamp-2 mb-2">
                      {item.title}
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {item.author?.name ? item.author.name.substring(0, 2).toUpperCase() : "AD"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {item.author?.name || "Admin HR"}
                        </span>
                      </div>

                      {/* Direct Actions in Card View (No 3-dots) */}
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePin(item.id)}
                          className="h-7 rounded-lg px-2 text-xs text-primary hover:bg-primary/10 font-semibold"
                          title="Lepas Sematan"
                        >
                          <PinOff className="h-3.5 w-3.5 mr-1" />
                          Lepas Pin
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="h-7 rounded-lg px-2 text-xs text-destructive hover:bg-destructive/10"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {pinnedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-primary/40 bg-card p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Pin className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-black text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => openEditModal(item)}>
                          {item.title}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-semibold border ${CATEGORY_MAP[item.category]?.color || CATEGORY_MAP.general.color}`}>
                          {CATEGORY_MAP[item.category]?.label || item.category}
                        </span>
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
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleTogglePin(item.id)}>
                          <PinOff className="h-3.5 w-3.5 mr-2 text-primary" /> Lepas Sematan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(item)}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
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

      {/* Regular Announcements Feed */}
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
          <Card className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Megaphone className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">Belum ada pengumuman</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Tidak ada pengumuman yang sesuai dengan filter pencarian Anda. Klik tombol di bawah untuk membuat pengumuman pertama.
            </p>
            <Button
              onClick={openCreateModal}
              className="mt-4 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Buat Pengumuman Sekarang
            </Button>
          </Card>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularItems.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        CATEGORY_MAP[item.category]?.color || CATEGORY_MAP.general.color
                      }`}
                    >
                      {CATEGORY_MAP[item.category]?.label || item.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        PRIORITY_MAP[item.priority]?.badge || PRIORITY_MAP.normal.badge
                      }`}
                    >
                      {PRIORITY_MAP[item.priority]?.label || item.priority}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTanggal(item.published_at)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-muted font-bold text-muted-foreground">
                          {item.author?.name ? item.author.name.substring(0, 2).toUpperCase() : "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[110px] text-foreground font-medium">
                        {item.author?.name || "Admin HR"}
                      </span>
                    </div>

                    {/* Direct Actions in Card View (No 3-dots) */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePin(item.id)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary"
                        title="Sematkan ke atas"
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(item)}
                        className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 rounded-lg px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => openEditModal(item)}>
                        {item.title}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-semibold border ${CATEGORY_MAP[item.category]?.color || CATEGORY_MAP.general.color}`}>
                        {CATEGORY_MAP[item.category]?.label || item.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-medium ${PRIORITY_MAP[item.priority]?.badge || PRIORITY_MAP.normal.badge}`}>
                        {PRIORITY_MAP[item.priority]?.label || item.priority}
                      </span>
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
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleTogglePin(item.id)}>
                        <Pin className="h-3.5 w-3.5 mr-2 text-primary" /> Sematkan (Pin)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(item)}>
                        <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Form Create / Edit */}
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
                Judul Pengumuman <span className="text-rose-500">*</span>
              </label>
              <Input
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                placeholder="Contoh: Jadwal Libur Lebaran & Ketentuan Cuti Bersama 2026"
                className="rounded-xl"
                required
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
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
                Isi Pengumuman <span className="text-rose-500">*</span>
              </label>
              <Textarea
                rows={5}
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                placeholder="Tuliskan detail pengumuman secara lengkap dan jelas..."
                className="rounded-xl resize-none"
                required
              />
              {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
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
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {processing ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Terbitkan Pengumuman"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
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
