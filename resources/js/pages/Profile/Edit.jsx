import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Laptop2,
  Smartphone,
  Check,
  Calendar,
  Briefcase,
  KeyRound,
  ArrowUpRight,
  LogOut,
  MapPin,
  CreditCard,
  ShieldAlert,
  AlertTriangle,
  Fingerprint,
  Clock,
  Radio,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DEFAULT_AVATARS = [
  { id: "avatar-1", src: "/images/avatars/avatar-1.jpg", label: "Kartun Aufa" },
  { id: "avatar-2", src: "/images/avatars/avatar-2.jpg", label: "Kartun Revan" },
  { id: "avatar-3", src: "/images/avatars/avatar-3.jpg", label: "Kartun Egi" },
];

export default function ProfileEdit({ user, employee, sessions = [] }) {
  const { flash } = usePage().props;

  // URL query parameter tab support (e.g. /profile?tab=sessions)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  const initialAvatar =
    user?.avatar_url || employee?.avatar_url || "/images/avatars/avatar-1.jpg";

  // Form: Profil
  const {
    data: profileData,
    setData: setProfileData,
    put: putProfile,
    processing: profileProcessing,
    errors: profileErrors,
  } = useForm({
    name: user?.name || "",
    nomor_telepon: employee?.nomor_telepon || "",
    avatar_url: initialAvatar,
  });

  // Sync state if user or employee props update from Inertia
  useEffect(() => {
    if (user?.name || user?.avatar_url || employee?.avatar_url || employee?.nomor_telepon) {
      setProfileData((prev) => ({
        ...prev,
        name: user?.name ?? prev.name,
        avatar_url: user?.avatar_url || employee?.avatar_url || prev.avatar_url,
        nomor_telepon: employee?.nomor_telepon ?? prev.nomor_telepon,
      }));
    }
  }, [user?.name, user?.avatar_url, employee?.avatar_url, employee?.nomor_telepon]);

  // Form: Password
  const {
    data: passwordData,
    setData: setPasswordData,
    put: putPassword,
    processing: passwordProcessing,
    errors: passwordErrors,
    reset: resetPassword,
  } = useForm({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // Form: Logout Other Sessions Modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const {
    data: sessionData,
    setData: setSessionData,
    post: postLogoutOthers,
    processing: sessionProcessing,
    errors: sessionErrors,
    reset: resetSession,
  } = useForm({
    password: "",
  });

  // Password Visibility Toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Password Criteria & Strength Calculator
  const pw = passwordData.new_password || "";
  const pwCriteria = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };

  const getPasswordStrength = () => {
    if (!pw) return { score: 0, label: "Belum diisi", color: "bg-muted", text: "text-muted-foreground" };
    let score = 0;
    if (pwCriteria.length) score += 1;
    if (pwCriteria.uppercase) score += 1;
    if (pwCriteria.number) score += 1;
    if (pwCriteria.special) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Sangat Lemah", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
      case 2:
        return { score: 2, label: "Cukup", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
      case 3:
        return { score: 3, label: "Kuat", color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" };
      case 4:
        return { score: 4, label: "Sangat Kuat", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
      default:
        return { score: 0, label: "Terlalu Pendek", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
    }
  };

  const pwStrengthInfo = getPasswordStrength();

  const isPasswordMatch =
    passwordData.new_password &&
    passwordData.new_password_confirmation &&
    passwordData.new_password === passwordData.new_password_confirmation;

  const isPasswordMismatch =
    passwordData.new_password_confirmation &&
    passwordData.new_password !== passwordData.new_password_confirmation;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    putProfile("/profile", {
      preserveScroll: true,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    putPassword("/profile/password", {
      preserveScroll: true,
      onSuccess: () => resetPassword(),
    });
  };

  const handleLogoutOthersSubmit = (e) => {
    e.preventDefault();
    postLogoutOthers("/profile/sessions/logout-others", {
      preserveScroll: true,
      onSuccess: () => {
        setLogoutModalOpen(false);
        resetSession();
      },
    });
  };

  return (
    <AuthenticatedLayout
      title="Pengaturan Profil"
      subtitle="Kelola identitas pribadi, foto avatar kartun, dan pengaturan keamanan akun Anda."
      actions={
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 text-primary px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold whitespace-nowrap"
        >
          <span className="size-2 rounded-full bg-emerald-500 mr-1 sm:mr-1.5 inline-block shrink-0" />
          <span className="hidden sm:inline">{user.role_label}</span>
          <span className="sm:hidden">Admin</span>
        </Badge>
      }
    >
      <Head title="Pengaturan Profil — Crave HRM" />

      <div className="space-y-5">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-soft">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-3.5 text-xs font-semibold text-destructive shadow-soft">
            <AlertCircle className="size-4 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* 4 TOP KPI CARDS (Crave POS Formula: Hero Blue + 3 White card-soft) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {/* Card 0: Hero Electric Blue - Status Akun */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary bg-primary p-3 shadow-lg shadow-primary/25 sm:rounded-3xl sm:p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-1.5">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="size-4.5 sm:size-5" />
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase">
                Aktif
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-xl font-black tracking-tight sm:text-2xl truncate text-white">
                {user.name}
              </div>
              <div className="text-[11px] sm:text-xs text-white/80 font-medium truncate mt-0.5">
                {user.role_label}
              </div>
            </div>
          </div>

          {/* Card 1: Perusahaan & Cabang */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-soft sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-foreground">
                <Building2 className="size-4.5 sm:size-5" />
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                <ArrowUpRight className="size-3.5 shrink-0" />
                Terdaftar
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                {user.company_name}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate mt-0.5">
                {employee?.branch_name || "Kantor Pusat Crave Group (Holding)"}
              </div>
            </div>
          </div>

          {/* Card 2: Keamanan Sandi */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-soft sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-foreground">
                <KeyRound className="size-4.5 sm:size-5" />
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                <CheckCircle2 className="size-3.5 shrink-0" />
                Bcrypt
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                Terproteksi
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate mt-0.5">
                Enkripsi Standar SaaS
              </div>
            </div>
          </div>

          {/* Card 3: Sesi Perangkat */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-3 shadow-soft sm:rounded-3xl sm:p-4 text-card-foreground">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-foreground">
                <Laptop2 className="size-4.5 sm:size-5" />
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                <span className="size-2 rounded-full bg-emerald-500 mr-0.5 inline-block" />
                Online
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3">
              <div className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                {sessions.length} Sesi Aktif
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate mt-0.5">
                Perangkat Saat Ini
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Profile Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="w-full overflow-x-auto no-scrollbar">
            <TabsList className="rounded-xl h-10 p-1 bg-muted/60 border border-border/50 inline-flex w-max min-w-full sm:min-w-0">
              <TabsTrigger value="info" className="rounded-lg text-xs font-bold px-3 sm:px-4 gap-1.5 cursor-pointer whitespace-nowrap">
                <UserIcon className="size-3.5 shrink-0" />
                <span>Informasi Profil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg text-xs font-bold px-3 sm:px-4 gap-1.5 cursor-pointer whitespace-nowrap">
                <Lock className="size-3.5 shrink-0" />
                <span>Keamanan Sandi</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="rounded-lg text-xs font-bold px-3 sm:px-4 gap-1.5 cursor-pointer whitespace-nowrap">
                <Laptop2 className="size-3.5 shrink-0" />
                <span>Sesi Perangkat</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: INFORMASI PROFIL & KEPEGAWAIAN */}
          <TabsContent value="info" className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Kolom Kiri: Form Ubah Profil (7 Cols) */}
              <div className="card-soft p-5 lg:col-span-7 space-y-5">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    Biodata &amp; Foto Profil
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pilih avatar kartun khas Crave HRM atau perbarui kontak Anda.
                  </p>
                </div>

                {/* Avatar Picker Section */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-2.5">
                    Pilihan Avatar Kartun Crave HRM
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {DEFAULT_AVATARS.map((av) => {
                      const isSelected = profileData.avatar_url === av.src;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setProfileData("avatar_url", av.src)}
                          className={cn(
                            "relative size-16 sm:size-20 rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer group",
                            isSelected
                              ? "border-primary ring-2 ring-primary/40 shadow-soft scale-105"
                              : "border-border/70 hover:border-primary/50 opacity-80 hover:opacity-100"
                          )}
                        >
                          <img
                            src={av.src}
                            alt={av.label}
                            className="size-full object-cover rounded-xl"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                                <Check className="size-3.5 stroke-[3]" />
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {profileErrors.avatar_url && (
                    <p className="text-xs text-destructive mt-1.5">{profileErrors.avatar_url}</p>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Nama Lengkap <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData("name", e.target.value)}
                        placeholder="Masukkan nama lengkap Anda..."
                        className="rounded-xl pl-9 text-xs"
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="text-xs text-destructive mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  {/* Email (Read-only formal corporate identifier) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        Email Perusahaan
                      </label>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                        Terverifikasi
                      </Badge>
                    </div>
                    <div className="relative">
                      <Mail className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="rounded-xl pl-9 text-xs bg-muted/50 cursor-not-allowed opacity-80"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Email akun dikelola terpusat oleh Departemen TI &amp; HR Holding.
                    </p>
                  </div>

                  {/* Nomor Telepon / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Nomor Telepon / WhatsApp Aktif
                    </label>
                    <div className="relative">
                      <Phone className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type="tel"
                        value={profileData.nomor_telepon}
                        onChange={(e) => setProfileData("nomor_telepon", e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="rounded-xl pl-9 text-xs"
                      />
                    </div>
                    {profileErrors.nomor_telepon && (
                      <p className="text-xs text-destructive mt-1">{profileErrors.nomor_telepon}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={profileProcessing}
                      className="rounded-xl font-bold text-xs gap-1.5 shadow-soft w-full sm:w-auto cursor-pointer"
                    >
                      <Check className="size-4" />
                      <span>{profileProcessing ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Kolom Kanan: Detail Informasi Kepegawaian (5 Cols) */}
              <div className="card-soft p-5 lg:col-span-5 space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    Informasi Kepegawaian
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Data kontrak kerja resmi terdaftar di sistem Crave HRM.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Nomor Induk (NIK)</span>
                    <span className="font-mono font-bold text-foreground">
                      {employee?.nik || "HLD-001"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Departemen</span>
                    <span className="font-semibold text-foreground">
                      {employee?.department_name || "Headquarters"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Jabatan / Peran</span>
                    <span className="font-semibold text-foreground">
                      {employee?.designation_name || user.role_label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Status Kerja</span>
                    <Badge variant="outline" className="rounded-full text-[10px] font-semibold bg-primary/5 text-primary border-primary/20">
                      {employee?.status_kerja || "PKWTT (Tetap)"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Status Pajak PTKP</span>
                    <span className="font-semibold text-foreground">
                      {employee?.ptkp_status || "TK/0 (Kategori A)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Kantor Cabang</span>
                    <span className="font-semibold text-foreground">
                      {employee?.branch_name || "Pusat HQ"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Rekening Payroll</span>
                    <span className="font-mono font-bold text-foreground">
                      {employee?.bank_name || "BCA"} • {employee?.bank_account_number || "•••• 4721"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Tanggal Bergabung</span>
                    <span className="font-semibold text-foreground">
                      {employee?.tanggal_masuk || "10 Nov 2026"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: KEAMANAN & GANTI PASSWORD */}
          <TabsContent value="security" className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Kolom Kiri: Form Perbarui Kata Sandi (7 Cols) */}
              <div className="card-soft p-5 lg:col-span-7 space-y-5">
                <div className="border-b pb-3">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm sm:text-base">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <KeyRound className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Perbarui Kata Sandi Akun
                      </h3>
                      <p className="text-xs text-muted-foreground font-normal">
                        Kombinasikan karakter kuat untuk menjaga integritas akses dan data perusahaan.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        Kata Sandi Saat Ini <span className="text-destructive">*</span>
                      </label>
                      <span className="text-[11px] text-muted-foreground font-normal">Wajib diisi</span>
                    </div>
                    <div className="relative">
                      <Lock className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type={showCurrentPw ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData("current_password", e.target.value)}
                        placeholder="Masukkan kata sandi lama Anda..."
                        className="rounded-xl pl-9 pr-10 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{passwordErrors.current_password}</span>
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        Kata Sandi Baru <span className="text-destructive">*</span>
                      </label>
                      {passwordData.new_password && (
                        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted/80", pwStrengthInfo.text)}>
                          {pwStrengthInfo.label}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type={showNewPw ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData("new_password", e.target.value)}
                        placeholder="Minimal 8 karakter unik..."
                        className="rounded-xl pl-9 pr-10 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showNewPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{passwordErrors.new_password}</span>
                      </p>
                    )}

                    {/* Interactive Password Strength Indicator & Criteria */}
                    {passwordData.new_password && (
                      <div className="space-y-2 pt-1">
                        <div className="flex gap-1.5 h-1.5">
                          <div
                            className={cn(
                              "flex-1 rounded-full transition-colors",
                              pwStrengthInfo.score >= 1 ? pwStrengthInfo.color : "bg-muted"
                            )}
                          />
                          <div
                            className={cn(
                              "flex-1 rounded-full transition-colors",
                              pwStrengthInfo.score >= 2 ? pwStrengthInfo.color : "bg-muted"
                            )}
                          />
                          <div
                            className={cn(
                              "flex-1 rounded-full transition-colors",
                              pwStrengthInfo.score >= 3 ? pwStrengthInfo.color : "bg-muted"
                            )}
                          />
                          <div
                            className={cn(
                              "flex-1 rounded-full transition-colors",
                              pwStrengthInfo.score >= 4 ? pwStrengthInfo.color : "bg-muted"
                            )}
                          />
                        </div>

                        {/* Criteria Grid Chips */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border",
                              pwCriteria.length
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-muted/40 text-muted-foreground border-border/40"
                            )}
                          >
                            <Check className={cn("size-3.5", pwCriteria.length ? "stroke-[3]" : "opacity-30")} />
                            <span>Min. 8 Karakter</span>
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border",
                              pwCriteria.uppercase
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-muted/40 text-muted-foreground border-border/40"
                            )}
                          >
                            <Check className={cn("size-3.5", pwCriteria.uppercase ? "stroke-[3]" : "opacity-30")} />
                            <span>Huruf Besar (A-Z)</span>
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border",
                              pwCriteria.number
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-muted/40 text-muted-foreground border-border/40"
                            )}
                          >
                            <Check className={cn("size-3.5", pwCriteria.number ? "stroke-[3]" : "opacity-30")} />
                            <span>Angka (0-9)</span>
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border",
                              pwCriteria.special
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-muted/40 text-muted-foreground border-border/40"
                            )}
                          >
                            <Check className={cn("size-3.5", pwCriteria.special ? "stroke-[3]" : "opacity-30")} />
                            <span>Simbol Khusus (!@#$)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        Konfirmasi Kata Sandi Baru <span className="text-destructive">*</span>
                      </label>
                      {isPasswordMatch && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="size-3 stroke-[3]" /> Kata Sandi Cocok
                        </span>
                      )}
                      {isPasswordMismatch && (
                        <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                          <AlertCircle className="size-3" /> Konfirmasi Belum Cocok
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="size-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                      <Input
                        type={showConfirmPw ? "text" : "password"}
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData("new_password_confirmation", e.target.value)}
                        placeholder="Ulangi kata sandi baru..."
                        className="rounded-xl pl-9 pr-10 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {passwordErrors.new_password_confirmation && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{passwordErrors.new_password_confirmation}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={passwordProcessing}
                      className="rounded-xl font-bold text-xs gap-1.5 shadow-soft w-full sm:w-auto cursor-pointer"
                    >
                      <ShieldCheck className="size-4" />
                      <span>{passwordProcessing ? "Memperbarui Sandi..." : "Perbarui Kata Sandi"}</span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Kolom Kanan: Panduan Standar Keamanan & Kepatuhan (5 Cols) */}
              <div className="card-soft p-5 lg:col-span-5 space-y-4">
                <div className="border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Standar Keamanan Akun
                      </h3>
                      <p className="text-xs text-muted-foreground font-normal">
                        Kepatuhan tata kelola kredensial Crave HRM.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Card 1: Bcrypt */}
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <KeyRound className="size-3.5 text-primary" />
                        Enkripsi Bcrypt 12 Rounds
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        Enterprise
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Kata sandi Anda di-hash satu arah dengan garam kriptografi unik. Tidak ada staf maupun sistem yang dapat membaca kata sandi asli Anda.
                    </p>
                  </div>

                  {/* Card 2: 90 Days Rotation */}
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" />
                        Siklus Rotasi Berkala
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        90 Hari
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Disarankan untuk melakukan pembaruan kata sandi berkala setiap kuartal guna mencegah risiko credential stuffing lintas platform.
                    </p>
                  </div>

                  {/* Card 3: UU PDP */}
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <FileCheck className="size-3.5 text-primary" />
                        Kepatuhan UU PDP No. 27/2022
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/30">
                        Nasional
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Hak akses terhadap slip gaji, data bank, dan nomor KTP diproteksi dengan kontrol isolasi tenant ketat (Zero-Leakage Guarantee).
                    </p>
                  </div>

                  {/* Security Alert Caution Box */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Penting:</strong> Jangan pernah membagikan kata sandi Anda kepada siapapun. Tim Crave HRM tidak akan pernah meminta kata sandi akun Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SESI PERANGKAT & KEAMANAN LOGIN */}
          <TabsContent value="sessions" className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Kolom Kiri: Sesi Terhubung (7 Cols) */}
              <div className="card-soft p-5 lg:col-span-7 space-y-5">
                <div className="border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Laptop2 className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Sesi Perangkat Aktif
                      </h3>
                      <p className="text-xs text-muted-foreground font-normal">
                        Daftar browser dan sistem yang sedang terotentikasi ke akun Crave HRM Anda.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                            {s.platform.includes("Mobile") || s.platform.includes("Android") || s.platform.includes("iOS") ? (
                              <Smartphone className="size-5.5" />
                            ) : (
                              <Laptop2 className="size-5.5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-foreground">
                                {s.browser} pada {s.platform}
                              </span>
                              {s.is_current && (
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] rounded-full px-2 py-0">
                                  <span className="size-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                                  Sesi Saat Ini
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Terakhir aktif: <strong className="text-foreground font-semibold">{s.last_active}</strong>
                            </p>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-[10px] bg-muted/80 text-muted-foreground font-mono">
                          Online
                        </Badge>
                      </div>

                      {/* Detail Sesi Meta Pills */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-[11px]">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Radio className="size-3.5 text-primary" />
                          <span>Alamat IP: <strong className="font-mono text-foreground font-semibold">{s.ip_address}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ShieldCheck className="size-3.5 text-emerald-600" />
                          <span>Status: <strong className="text-foreground font-semibold">Terverifikasi</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Ringkasan Keamanan Sesi */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-bold text-foreground">
                      Koneksi Sesi Terenkripsi &amp; Terlindungi
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Sesi login Anda dilindungi dengan token sesi unik per sesi peramban, time-out inaktivitas otomatis, dan validasi IP origin secara berkala.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Kontrol Akses & Tanggap Keamanan (5 Cols) */}
              <div className="card-soft p-5 lg:col-span-5 space-y-4">
                <div className="border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        Kontrol Akses Perangkat
                      </h3>
                      <p className="text-xs text-muted-foreground font-normal">
                        Tindakan tanggap darurat dan kebijakan akses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action: Keluar dari Sesi Lain */}
                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/25 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <LogOut className="size-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">
                        Putuskan Sesi di Perangkat Lain
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        Jika Anda pernah login di komputer kantor bersama atau perangkat yang tidak lagi Anda gunakan, putuskan semua sesi lain demi keamanan.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full rounded-xl text-xs font-bold text-destructive hover:bg-destructive hover:text-white border-destructive/40 shadow-2xs transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3.5 mr-1.5" />
                    <span>Keluar dari Sesi Lain</span>
                  </Button>
                </div>

                {/* Audit & Policy Details */}
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Fingerprint className="size-3.5 text-primary" />
                        Session Fingerprinting
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        Aktif
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Setiap paket HTTP diverifikasi dengan tanda tangan digital peramban untuk mencegah pembajakan sesi (Session Hijacking).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        Idle Session Timeout
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        120 Menit
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sesi web akan otomatis terkunci atau kadaluwarsa setelah 120 menit tidak ada interaksi pengguna untuk mencegah penyalahgunaan layar kerja.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="size-3.5 text-primary" />
                        Kuki HttpOnly &amp; SameSite Lax
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/30">
                        Kebijakan Kuki
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Kuki otentikasi tidak dapat diekstraksi oleh skrip client-side (kebal serangan XSS) dan terlindung dari eksploitasi CSRF.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOG: KONFIRMASI KELUAR DARI SESI LAIN */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Konfirmasi Keluar dari Perangkat Lain
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Masukkan kata sandi Anda untuk mengonfirmasi pemutusan seluruh sesi login di perangkat
              lain selain perangkat ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogoutOthersSubmit} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Kata Sandi Akun
              </label>
              <Input
                type="password"
                value={sessionData.password}
                onChange={(e) => setSessionData("password", e.target.value)}
                placeholder="Masukkan kata sandi untuk verifikasi..."
                className="rounded-xl text-xs"
                autoFocus
              />
              {sessionErrors.password && (
                <p className="text-xs text-destructive mt-1">{sessionErrors.password}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={sessionProcessing}
                className="rounded-xl text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {sessionProcessing ? "Memproses..." : "Putuskan Sesi Lain"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
