import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Check,
  X,
  Save,
  RotateCcw,
} from "lucide-react";

export default function RbacMatrix({ roles, modules }) {
  const [matrixState, setMatrixState] = useState(() => {
    const initial = {};
    modules.forEach((group) => {
      group.items.forEach((item) => {
        initial[item.key] = { ...item.matrix };
      });
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (itemKey, roleId) => {
    if (roleId === "super_admin") return;

    setMatrixState((prev) => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [roleId]: !prev[itemKey]?.[roleId],
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    const initial = {};
    modules.forEach((group) => {
      group.items.forEach((item) => {
        initial[item.key] = { ...item.matrix };
      });
    });
    setMatrixState(initial);
  };

  return (
    <AuthenticatedLayout
      title="Matriks Izin Peran"
      subtitle="Konfigurasi izin akses granular antar 5 peran dan modul operasional"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl text-xs"
          >
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="rounded-xl text-xs"
          >
            <Save className="size-3.5 mr-1" />
            {savedSuccess ? "Tersimpan" : "Simpan"}
          </Button>
        </div>
      }
    >
      <Head title="Matriks Izin Peran" />

      <div className="space-y-4">
        {/* Security Banner */}
        <div className="flex items-start gap-3 rounded-2xl border bg-muted/50 p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">
              Prinsip Pemisahan Wewenang (Zero Trust Multi-Tenancy)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Perubahan izin langsung berlaku seketika untuk pengguna dengan peran bersangkutan pada perusahaan aktif.
            </p>
          </div>
        </div>

        {/* Roles Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {roles.map((r) => (
            <div key={r.id} className="card-soft p-3">
              <Badge variant="secondary" className="rounded-full text-[10px] mb-1">
                {r.badge}
              </Badge>
              <p className="text-xs font-bold text-foreground truncate">{r.name}</p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                {r.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Matrix Table */}
        <div className="card-soft p-4 min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-48 text-xs">Modul & Hak Akses</TableHead>
                {roles.map((r) => (
                  <TableHead key={r.id} className="text-center text-xs">
                    {r.name.split(" ")[0]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <TableRow className="bg-muted/40 border-y">
                    <TableCell
                      colSpan={roles.length + 1}
                      className="py-2 px-3 text-xs font-extrabold uppercase text-muted-foreground"
                    >
                      {group.group}
                    </TableCell>
                  </TableRow>
                  {group.items.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="py-2.5 px-3">
                        <p className="text-xs font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.description}
                        </p>
                      </TableCell>
                      {roles.map((role) => {
                        const isChecked = matrixState[item.key]?.[role.id] ?? false;
                        const isSuperAdmin = role.id === "super_admin";

                        return (
                          <TableCell key={role.id} className="text-center py-2.5">
                            {isSuperAdmin ? (
                              <Check className="mx-auto size-4 text-success" />
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggle(item.key, role.id)}
                                className="mx-auto p-1 rounded hover:bg-muted"
                                aria-label={`Toggle ${item.key} for ${role.id}`}
                              >
                                {isChecked ? (
                                  <Check className="size-4 text-success" />
                                ) : (
                                  <X className="size-4 text-muted-foreground/40" />
                                )}
                              </button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
