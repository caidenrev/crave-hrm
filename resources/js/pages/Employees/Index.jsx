import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeSheet } from "./EmployeeSheet";
import { EmployeeFormModal } from "./EmployeeFormModal";
import { getInitials } from "@/lib/formatters";
import {
  UserPlus,
  ShieldCheck,
  Search,
  Check,
  X,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export default function EmployeesIndex({
  employees,
  departments,
  branches,
  designations,
  metrics,
  filters,
}) {
  const [search, setSearch] = useState(filters.search || "");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const handleFilter = (updates = {}) => {
    const params = {
      search,
      status: selectedStatus,
      ...updates,
    };

    Object.keys(params).forEach(
      (key) => !params[key] && delete params[key]
    );

    router.get("/employees", params, {
      preserveState: true,
      replace: true,
    });
  };

  const handleToggleActive = (emp) => {
    router.patch(
      `/employees/${emp.id}/toggle-active`,
      {},
      { preserveScroll: true }
    );
  };

  const handleDelete = () => {
    if (!deletingEmployee) return;
    router.delete(`/employees/${deletingEmployee.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setDeletingEmployee(null);
      },
    });
  };

  // Matriks RBAC ringkas ala Crave POS
  const roles = ["Holding", "HR Admin", "Manager", "Finance", "Staf"];
  const permissions = [
    { name: "Presensi GPS & Selfie", roles: ["Holding", "HR Admin", "Manager", "Finance", "Staf"] },
    { name: "Kelola Jadwal Shift", roles: ["Holding", "HR Admin", "Manager"] },
    { name: "Hitung Gaji & PPh 21 TER", roles: ["Holding", "HR Admin", "Finance"] },
    { name: "Ekspor Batch Bank (BCA/Mandiri)", roles: ["Holding", "Finance"] },
    { name: "Akses Data Karyawan", roles: ["Holding", "HR Admin"] },
    { name: "Persetujuan Cuti Tim", roles: ["Holding", "HR Admin", "Manager"] },
    { name: "Voucher & Kasir Kantin", roles: ["Holding", "HR Admin", "Finance"] },
  ];

  return (
    <AuthenticatedLayout
      title="Karyawan & Akses"
      subtitle={`${employees.total || employees.data.length} akun terdaftar · ${metrics?.active || 0} aktif`}
      actions={
        <Button
          className="rounded-xl"
          onClick={() => {
            setEditingEmployee(null);
            setFormOpen(true);
          }}
        >
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Tambah Karyawan</span>
        </Button>
      }
    >
      <Head title="Karyawan & Akses" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* KOLOM KIRI: DAFTAR KARYAWAN */}
        <div className="card-soft p-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <p className="text-sm font-extrabold text-foreground">
              Daftar Karyawan
            </p>

            <Tabs
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus(val);
                handleFilter({ status: val });
              }}
            >
              <TabsList className="rounded-xl h-8">
                <TabsTrigger value="all" className="text-xs px-2.5">
                  Semua
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs px-2.5">
                  Aktif
                </TabsTrigger>
                <TabsTrigger value="probation" className="text-xs px-2.5">
                  Probation
                </TabsTrigger>
                <TabsTrigger value="inactive" className="text-xs px-2.5">
                  Nonaktif
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              placeholder="Cari nama, NIK, atau email..."
              className="rounded-xl bg-muted/50 border-transparent text-xs h-9 pl-9"
            />
          </div>

          {/* List items */}
          <div className="space-y-2">
            {employees.data.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Tidak ada data karyawan yang cocok.
              </div>
            ) : (
              employees.data.map((emp) => (
                <div
                  key={emp.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/50 p-3 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                        {getInitials(emp.nama_lengkap)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <button
                        onClick={() => {
                          setActiveEmployee(emp);
                          setSheetOpen(true);
                        }}
                        className="truncate text-sm font-bold text-left hover:text-primary transition-colors block text-foreground"
                      >
                        {emp.nama_lengkap}
                      </button>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {emp.email || "Tanpa email"} · {emp.nik} ·{" "}
                        {emp.designation?.title || "Staff"} ·{" "}
                        {emp.department?.name || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-[10px]"
                    >
                      {emp.status_kerja}
                    </Badge>

                    <Switch
                      checked={emp.is_active}
                      onCheckedChange={() => handleToggleActive(emp)}
                      aria-label={`Toggle active for ${emp.nama_lengkap}`}
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-soft">
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveEmployee(emp);
                            setSheetOpen(true);
                          }}
                          className="cursor-pointer text-xs"
                        >
                          <Eye className="mr-2 size-3.5" /> Detail Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingEmployee(emp);
                            setFormOpen(true);
                          }}
                          className="cursor-pointer text-xs"
                        >
                          <Edit className="mr-2 size-3.5" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeletingEmployee(emp);
                            setDeleteConfirmOpen(true);
                          }}
                          className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-3.5" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {employees.links && employees.links.length > 3 && (
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Total {employees.total} karyawan
              </span>
              <div className="flex items-center gap-1">
                {employees.links.map((link, idx) => (
                  <button
                    key={idx}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      link.active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted disabled:opacity-40"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: MATRIKS IZIN PERAN */}
        <div className="card-soft p-4 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-4.5 text-primary" />
            <p className="text-sm font-extrabold text-foreground">
              Matriks Izin Peran
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-36 text-xs">Wewenang</TableHead>
                  {roles.map((r) => (
                    <TableHead key={r} className="text-center text-[10px] px-1">
                      {r}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="text-xs font-semibold py-2.5">
                      {row.name}
                    </TableCell>
                    {roles.map((r) => (
                      <TableCell key={r} className="text-center py-2.5 px-1">
                        {row.roles.includes(r) ? (
                          <Check className="mx-auto size-4 text-success" />
                        ) : (
                          <X className="mx-auto size-4 text-muted-foreground/50" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Perubahan izin peran langsung berlaku pada sesi akun yang sedang aktif.
          </p>
        </div>
      </div>

      {/* DETAIL SHEET */}
      <EmployeeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        employee={activeEmployee}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setFormOpen(true);
        }}
      />

      {/* ADD / EDIT MODAL */}
      <EmployeeFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editingEmployee}
        departments={departments}
        branches={branches}
        designations={designations}
      />

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-base text-foreground">
              Hapus Karyawan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus data karyawan{" "}
              <strong>{deletingEmployee?.nama_lengkap}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
