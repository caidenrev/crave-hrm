import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export function EmployeeFormModal({
  open,
  onOpenChange,
  employee = null,
  departments = [],
  branches = [],
  designations = [],
}) {
  const isEditing = !!employee;

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm({
      nik: "",
      nama_lengkap: "",
      email: "",
      nomor_telepon: "",
      tanggal_lahir: "",
      jenis_kelamin: "L",
      tanggal_masuk: new Date().toISOString().split("T")[0],
      status_kerja: "PKWTT",
      ptkp_status: "TK/0",
      bank_name: "BCA",
      bank_account_number: "",
      gaji_pokok: "",
      department_id: "",
      designation_id: "",
      branch_id: "",
      is_active: true,
    });

  useEffect(() => {
    if (employee) {
      setData({
        nik: employee.nik || "",
        nama_lengkap: employee.nama_lengkap || "",
        email: employee.email || "",
        nomor_telepon: employee.nomor_telepon || "",
        tanggal_lahir: employee.tanggal_lahir
          ? employee.tanggal_lahir.split("T")[0]
          : "",
        jenis_kelamin: employee.jenis_kelamin || "L",
        tanggal_masuk: employee.tanggal_masuk
          ? employee.tanggal_masuk.split("T")[0]
          : new Date().toISOString().split("T")[0],
        status_kerja: employee.status_kerja || "PKWTT",
        ptkp_status: employee.ptkp_status || "TK/0",
        bank_name: employee.bank_name || "BCA",
        bank_account_number: employee.bank_account_number || "",
        gaji_pokok: employee.gaji_pokok ? String(employee.gaji_pokok) : "",
        department_id: employee.department_id ? String(employee.department_id) : "",
        designation_id: employee.designation_id
          ? String(employee.designation_id)
          : "",
        branch_id: employee.branch_id ? String(employee.branch_id) : "",
        is_active: employee.is_active ?? true,
      });
    } else {
      reset();
      clearErrors();
    }
  }, [employee, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(`/employees/${employee.id}`, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    } else {
      post("/employees", {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  const filteredDesignations = data.department_id
    ? designations.filter(
        (des) => String(des.department_id) === String(data.department_id)
      )
    : designations;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold text-foreground">
            {isEditing ? "Edit Data Karyawan" : "Undang Karyawan Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? `Perbarui profil dan data kepegawaian untuk ${employee?.nama_lengkap}.`
              : "Masukkan informasi karyawan untuk mendaftarkannya ke sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Identitas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                NIK Karyawan *
              </Label>
              <Input
                value={data.nik}
                onChange={(e) => setData("nik", e.target.value)}
                placeholder="Misal: CRV-001"
                className="rounded-xl h-9 text-xs"
                required
              />
              {errors.nik && (
                <p className="text-[11px] text-destructive">{errors.nik}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Nama Lengkap *
              </Label>
              <Input
                value={data.nama_lengkap}
                onChange={(e) => setData("nama_lengkap", e.target.value)}
                placeholder="Nama sesuai KTP"
                className="rounded-xl h-9 text-xs"
                required
              />
              {errors.nama_lengkap && (
                <p className="text-[11px] text-destructive">{errors.nama_lengkap}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Email Korporat *
              </Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="nama@crave.com"
                className="rounded-xl h-9 text-xs"
                required
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                No. WhatsApp
              </Label>
              <Input
                value={data.nomor_telepon}
                onChange={(e) => setData("nomor_telepon", e.target.value)}
                placeholder="0812xxxxxxxx"
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Jenis Kelamin
              </Label>
              <select
                value={data.jenis_kelamin}
                onChange={(e) => setData("jenis_kelamin", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Tanggal Masuk *
              </Label>
              <Input
                type="date"
                value={data.tanggal_masuk}
                onChange={(e) => setData("tanggal_masuk", e.target.value)}
                className="rounded-xl h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Penempatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Kantor Cabang
              </Label>
              <select
                value={data.branch_id}
                onChange={(e) => setData("branch_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="">Pilih Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Departemen
              </Label>
              <select
                value={data.department_id}
                onChange={(e) => setData("department_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
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
              <Label className="text-xs text-foreground font-semibold">
                Jabatan / Posisi
              </Label>
              <select
                value={data.designation_id}
                onChange={(e) => setData("designation_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="">Pilih Jabatan</option>
                {filteredDesignations.map((des) => (
                  <option key={des.id} value={des.id}>
                    {des.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Status Kerja *
              </Label>
              <select
                value={data.status_kerja}
                onChange={(e) => setData("status_kerja", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="PKWTT">PKWTT (Tetap)</option>
                <option value="PKWT">PKWT (Kontrak)</option>
                <option value="Probation">Probation</option>
                <option value="Internship">Magang</option>
              </select>
            </div>
          </div>

          {/* Gaji & Pajak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Gaji Pokok (Rp) *
              </Label>
              <Input
                type="number"
                value={data.gaji_pokok}
                onChange={(e) => setData("gaji_pokok", e.target.value)}
                placeholder="10000000"
                className="rounded-xl h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Status PTKP (PPh 21 TER) *
              </Label>
              <select
                value={data.ptkp_status}
                onChange={(e) => setData("ptkp_status", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="TK/0">TK/0 (Kategori A)</option>
                <option value="TK/1">TK/1 (Kategori A)</option>
                <option value="K/0">K/0 (Kategori A)</option>
                <option value="TK/2">TK/2 (Kategori B)</option>
                <option value="TK/3">TK/3 (Kategori B)</option>
                <option value="K/1">K/1 (Kategori B)</option>
                <option value="K/2">K/2 (Kategori B)</option>
                <option value="K/3">K/3 (Kategori C)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Bank Transfer
              </Label>
              <select
                value={data.bank_name}
                onChange={(e) => setData("bank_name", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                <option value="BCA">BCA</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BRI">BRI</option>
                <option value="BNI">BNI</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-foreground font-semibold">
                Nomor Rekening
              </Label>
              <Input
                value={data.bank_account_number}
                onChange={(e) => setData("bank_account_number", e.target.value)}
                placeholder="Misal: 8210984721"
                className="rounded-xl h-9 text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl text-xs"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs"
              disabled={processing}
            >
              {processing && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
