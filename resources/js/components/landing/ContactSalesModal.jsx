import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Headphones,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactSalesModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    work_email: "",
    phone: "",
    employee_count: "21 - 50 Karyawan",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      const response = await fetch("/contact-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 422) {
        setErrors(resData.errors || {});
      } else {
        alert(resData.message || "Terjadi kesalahan saat mengirim formulir.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      company_name: "",
      work_email: "",
      phone: "",
      employee_count: "21 - 50 Karyawan",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-[560px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] text-left animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 size-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
          aria-label="Tutup jendela"
        >
          <X className="size-4.5" />
        </button>

        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="py-6 text-center space-y-4">
            <div className="size-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-soft">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black tracking-tight text-[#111827]">
                Permintaan Berhasil Dikirim!
              </h3>
              <p className="text-xs sm:text-[13px] text-[#4B5563] max-w-md mx-auto leading-relaxed">
                Terima kasih, <strong>{formData.name}</strong>. Tim Sales &amp; Konsultan Crave HRM telah menerima data Anda dan akan menghubungi Anda dalam 1x24 jam untuk presentasi demo solusi.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Perusahaan:</span>
                <span className="font-bold text-[#111827]">{formData.company_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Email Kantor:</span>
                <span className="font-bold text-[#111827]">{formData.work_email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">WhatsApp:</span>
                <span className="font-bold text-[#111827]">{formData.phone}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo Tim Sales Crave HRM, saya ${formData.name} dari ${formData.company_name} baru saja mengisi form konsultasi demo di website.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-3 shadow-soft transition-colors"
              >
                <MessageCircle className="size-4.5" /> Chat Langsung via WhatsApp Sales
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="w-full rounded-xl text-xs sm:text-sm font-semibold h-11"
              >
                Selesai &amp; Tutup
              </Button>
            </div>
          </div>
        ) : (
          /* FORM STATE (STYLED LIKE REGISTER FORM) */
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-2xl bg-[#EEF2FF] text-[oklch(0.54_0.19_258)] flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Headphones className="size-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[18px] sm:text-[20px] text-[#111827] tracking-tight">
                  Konsultasi Solusi &amp; Demo Crave HRM
                </h3>
                <p className="text-[12px] text-[#6B7280]">
                  Diskusikan implementasi sistem SDM &amp; penawaran khusus perusahaan Anda
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-3.5 sm:gap-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-red-500 ml-1 font-medium">{errors.name[0] || errors.name}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      type="text"
                      required
                      placeholder="Contoh: PT Retail Nusantara"
                      value={formData.company_name}
                      onChange={(e) => handleChange("company_name", e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.company_name && (
                    <p className="text-[11px] text-red-500 ml-1 font-medium">{errors.company_name[0] || errors.company_name}</p>
                  )}
                </div>

                {/* Work Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Email Kantor / Bisnis <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      placeholder="budi@perusahaan.com"
                      value={formData.work_email}
                      onChange={(e) => handleChange("work_email", e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.work_email && (
                    <p className="text-[11px] text-red-500 ml-1 font-medium">{errors.work_email[0] || errors.work_email}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Nomor WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      type="tel"
                      required
                      placeholder="0812-3456-7890"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 ml-1 font-medium">{errors.phone[0] || errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Employee Count Select */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Perkiraan Jumlah Karyawan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.employee_count}
                    onChange={(e) => handleChange("employee_count", e.target.value)}
                    className="w-full pl-10 pr-4 h-11 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="1 - 20 Karyawan">1 - 20 Karyawan (Usaha Berkembang)</option>
                    <option value="21 - 50 Karyawan">21 - 50 Karyawan (Paket Pro Standar)</option>
                    <option value="51 - 100 Karyawan">51 - 100 Karyawan (Menengah)</option>
                    <option value="> 100 Karyawan">&gt; 100 Karyawan (Enterprise / Multi-Holding)</option>
                  </select>
                </div>
              </div>

              {/* Inquiries / Notes */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Kebutuhan Spesifik / Pertanyaan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kami butuh integrasi absensi 3 cabang dan kalkulasi PPh 21 TER 2024 otomatis..."
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-black text-sm tracking-tight shadow-soft cursor-pointer transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Mengirim Permintaan...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Kirim Permintaan Demo &amp; Sales
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  Data Anda aman &amp; hanya digunakan tim Crave untuk penjadwalan demo resmi.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
