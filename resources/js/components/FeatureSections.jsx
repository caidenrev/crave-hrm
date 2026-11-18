import { useEffect, useId, useState } from "react";

const payroll = "/icons/crave-icon-payroll.svg";
const attendance = "/icons/crave-icon-attendance.svg";
const kantin = "/icons/crave-icon-kantin.svg";
const cuti = "/icons/crave-icon-cuti.svg";
const lembur = "/icons/crave-icon-lembur.svg";
const rekrut = "/icons/crave-icon-rekrut.svg";

/* ---------- Data 6 Fitur Utama ---------- */
export const FEATURES = [
  {
    id: "payroll",
    icon: payroll,
    title: "Payroll & PPh 21 TER 2024",
    chip: "Resmi PP 58/2023",
    desc: "Kalkulasi tarif efektif rata-rata (TER Kategori A, B, C) terintegrasi otomatis dengan split iuran BPJS Kesehatan (4%:1%) dan BPJS Ketenagakerjaan tanpa rumus Excel manual.",
    metric: "0 Kesalahan Hitung Pajak",
  },
  {
    id: "attendance",
    icon: attendance,
    title: "Smart Attendance Geofence",
    chip: "Anti-Fake GPS",
    desc: "Presensi mobile selfie dengan radius koordinat presisi tinggi dan verifikasi IP publik kantor cabang. Mencegah manipulasi lokasi dan titip absen secara real-time.",
    metric: "99.8% Presisi Radius Lokasi",
  },
  {
    id: "kantin",
    icon: kantin,
    title: "Kantin Sehat Digital & QR Pass",
    chip: "TTL 60 Detik",
    desc: "Token voucher makan digital berbasis algoritma HMAC-SHA256 yang berganti setiap 60 detik. Anti-screenshot dan tervalidasi cepat oleh kasir kantin dalam 0.3 detik.",
    metric: "< 0.5s Scan Kasir Merchant",
  },
  {
    id: "cuti",
    icon: cuti,
    title: "Cuti & Izin SKB 3 Menteri",
    chip: "Kalender Resmi",
    desc: "Otomasi saldo cuti tahunan, sinkronisasi kalender hari libur nasional serta cuti bersama pemerintah. Alur persetujuan digital berjenjang atasan langsung dan HRD.",
    metric: "Approval Cepat 1-Klik",
  },
  {
    id: "lembur",
    icon: lembur,
    title: "Lembur PP 35/2021",
    chip: "Formula 1/173",
    desc: "Penetapan upah lembur resmi berbasis 1/173 upah sebulan dengan penggandaan proporsional: 1.5× untuk jam pertama dan 2× untuk jam kerja berikutnya.",
    metric: "Kepatuhan Hukum 100%",
  },
  {
    id: "rekrut",
    icon: rekrut,
    title: "E-Recruitment & ATS Pipeline",
    chip: "6-Tahap Kanban",
    desc: "Portal karir publik, seleksi berkas pelamar dalam papan Kanban intuitif, scorecard wawancara timbal balik, hingga tombol saklar Onboard to Employee dalam 1 klik.",
    metric: "Siklus Rekrutmen 2× Lebih Cepat",
  },
];

const ON_TIME = [
  { day: "Sen", value: 42 },
  { day: "Sel", value: 74 },
  { day: "Rab", value: 60 },
  { day: "Kam", value: 100, active: true },
  { day: "Jum", value: 86 },
];

/* ---------- Ikon Pembantu ---------- */
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" stroke="#12A150" strokeWidth="1.6" />
    <path d="M5.5 9.2l2.4 2.4 4.6-4.9" stroke="#12A150" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="fs-go" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QrIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
    <path d="M10 10h1.5M13.5 10v1.5M10 13.5h4" />
  </svg>
);

/* 3D SVG Icon dipasang sebagai <img> dengan alt="" */
const Icon3D = ({ src, size }) => (
  <div className="fs-ico">
    <img src={src} alt="" width={size} height={size} />
  </div>
);

