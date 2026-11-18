import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { router } from "@inertiajs/react";

// Daftarkan ScrollToPlugin GSAP untuk animasi scroll berbasis GPU / RAF
if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(ScrollToPlugin);
  } catch (e) {
    console.warn("[SmoothScroll] GSAP ScrollToPlugin registration skipped:", e);
  }
}

/**
 * Menghitung offset navbar dinamis sesuai ukuran layar.
 * Di desktop (>= 640px) tinggi navbar + floating padding ~ 84px - 90px.
 * Di mobile (< 640px) ~ 72px.
 */
export function getNavbarOffset() {
  if (typeof window === "undefined") return 88;
  return window.innerWidth >= 640 ? 88 : 72;
}

/**
 * Smoothly scroll ke elemen target, selector, atau posisi pixel.
 *
 * @param {string|HTMLElement|number} target - Selector misal '#fitur', DOM element, atau koordinat Y
 * @param {Object} options - Konfigurasi opsional (offset, duration, onComplete)
 */
export function smoothScrollTo(target, options = {}) {
  if (typeof window === "undefined") return;

  // Jika user menyalakan mode prefers-reduced-motion, gunakan scroll instan
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = options.offset !== undefined ? options.offset : getNavbarOffset();
  const duration = prefersReducedMotion ? 0 : (options.duration || 0.85);

  let targetElement = null;
  let targetY = 0;

  if (typeof target === "number") {
    targetY = Math.max(0, target - offset);
  } else if (typeof target === "string") {
    if (target.startsWith("#")) {
      targetElement = document.querySelector(target);
      if (!targetElement) {
        // Jika target id tidak ada di halaman saat ini (misal di halaman /careers),
        // arahkan ke homepage dengan hash bersangkutan
        if (window.location.pathname !== "/") {
          router.visit(`/${target}`);
        }
        return;
      }
    } else {
      targetElement = document.querySelector(target);
    }
  } else if (target instanceof HTMLElement) {
    targetElement = target;
  }

  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    targetY = window.pageYOffset + rect.top - offset;
  }

  // Batasi targetY agar tidak melebihi batas bawah dokumen
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  targetY = Math.min(Math.max(0, targetY), maxScroll);

  // Jika GSAP tersedia dan tidak dalam prefers-reduced-motion
  if (!prefersReducedMotion && typeof gsap !== "undefined" && gsap.to) {
    try {
      gsap.to(window, {
        duration: duration,
        scrollTo: {
          y: targetY,
          autoKill: true, // Berhenti jika user melakukan scroll manual
        },
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (options.onComplete) options.onComplete();
          if (typeof target === "string" && target.startsWith("#")) {
            try {
              window.history.pushState(null, "", target);
            } catch (_) {}
          }
        },
      });
      return;
    } catch (e) {
      // Fallback ke native/custom RAF jika plugin GSAP gagal
    }
  }

  // Fallback: Programmatic cubic-bezier RAF easing
  if (prefersReducedMotion || duration === 0) {
    window.scrollTo({ top: targetY, behavior: "auto" });
    if (typeof target === "string" && target.startsWith("#")) {
      try {
        window.history.pushState(null, "", target);
      } catch (_) {}
    }
    if (options.onComplete) options.onComplete();
    return;
  }

  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();
  const animDuration = duration * 1000;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / animDuration, 1);
    const easeProgress = easeOutCubic(progress);

    window.scrollTo(0, startY + distance * easeProgress);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
      if (typeof target === "string" && target.startsWith("#")) {
        try {
          window.history.pushState(null, "", target);
        } catch (_) {}
      }
      if (options.onComplete) options.onComplete();
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * Inisialisasi Smooth Scroll Global:
 * 1. Menangani klik pada tautan anchor internal (href="#...") secara terpusat dengan offset akurat.
 * 2. Mengatasi hash URL saat halaman dimuat (misal tiba dari halaman lain ke /#fitur).
 * 3. Menghindari glitch scroll glide saat transisi halaman Inertia dengan mematikan smooth scroll sejenak.
 */
let isInitialized = false;

export function initSmoothScroll() {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  // 1. Delegated click listener untuk semua anchor link internal
  document.addEventListener("click", (e) => {
    // Cari elemen <a> terdekat
    const anchor = e.target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    // Abaikan jika buka tab baru atau download
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    // Anchor hash lokal (#fitur, dll)
    if (href.startsWith("#") && href.length > 1) {
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(targetEl);
      }
    }
    // Anchor lintas halaman yang mengarah ke home hash (/#fitur, dll)
    else if (href.startsWith("/#") && window.location.pathname === "/") {
      const targetHash = href.replace("/", "");
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(targetEl);
      }
    }
  });

  // 2. Tangani hash di URL saat halaman pertama kali selesai dimuat
  if (window.location.hash) {
    const initialTarget = window.location.hash;
    setTimeout(() => {
      const targetEl = document.querySelector(initialTarget);
      if (targetEl) {
        smoothScrollTo(targetEl, { duration: 0.6 });
      }
    }, 150);
  }

  // 3. Optimasi Transisi Halaman Inertia:
  // Ketika berpindah rute di Inertia, matikan smooth scroll sementara agar halaman baru
  // langsung berada di posisi puncak / posisi tersimpan tanpa efek melayang yang lambat.
  if (typeof router !== "undefined" && router.on) {
    router.on("start", () => {
      document.documentElement.classList.add("instant-scroll");
    });

    router.on("finish", () => {
      // Kembalikan smooth scroll setelah render selesai
      setTimeout(() => {
        document.documentElement.classList.remove("instant-scroll");
      }, 50);
    });
  }
}
