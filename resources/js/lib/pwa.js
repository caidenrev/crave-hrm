import { useSyncExternalStore } from "react";

let installStatus = "tidak"; // "tidak" | "bisa" | "terpasang" | "ios"
let deferredPrompt = null;
const listeners = new Set();

function notify(status) {
  installStatus = status;
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const isIos =
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

  installStatus = isStandalone ? "terpasang" : isIos ? "ios" : "tidak";

  // Tangkap event sebelum React mount agar tidak terlewat
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify("bisa");
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify("terpasang");
    // Setelah PWA di-install, otomatis arahkan langsung ke form login / registrasi (jangan di landing)
    if (typeof window !== "undefined") {
      const isLanding = window.location.pathname === "/" || window.location.pathname === "/landing";
      if (isLanding) {
        window.location.replace("/login");
      }
    }
  });

  // Daftarkan service worker minimal seperti sistem SIBK
  if ("serviceWorker" in window.navigator) {
    const registerSW = () => {
      window.navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW, { once: true });
    }
  }
}

/**
 * Hook reaktif untuk memantau status instalasi PWA:
 * Returns: "bisa" | "terpasang" | "ios" | "tidak"
 */
export function usePwaStatus() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => installStatus,
    () => "tidak"
  );
}

/**
 * Panggil native install prompt peramban (Chrome / Edge / Android)
 * Mengembalikan true jika pengguna menyetujui, false jika batal atau belum tersedia
 */
export async function promptPwaInstall() {
  if (!deferredPrompt) {
    return false;
  }
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  await promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  notify(outcome === "accepted" ? "terpasang" : "tidak");

  if (outcome === "accepted") {
    // Segera arahkan pengguna ke form login / registrasi setelah menerima instalasi PWA
    setTimeout(() => {
      window.location.replace("/login");
    }, 300);
    return true;
  }

  return false;
}

/**
 * Dapatkan instance event deferredPrompt aktif jika ada
 */
export function getDeferredPrompt() {
  return deferredPrompt;
}
