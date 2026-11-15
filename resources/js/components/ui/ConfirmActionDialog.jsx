import React from "react";
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
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Aksi",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  loading = false,
  variant = "primary", // primary | warning | destructive | success
  icon: Icon = Lock,
}) {
  const iconColors = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };

  const buttonColors = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    warning: "bg-amber-600 text-white hover:bg-amber-700",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:rounded-2xl sm:max-w-sm p-5 border border-border/70 shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "size-10 rounded-xl flex items-center justify-center shrink-0",
                iconColors[variant] || iconColors.primary
              )}
            >
              <Icon className="size-5" />
            </div>
            <AlertDialogTitle className="font-extrabold text-base text-foreground leading-snug">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-xl text-xs font-semibold h-9"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
            className={cn(
              "rounded-xl text-xs font-semibold h-9 transition-colors",
              buttonColors[variant] || buttonColors.primary
            )}
          >
            {loading ? "Memproses..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

