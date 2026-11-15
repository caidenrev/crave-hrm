import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Global helper to trigger toasts imperatively from anywhere in frontend code:
 * window.craveToast.success("Pesan berhasil");
 * window.craveToast.error("Pesan error");
 */
if (typeof window !== "undefined") {
  window.craveToast = {
    success: (message, title = "Berhasil") => {
      window.dispatchEvent(
        new CustomEvent("crave:notify", {
          detail: { type: "success", title, message },
        })
      );
    },
    error: (message, title = "Terjadi Kesalahan") => {
      window.dispatchEvent(
        new CustomEvent("crave:notify", {
          detail: { type: "error", title, message },
        })
      );
    },
    info: (message, title = "Informasi") => {
      window.dispatchEvent(
        new CustomEvent("crave:notify", {
          detail: { type: "info", title, message },
        })
      );
    },
  };
}

export function ToastNotification() {
  const { flash, errors } = usePage().props;
  const [toasts, setToasts] = useState([]);

  // Add toast helper
  const addToast = (type, title, message) => {
    if (!message) return;
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen to Inertia Flash Messages
  useEffect(() => {
    if (flash?.success) {
      addToast("success", "Berhasil", flash.success);
    }
    if (flash?.error) {
      addToast("error", "Terjadi Kesalahan", flash.error);
    }
  }, [flash]);

  // Listen to Inertia Validation Errors if error key is present
  useEffect(() => {
    if (errors?.error) {
      addToast("error", "Peringatan Sistem", errors.error);
    }
  }, [errors]);

  // Listen to imperative window events
  useEffect(() => {
    const handleEvent = (e) => {
      if (e.detail) {
        addToast(e.detail.type || "info", e.detail.title || "Pemberitahuan", e.detail.message);
      }
    };
    window.addEventListener("crave:notify", handleEvent);
    return () => window.removeEventListener("crave:notify", handleEvent);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-soft bg-card backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-3",
              isSuccess && "border-emerald-500/30 text-card-foreground shadow-emerald-500/5",
              isError && "border-rose-500/30 text-card-foreground shadow-rose-500/5",
              !isSuccess && !isError && "border-primary/30 text-card-foreground shadow-primary/5"
            )}
          >
            {/* Status Icon */}
            <div
              className={cn(
                "size-8 rounded-xl flex items-center justify-center shrink-0",
                isSuccess && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isError && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                !isSuccess && !isError && "bg-primary/10 text-primary"
              )}
            >
              {isSuccess && <CheckCircle2 className="size-4.5" />}
              {isError && <AlertCircle className="size-4.5" />}
              {!isSuccess && !isError && <Info className="size-4.5" />}
            </div>

            {/* Content Text */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="text-xs font-black tracking-tight text-foreground">
                {toast.title}
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground/60 hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer shrink-0 -mr-1"
              title="Tutup pemberitahuan"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

