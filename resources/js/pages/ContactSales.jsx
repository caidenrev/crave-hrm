import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        reset();
      },
    });
  };

  // Build direct WhatsApp URL for instant chat
  const whatsappUrl = submittedData
    ? `https://wa.me/6281234567890?text=${encodeURIComponent(
        `Halo Tim Sales Crave HRM, saya ${submittedData.name} dari ${submittedData.company_name}. Saya baru saja mengirimkan permintaan demo untuk estimasi ${submittedData.employee_count}. Mohon info penjadwalannya.`
      )}`
    : "https://wa.me/6281234567890?text=Halo%20Tim%20Sales%20Crave%20HRM,%20saya%20tertarik%20konsultasi%20solusi%20dan%20demo%20Crave%20HRM.";

  return (
    <GuestLayout
      title="Konsultasi Solusi & Demo."
      subtitle="Diskusikan implementasi sistem SDM & penawaran khusus perusahaan Anda"
      mode="contact"
    >
      <Head title="Hubungi Sales & Demo — Crave HRM" />

      {submittedData ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="py-2 text-center animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="mx-auto size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs border border-emerald-100">
            <CheckCircle2 className="size-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Permintaan Demo Berhasil Terkirim!
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Terima kasih, <strong className="text-slate-900">{submittedData.name}</strong>. Tim Solution Architect Crave HRM akan menghubungi Anda melalui WhatsApp / Email dalam waktu 1x24 jam kerja.
          </p>

          {/* Submission Summary Card */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Perusahaan</span>
              <span className="font-bold text-slate-900">{submittedData.company_name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Email Kantor</span>
              <span className="font-semibold text-slate-900">{submittedData.work_email}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">WhatsApp / Telepon</span>
              <span className="font-semibold text-slate-900">{submittedData.phone}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Estimasi Karyawan</span>
              <span className="font-bold text-primary">{submittedData.employee_count}</span>
            </div>
          </div>

          {/* Instant WhatsApp Action */}
          <div className="mt-6 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="size-4.5" />
              <span>Chat Tim Sales Sekarang di WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmittedData(null)}
                className="h-10 rounded-xl text-xs font-semibold text-slate-700"
              >
                Kirim Form Lain
              </Button>
              <Button
                asChild
                variant="default"
                className="h-10 rounded-xl text-xs font-bold bg-primary text-white"
              >
                <Link href="/register">
                  Daftar Akun Langsung <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
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
