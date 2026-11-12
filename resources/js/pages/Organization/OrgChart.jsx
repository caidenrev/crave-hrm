import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
  Network,
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Shield,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrgChart({ company = {}, departments = [], stats = {} }) {
  const [expandedDepts, setExpandedDepts] = useState(
    departments.reduce((acc, d) => ({ ...acc, [d.id]: true }), {})
  );

  const toggleDept = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const expandAll = () => {
    setExpandedDepts(departments.reduce((acc, d) => ({ ...acc, [d.id]: true }), {}));
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  return (
    <AuthenticatedLayout
      title="Struktur Organisasi"
      subtitle="Bagan hierarki departemen, divisi, dan susunan talenta dalam entitas perusahaan"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="rounded-xl text-xs font-semibold"
          >
            Buka Semua
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="rounded-xl text-xs font-semibold"
          >
            Tutup Semua
          </Button>
        </div>
      }
    >
      <Head title="Struktur Organisasi" />

      {/* 1. TOP METRICS CARDS (Dashboard-Consistent Signature Look) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 mb-6">
        {/* Card 0: Hero Card (Entitas Perusahaan) */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary">
          <div className="flex items-start justify-between gap-2">
            <span className="text-white">
              <Building2 className="size-5 sm:size-6" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              <Sparkles className="size-3" />
              {company.is_holding ? "Holding" : "Subsidiary"}
            </span>
          </div>
          <div className="mt-4">
            <p
              title={company.name || "Perusahaan Aktif"}
              className="text-base sm:text-lg font-black tracking-tight text-white leading-tight break-words"
            >
              {company.name || "Perusahaan Aktif"}
            </p>
            <p className="text-[12px] font-medium mt-1 text-primary-foreground/85">
              {company.tax_id ? `NPWP: ${company.tax_id}` : "Entitas Bisnis Aktif"}
            </p>
          </div>
        </div>

        {/* Card 1: Total Departemen / Divisi */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Layers className="size-5 sm:size-6 text-primary" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-success">
              <ArrowUpRight className="size-4" />
              Aktif
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.total_departments ?? departments.length}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Departemen / Divisi
            </p>
          </div>
        </div>

        {/* Card 2: Standar Jabatan */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Briefcase className="size-5 sm:size-6 text-blue-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-blue-600">
              <ArrowUpRight className="size-4" />
              Level
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.total_designations ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Struktur Jabatan
            </p>
          </div>
        </div>

        {/* Card 3: Karyawan Terpenempatan */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground">
              <Users className="size-5 sm:size-6 text-emerald-600" />
            </span>
            <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-600">
              <ArrowUpRight className="size-4" />
              Terisi
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-foreground">
              {stats.total_employees ?? 0}
            </p>
            <p className="text-[13px] font-medium mt-0.5 text-muted-foreground">
              Karyawan Terpenempatan
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchy Tree Visualization */}
      <div className="space-y-6">
        {/* Root Company Node */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border-2 border-primary bg-primary text-primary-foreground p-5 shadow-md max-w-lg w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-primary-foreground/90" />
              <h2 className="text-lg font-black tracking-tight">
                {company.name || "Crave Group Holding"}
              </h2>
            </div>
            <p className="text-xs text-primary-foreground/80">
              {company.is_holding ? "Holding Company & Ekosistem Utama" : "Entitas Anak Perusahaan"}
            </p>
            {company.tax_id && (
              <Badge variant="outline" className="mt-2 text-[10px] border-primary-foreground/30 text-primary-foreground">
                NPWP: {company.tax_id}
              </Badge>
            )}
          </div>

          {/* Central Stem Line */}
          <div className="h-8 w-0.5 bg-border mt-0" />
        </div>

        {/* Departments Tier */}
        {departments.length === 0 ? (
          <Card className="rounded-2xl border border-dashed border-border p-12 text-center bg-card max-w-lg mx-auto">
            <Layers className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <h4 className="text-base font-bold text-foreground">Belum ada departemen</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Belum ada departemen atau divisi yang terdaftar pada perusahaan ini.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {departments.map((dept) => {
              const isExpanded = Boolean(expandedDepts[dept.id]);
              const employees = dept.employees || [];

              return (
                <div key={dept.id} className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
                  {/* Department Node Header */}
                  <div
                    onClick={() => toggleDept(dept.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg bg-card border border-border/70 flex items-center justify-center text-foreground hover:bg-muted"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black tracking-tight text-foreground">
                            {dept.name}
                          </h3>
                          {dept.code && (
                            <Badge variant="outline" className="text-[10px] font-bold rounded-md">
                              {dept.code}
                            </Badge>
                          )}
                        </div>
                        {dept.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {dept.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground bg-card border border-border/70 px-2.5 py-1 rounded-full">
                        {employees.length} Anggota Tim
                      </span>
                    </div>
                  </div>

                  {/* Employees Card Grid within Department */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-background/50">
                      {employees.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-4">
                          Belum ada karyawan aktif yang ditempatkan pada departemen ini.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {employees.map((emp) => {
                            const initials = emp.nama_lengkap
                              ? emp.nama_lengkap.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                              : "EM";

                            return (
                              <div
                                key={emp.id}
                                className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3"
                              >
                                <Avatar className="h-10 w-10 rounded-xl border border-border/60 shrink-0">
                                  <AvatarImage src={emp.avatar_url} />
                                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-foreground truncate">
                                    {emp.nama_lengkap}
                                  </p>
                                  <p className="text-[11px] font-semibold text-primary truncate mt-0.5">
                                    {emp.designation?.title || emp.designation?.name || "Karyawan"}
                                  </p>

                                  <div className="mt-2 space-y-1 text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                                    {emp.branch && (
                                      <div className="flex items-center gap-1.5 truncate">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{emp.branch.name}</span>
                                      </div>
                                    )}
                                    {emp.email && (
                                      <div className="flex items-center gap-1.5 truncate">
                                        <Mail className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{emp.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
