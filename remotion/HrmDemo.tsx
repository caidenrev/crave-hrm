import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HRM_DEMO_DURATION = 750; // 25 detik @ 30 FPS

type SceneConfig = {
  id: string;
  image: string;
  url: string;
  tag: string;
  title: string;
  subtitle: string;
  focusX: number;
  focusY: number;
  maxZoom: number;
  tiltX: number;
  tiltY: number;
};

const SCENES: SceneConfig[] = [
  {
    id: "dashboard",
    image: "showcase/01_dashboard_utama.png",
    url: "hrm.craveservices.my.id/dashboard",
    tag: "EXECUTIVE COCKPIT",
    title: "Executive Dashboard & Bento KPI",
    subtitle: "Pemantauan real-time sisa cuti, kehadiran tepat waktu, lembur, dan payroll dalam satu layar.",
    focusX: 52,
    focusY: 28,
    maxZoom: 1.4,
    tiltX: 3,
    tiltY: -4,
  },
  {
    id: "karyawan",
    image: "showcase/02_manajemen_karyawan.png",
    url: "hrm.craveservices.my.id/employees",
    tag: "MULTI-TENANCY DIRECTORY",
    title: "Manajemen Karyawan & Multi-Company",
    subtitle: "Struktur organisasi anak perusahaan, jabatan, departemen, dan data master karyawan terenkripsi.",
    focusX: 45,
    focusY: 45,
    maxZoom: 1.35,
    tiltX: -2,
    tiltY: 3,
  },
  {
    id: "presensi",
    image: "showcase/03_presensi_gps.png",
    url: "hrm.craveservices.my.id/attendance",
    tag: "SMART ATTENDANCE",
    title: "Presensi GPS Geofencing & Selfie",
    subtitle: "Validasi radius kantor presisi, proteksi anti-mock location, dan integrasi shift dinamis.",
    focusX: 58,
    focusY: 42,
    maxZoom: 1.45,
    tiltX: 4,
    tiltY: -3,
  },
  {
    id: "payroll",
    image: "showcase/04_payroll_pph21.png",
    url: "hrm.craveservices.my.id/payroll",
    tag: "REGULATION COMPLIANT",
    title: "Kalkulasi Payroll & PPh 21 TER 2024",
    subtitle: "Otomatisasi PPh 21 TER (Kategori A/B/C), BPJS Ketenagakerjaan & Kesehatan, serta lembur PP 35/2021.",
    focusX: 50,
    focusY: 52,
    maxZoom: 1.4,
    tiltX: 2,
    tiltY: 4,
  },
  {
    id: "klaim",
    image: "showcase/06_reimbursement_klaim.png",
    url: "hrm.craveservices.my.id/claims",
    tag: "DIGITAL CLAIMS",
    title: "Klaim, Lembur & Reimbursement",
    subtitle: "Alur persetujuan bertingkat dengan pratinjau bukti struk kuitansi dan pencairan otomatis.",
    focusX: 48,
    focusY: 40,
    maxZoom: 1.35,
    tiltX: -3,
    tiltY: -2,
  },
];

const SCENE_DURATION = 130;
const INTRO_DURATION = 50;
const OUTRO_START = 690;

