import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Headphones,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
  Users,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Check,
  Receipt,
} from "lucide-react";

const EMPLOYEE_OPTIONS = [
  "1 - 20 Karyawan (Paket Starter)",
  "21 - 50 Karyawan (Paket Pro Standar)",
  "51 - 100 Karyawan (Paket Growth)",
  "101 - 250 Karyawan (Paket Business)",
  "251 - 500 Karyawan (Enterprise)",
  "> 500 Karyawan (Custom Multi-Holding)",
];

export default function ContactSales() {
  const [submittedData, setSubmittedData] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    company_name: "",
    work_email: "",
    phone: "",
    employee_count: "21 - 50 Karyawan (Paket Pro Standar)",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/contact-sales", {
      preserveScroll: true,
      onSuccess: () => {
        setSubmittedData({ ...data });
        toast.success("Permintaan konsultasi berhasil dikirim!");
        reset();
      },
      onError: () => {
        toast.error("Mohon periksa kembali kolom formulir yang belum lengkap.");
      },
    });
  };

  // Build direct WhatsApp URL for instant chat
  const whatsappUrl = submittedData
    ? `https://wa.me/6281234567890?text=${encodeURIComponent(
        `Halo Tim Sales Crave HRM, saya ${submittedData.name} dari ${submittedData.company_name}. Saya baru saja mengirimkan permintaan demo untuk estimasi ${submittedData.employee_count}. Mohon info penjadwalannya.`
      )}`
    : "https://wa.me/6281234567890?text=Halo%20Tim%20Sales%20Crave%20HRM,%20saya%20tertarik%20konsultasi%20solusi%20dan%20demo%20Crave%20HRM.";

  const ticketNumber = submittedData
    ? `CS-2611-${Math.abs(
        (submittedData.name + submittedData.company_name).split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0) % 9000
      ) + 1000}`
    : "CS-2611-8891";

  return (
    <GuestLayout
      title="Konsultasi Solusi & Demo."
      subtitle="Diskusikan implementasi sistem SDM & penawaran khusus perusahaan Anda"
      mode="contact"
    >
      <Head title="Hubungi Sales & Demo — Crave HRM" />

      {submittedData ? (
        /* SUCCESS CONFIRMATION STATE - POLISHED CRAVE POS STYLE */
        <div className="py-1 text-center animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold tracking-wide">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              INQUIRY TICKET #{ticketNumber}
            </span>
          </div>

          <div className="mx-auto size-13 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-2xs border border-primary/20">
            <CheckCircle2 className="size-7 text-primary" />
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Permintaan Demo Berhasil Diterima!
          </h3>
          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 max-w-md mx-auto leading-relaxed">
            Terima kasih, <strong className="text-slate-900">{submittedData.name}</strong>. Tim Solution Consultant Crave HRM telah menerima rincian profil perusahaan Anda.
          </p>

          {/* 3-Step Progress Timeline */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
                <span className="text-[10px] font-bold text-slate-900 mt-1">Diterima</span>
                <span className="text-[9px] text-emerald-600 font-semibold">Tercatat di sistem</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="size-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  2
                </span>
                <span className="text-[10px] font-bold text-slate-900 mt-1">Review Kebutuhan</span>
                <span className="text-[9px] text-slate-500">Maks. 1x24 jam</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="size-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span className="text-[10px] font-bold text-slate-600 mt-1">Undangan Demo</span>
                <span className="text-[9px] text-slate-400">Jadwal privat</span>
              </div>
            </div>
          </div>

          {/* Submission Summary Receipt */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 text-left space-y-1.5 text-xs shadow-2xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Nama Penanggung Jawab</span>
              <span className="font-bold text-slate-900">{submittedData.name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Entitas Bisnis</span>
              <span className="font-bold text-slate-900">{submittedData.company_name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Email Kantor</span>
              <span className="font-semibold text-slate-800">{submittedData.work_email}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">WhatsApp / HP</span>
              <span className="font-semibold text-slate-800">{submittedData.phone}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Skala Tenaga Kerja</span>
              <span className="font-extrabold text-primary">{submittedData.employee_count}</span>
            </div>
          </div>

          {/* Instant WhatsApp Action & Alternate Buttons */}
          <div className="mt-4 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4.5" />
              <span>Ingin Respon Lebih Cepat? Chat Tim Sales di WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmittedData(null)}
                className="h-10 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Kirim Permintaan Lain
              </Button>
              <Button
                asChild
                variant="default"
                className="h-10 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer"
              >
                <Link href="/register">
                  Daftar Akun Langsung <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Data dilindungi enkripsi TLS 256-bit &amp; kepatuhan UU PDP No. 27/2022.</span>
          </div>
        </div>
      ) : (
        /* FORM INPUT STATE */
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-4 md:gap-y-2.5">
            {/* YOUR FULL NAME */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1 flex items-center justify-between">
                <span>Your Full Name</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Nama lengkap penanggung jawab"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium ml-1">{errors.name}</p>
              )}
            </div>

            {/* COMPANY / BUSINESS NAME */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1 flex items-center justify-between">
                <span>Company / Business Name</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  value={data.company_name}
                  onChange={(e) => setData("company_name", e.target.value)}
                  placeholder="Contoh: PT Crave Solusi"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
              {errors.company_name && (
                <p className="text-[11px] text-red-500 font-medium ml-1">{errors.company_name}</p>
              )}
            </div>
          </div>

          {/* BUSINESS EMAIL ADDRESS */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1 flex items-center justify-between">
              <span>Business Email Address</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <Input
                type="email"
                required
                value={data.work_email}
                onChange={(e) => setData("work_email", e.target.value)}
                placeholder="nama@perusahaan.com"
                className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            {errors.work_email && (
              <p className="text-[11px] text-red-500 font-medium ml-1">{errors.work_email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-4 md:gap-y-2.5">
            {/* WHATSAPP / PHONE NUMBER */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1 flex items-center justify-between">
                <span>WhatsApp / Phone Number</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="0812-3456-7890"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-medium ml-1">{errors.phone}</p>
              )}
            </div>

            {/* ESTIMATED EMPLOYEES */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1 flex items-center justify-between">
                <span>Estimated Employees</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={data.employee_count}
                  onChange={(e) => setData("employee_count", e.target.value)}
                  className="h-11 w-full rounded-xl bg-slate-50 border border-slate-200 px-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {EMPLOYEE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {errors.employee_count && (
                <p className="text-[11px] text-red-500 font-medium ml-1">{errors.employee_count}</p>
              )}
            </div>
          </div>

          {/* SPECIFIC REQUIREMENTS / NOTES */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-1">
              Specific Requirements / Question (Optional)
            </label>
            <textarea
              rows={3}
              value={data.notes}
              onChange={(e) => setData("notes", e.target.value)}
              placeholder="Contoh: Kami butuh integrasi absensi GPS 3 cabang, kalkulasi PPh 21 TER 2024 otomatis, dan slip gaji digital..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 resize-none"
            />
            {errors.notes && (
              <p className="text-[11px] text-red-500 font-medium ml-1">{errors.notes}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={processing}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-sm tracking-tight shadow-soft cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  <span>Mengirim Permintaan...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Kirim Permintaan Demo & Sales</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            Data Anda aman &amp; hanya digunakan tim Crave untuk penjadwalan konsultasi resmi.
          </p>
        </form>
      )}
    </GuestLayout>
  );
}
