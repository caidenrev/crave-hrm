import React from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatRupiah,
  formatTanggal,
  formatMasaKerja,
  getInitials,
} from "@/lib/formatters";
import {
  Edit,
  Mail,
  Phone,
  Calendar,
  Building2,
  MapPin,
  CreditCard,
  Briefcase,
  Wallet,
} from "lucide-react";

export function EmployeeSheet({
  employee,
  open,
  onOpenChange,
  onEdit,
}) {
  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-5">
        {/* Profile Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0">
              <AvatarFallback className="bg-primary/10 text-sm font-extrabold text-primary uppercase">
                {getInitials(employee.nama_lengkap)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-extrabold truncate text-foreground">
                  {employee.nama_lengkap}
                </p>
                <Badge
                  variant={employee.is_active ? "secondary" : "outline"}
                  className="rounded-full text-[10px]"
                >
                  {employee.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {employee.designation?.title || "Staff"} ·{" "}
                {employee.department?.name || "-"}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                NIK: {employee.nik}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onEdit(employee);
            }}
            className="rounded-xl text-xs"
          >
            <Edit className="size-3.5 mr-1" />
            Edit
          </Button>
        </div>

        {/* Tabbed Info */}
        <div className="mt-4">
          <Tabs defaultValue="pribadi" className="w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-xl mb-4 h-9">
              <TabsTrigger value="pribadi" className="text-xs">
                Pribadi
              </TabsTrigger>
              <TabsTrigger value="pekerjaan" className="text-xs">
                Penempatan
              </TabsTrigger>
              <TabsTrigger value="gaji" className="text-xs">
                Gaji & Pajak
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PRIBADI */}
            <TabsContent value="pribadi" className="space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Email</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.email}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">WhatsApp</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.nomor_telepon || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Tanggal Lahir</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {formatTanggal(employee.tanggal_lahir)}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
            </TabsContent>

            {/* TAB 2: PEKERJAAN */}
            <TabsContent value="pekerjaan" className="space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cabang</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.branch?.name || "Pusat (HQ)"}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Departemen</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.department?.name || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Jabatan</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.designation?.title || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground">Status Kerja</span>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {employee.status_kerja}
                </Badge>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Masa Kerja</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {formatMasaKerja(employee.tanggal_masuk)}
                </span>
              </div>
            </TabsContent>

            {/* TAB 3: GAJI & PAJAK */}
            <TabsContent value="gaji" className="space-y-2">
              <div className="card-soft p-3 bg-card border">
                <p className="text-[11px] text-muted-foreground">Gaji Pokok</p>
                <p className="text-xl font-extrabold text-foreground mt-0.5">
                  {formatRupiah(employee.gaji_pokok)}
                </p>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Wallet className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Kategori TER PPh 21</span>
                </div>
                <span className="text-xs font-bold text-foreground font-mono">
                  {employee.ptkp_status}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Bank & Rekening</span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {employee.bank_name} · {employee.bank_account_number || "-"}
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
