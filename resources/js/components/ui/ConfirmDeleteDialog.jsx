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
import { Trash2 } from "lucide-react";

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Hapus",
  description = "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?",
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onConfirm,
  loading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-sm p-5 border border-border/70 shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <Trash2 className="size-4" />
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
            className="rounded-xl text-xs font-semibold h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Menghapus..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDeleteDialog;