/* ---------- 1) Grid 6 Fitur ---------- */
export function FeatureGrid({ features = FEATURES }) {
  return (
    <div className="fs-root" aria-label="Fitur utama">
      <div className="fs-feats">
        {features.map((f) => (
          <article className="fs-feat" key={f.id}>
            <div className="fs-top">
              <Icon3D src={f.icon} size={88} />
              <span className="fs-chip">{f.chip}</span>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <div className="fs-foot">
              <CheckIcon />
              <span>{f.metric}</span>
              <ArrowIcon />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------- 2) Bento Fitur Unggulan (2 Kartu Biru Muda, 1 Kartu Biru Bold) ---------- */
function useVoucherCountdown(start = 28) {
  const [t, setT] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v <= 1 ? 60 : v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function FeatureBento() {
  const seconds = useVoucherCountdown(28);
  const gid = useId().replace(/:/g, "");

  return (
    <div className="fs-root" aria-label="Fitur unggulan">
      <div className="fs-bento">
        {/* Kolom Kiri: Dua Kartu Biru Muda */}
        <div className="fs-bl">
          {/* Kartu 1: Presensi GPS */}
          <article className="fs-bc">
            <div>
              <Icon3D src={attendance} size={72} />
              <div className="fs-eb">Anti-titip absen</div>
              <h3>Presensi GPS & Whitelist IP</h3>
              <p>Validasi lokasi meter-presisi dengan geofence radius kantor dan selfie anti-fake GPS real-time.</p>
            </div>
            <div className="fs-panel">
              <div className="fs-ph">
                <span>Tingkat On-Time</span>
                <span className="fs-tag">98.6%</span>
              </div>
              <div className="fs-bars">
                {ON_TIME.map((b) => (
                  <div key={b.day} className={b.active ? "fs-k" : ""}>
                    <i style={{ height: `${b.value}%` }} />
                    <span>{b.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Kartu 2: Voucher Kantin QR 60 Detik */}
          <article className="fs-bc">
            <div>
              <Icon3D src={kantin} size={72} />
              <div className="fs-eb">One-time use (HMAC)</div>
              <h3>Voucher Kantin QR 60 Detik</h3>
              <p>Token makan berganti setiap 60 detik anti-screenshot. Scan kasir instan kurang dari 0.5 detik.</p>
            </div>
            <div className="fs-panel">
              <div className="fs-ph">
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <QrIcon /> Voucher Aktif
                </span>
                <span className="fs-tag fs-y" aria-live="off">{seconds}s</span>
              </div>
              <div className="fs-vbox">
                Subsidi Makan Siang Karyawan
                <b>Rp 25.000 / porsi</b>
                <em>Status: Siap Pindai di Merchant</em>
              </div>
              <div className="fs-bar">
                <span style={{ width: `${(seconds / 60) * 100}%` }} />
              </div>
            </div>
          </article>
        </div>

        {/* Kolom Kanan: Satu Kartu Biru Bold (Kalkulator PPh 21 TER & BPJS) */}
        <article className="fs-big">
          <Icon3D src={payroll} size={84} />
          <div className="fs-eb">Kepatuhan perpajakan</div>
          <h3>Kalkulator Otomatis PPh 21 TER & BPJS</h3>
          <p>
            Klasifikasi Kategori TER A, B, atau C berbasis PTKP secara matematis presisi tanpa salah hitung. Cetak slip gaji
            dan file batch bank dalam 1 klik.
          </p>
          <div className="fs-panel">
            <div className="fs-ph">
              <span>
                <i className="fs-dot" />
                Kepatuhan Payroll Perusahaan
              </span>
              <span className="fs-tag">100% Sesuai Aturan</span>
            </div>
            <svg className="fs-chart" viewBox="0 0 600 230" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4F6BFF" stopOpacity=".35" />
                  <stop offset="1" stopColor="#4F6BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="var(--fs-line)" strokeWidth="1.5">
                <path d="M0 60H600M0 120H600M0 180H600" />
              </g>
              <path d="M0 190C70 190 110 194 170 168S260 118 330 106S450 92 505 64S570 40 600 36V230H0Z" fill={`url(#${gid})`} />
              <path
                d="M0 190C70 190 110 194 170 168S260 118 330 106S450 92 505 64S570 40 600 36"
                fill="none"
                stroke="#3D5AF1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="505" cy="64" r="6" fill="#3D5AF1" stroke="#fff" strokeWidth="3" />
            </svg>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function FeatureSections() {
  return (
    <div className="fs-wrap">
      <FeatureBento />
      <FeatureGrid />
    </div>
  );
}