export function HrmDemo({ vertical = false }: { vertical?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, HRM_DEMO_DURATION], [1, 1.15]);
  const blobX = Math.sin((frame / fps) * 0.4) * 80;
  const blobY = Math.cos((frame / fps) * 0.4) * 60;

  const introOpacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const introScale = interpolate(frame, [0, 60], [0.85, 1.08]);

  const isOutro = frame >= OUTRO_START;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c15",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 1. Ambient Background Lighting */}
      <AbsoluteFill
        style={{
          transform: "scale(" + bgScale + ")",
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "calc(15% + " + blobY + "px)",
            left: "calc(20% + " + blobX + "px)",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(27, 92, 254, 0.28) 0%, rgba(79, 70, 229, 0.08) 50%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "calc(10% - " + blobY + "px)",
            right: "calc(15% - " + blobX + "px)",
            width: 1000,
            height: 1000,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)",
            backgroundSize: "36px 36px",
            opacity: 0.55,
            maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
          }}
        />
      </AbsoluteFill>

      {/* 2. Intro Sequence */}
      {frame < 65 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: introOpacity,
            transform: "scale(" + introScale + ")",
            zIndex: 100,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 32,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), 0 0 60px rgba(27, 92, 254, 0.35)",
              marginBottom: 28,
            }}
          >
            <Img
              src={staticFile("light-mode-logo.png")}
              style={{
                width: vertical ? 110 : 130,
                height: vertical ? 110 : 130,
                objectFit: "contain",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: vertical ? 54 : 76,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              background: "linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Crave HRM
          </h1>
          <p
            style={{
              fontSize: vertical ? 20 : 26,
              color: "#94a3b8",
              fontWeight: 600,
              margin: "12px 0 0 0",
              letterSpacing: "-0.01em",
            }}
          >
            Enterprise Human Resource Management Platform
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(27, 92, 254, 0.2)",
              border: "1px solid rgba(27, 92, 254, 0.4)",
              borderRadius: 999,
              padding: "8px 24px",
              fontSize: 14,
              fontWeight: 700,
              color: "#60a5fa",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            100% Kepatuhan Regulasi Indonesia
          </div>
        </AbsoluteFill>
      )}

      {/* 3. Main Showcase Stages (Cinematic Zoom In & Zoom Out) */}
      {!isOutro &&
        SCENES.map((scene, idx) => {
          const sceneStart = INTRO_DURATION + idx * (SCENE_DURATION - 15);
          const sceneEnd = sceneStart + SCENE_DURATION;

          if (frame < sceneStart - 10 || frame > sceneEnd + 10) return null;

          const localFrame = frame - sceneStart;

          const sceneOpacity = interpolate(
            localFrame,
            [0, 15, SCENE_DURATION - 15, SCENE_DURATION],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Dynamic Zoom In and Zoom Out Camera Motion:
          // 0 -> 30% of scene duration: Zoom In smoothly (1.0 -> maxZoom)
          // 30% -> 70% of scene duration: Slow subtle drift while zoomed in
          // 70% -> 100% of scene duration: Zoom Out smoothly back to 1.05
          const cameraZoom = interpolate(
            localFrame,
            [0, SCENE_DURATION * 0.3, SCENE_DURATION * 0.7, SCENE_DURATION],
            [1.0, scene.maxZoom, scene.maxZoom * 1.03, 1.05],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const panProgress = interpolate(
            localFrame,
            [0, SCENE_DURATION * 0.3, SCENE_DURATION * 0.7, SCENE_DURATION],
            [0, 1, 1.2, 0.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const offsetX = (50 - scene.focusX) * (cameraZoom - 1) * panProgress * (vertical ? 4 : 6);
          const offsetY = (50 - scene.focusY) * (cameraZoom - 1) * panProgress * (vertical ? 3 : 4);

          const tiltProgress = Math.sin((localFrame / SCENE_DURATION) * Math.PI);
          const currentTiltX = scene.tiltX * (1 - tiltProgress * 0.6);
          const currentTiltY = scene.tiltY * (1 - tiltProgress * 0.6);

          return (
            <AbsoluteFill
              key={scene.id}
              style={{
                opacity: sceneOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                perspective: 2000,
              }}
            >
              {/* Scene Title Header */}
              <div
                style={{
                  position: "absolute",
                  top: vertical ? 90 : 50,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 30,
                  textAlign: "center",
                  padding: "0 24px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(27, 92, 254, 0.25)",
                    border: "1px solid rgba(27, 92, 254, 0.4)",
                    borderRadius: 999,
                    padding: "6px 18px",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#93c5fd",
                    letterSpacing: "0.1em",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      boxShadow: "0 0 10px #3b82f6",
                    }}
                  />
                  {scene.tag}
                </div>
                <h2
                  style={{
                    fontSize: vertical ? 34 : 44,
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: "-0.03em",
                    textShadow: "0 4px 24px rgba(0,0,0,0.6)",
                  }}
                >
                  {scene.title}
                </h2>
                <p
                  style={{
                    fontSize: vertical ? 15 : 18,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    margin: "8px 0 0 0",
                    maxWidth: vertical ? 800 : 960,
                    lineHeight: 1.4,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {scene.subtitle}
                </p>
              </div>

              {/* Realistic Web Window with Zoom In / Out Screen */}
              <div
                style={{
                  width: vertical ? "92%" : "82%",
                  maxWidth: 1540,
                  marginTop: vertical ? 130 : 90,
                  borderRadius: 24,
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  boxShadow:
                    "0 30px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 70px rgba(27, 92, 254, 0.25)",
                  transform: "rotateX(" + currentTiltX + "deg) rotateY(" + currentTiltY + "deg)",
                  transformOrigin: "center center",
                }}
              >
                {/* Browser macOS Top Bar */}
                <div
                  style={{
                    height: 44,
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#eab308" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e" }} />
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "4px 20px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span style={{ color: "#10b981", fontSize: 13 }}>🔒</span>
                    https://{scene.url}
                  </div>
                  <div style={{ width: 50 }} />
                </div>

                {/* Dashboard Image with Zoom and Pan */}
                <div
                  style={{
                    width: "100%",
                    height: vertical ? 980 : 700,
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Img
                    src={staticFile(scene.image)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      transform: "scale(" + cameraZoom + ") translate(" + offsetX + "px, " + offsetY + "px)",
                      transformOrigin: scene.focusX + "% " + scene.focusY + "%",
                    }}
                  />
                </div>
              </div>
            </AbsoluteFill>
          );
        })}

      {/* 4. Outro Sequence */}
      {isOutro && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [OUTRO_START, OUTRO_START + 20], [0, 1]),
            transform: "scale(" + interpolate(frame, [OUTRO_START, HRM_DEMO_DURATION], [0.92, 1.02]) + ")",
            zIndex: 110,
          }}
        >
          <div
            style={{
              padding: 24,
              borderRadius: 36,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(27, 92, 254, 0.4)",
              marginBottom: 30,
            }}
          >
            <Img
              src={staticFile("light-mode-logo.png")}
              style={{
                width: vertical ? 120 : 140,
                height: vertical ? 120 : 140,
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: vertical ? 58 : 84,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              background: "linear-gradient(135deg, #ffffff 40%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Crave HRM
          </h1>

          <p
            style={{
              fontSize: vertical ? 22 : 30,
              color: "#94a3b8",
              fontWeight: 700,
              margin: "16px 0 32px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Modernizing HR Operations Across Indonesia
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#1b5cfe",
              boxShadow: "0 10px 40px rgba(27, 92, 254, 0.5)",
              borderRadius: 20,
              padding: "16px 38px",
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            hrm.craveservices.my.id
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              marginTop: 24,
              fontWeight: 600,
            }}
          >
            Built with Laravel 13 · Inertia.js · React 19 · Tailwind CSS v4
          </p>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
