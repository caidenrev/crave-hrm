import "./CraveServiceCards.css";
import posIcon from "./assets/crave-pos-icon.png";
import payLogo from "./assets/crave-pay-horizontal.svg";
import eventLogo from "./assets/crave-event-horizontal.svg";

/* ---------- ilustrasi di dalam blob ---------- */
function PosArt() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      {/* struk */}
      <rect x="30" y="8" width="44" height="40" rx="6" fill="var(--ill-soft)" />
      <path d="M38 20h28M38 29h20M38 38h24" stroke="var(--ill)" strokeWidth="4" strokeLinecap="round" />
      {/* mesin kasir */}
      <rect x="12" y="46" width="96" height="64" rx="14" fill="var(--ill)" />
      <rect x="24" y="58" width="44" height="18" rx="6" fill="var(--ill-pop)" />
      <g fill="var(--ill-soft)">
        <rect x="78" y="58" width="10" height="10" rx="3" />
        <rect x="92" y="58" width="10" height="10" rx="3" />
        <rect x="24" y="84" width="14" height="14" rx="4" />
        <rect x="44" y="84" width="14" height="14" rx="4" />
        <rect x="64" y="84" width="14" height="14" rx="4" />
        <rect x="84" y="78" width="18" height="20" rx="4" />
      </g>
    </svg>
  );
}

function EventArt() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      {/* tiket dengan lekukan */}
      <path
        d="M14 28h92a8 8 0 0 1 8 8v14a10 10 0 0 0 0 20v14a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V70a10 10 0 0 0 0-20V36a8 8 0 0 1 8-8Z"
        fill="var(--ill)"
        transform="translate(0 4)"
      />
      <path d="M84 36v60" stroke="var(--ill-soft)" strokeWidth="3" strokeDasharray="5 5" />
      {/* tombol play = webinar */}
      <circle cx="45" cy="64" r="22" fill="var(--ill-pop)" />
      <path d="M39 53l18 11-18 11Z" fill="var(--ill-soft)" />
    </svg>
  );
}

function PayArt() {
  const finder = (x, y) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="34" height="34" rx="8" fill="var(--ill)" />
      <rect x="7" y="7" width="20" height="20" rx="4" fill="var(--ill-soft)" />
      <rect x="12" y="12" width="10" height="10" rx="2" fill="var(--ill)" />
    </g>
  );
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      {finder(6, 6)}
      {finder(80, 6)}
      {finder(6, 80)}
      <g fill="var(--ill)">
        <rect x="50" y="8" width="12" height="12" rx="3" />
        <rect x="50" y="30" width="12" height="12" rx="3" />
        <rect x="8" y="50" width="12" height="12" rx="3" />
        <rect x="30" y="50" width="12" height="12" rx="3" />
        <rect x="52" y="52" width="12" height="12" rx="3" />
        <rect x="76" y="52" width="12" height="12" rx="3" />
        <rect x="98" y="52" width="12" height="12" rx="3" />
        <rect x="52" y="78" width="12" height="12" rx="3" />
      </g>
      <rect x="82" y="82" width="30" height="30" rx="9" fill="var(--ill-pop)" />
      <path d="M90 97l6 6 10-12" stroke="var(--ill-soft)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ---------- blob organik (mengikuti gaya referensi) ---------- */
function Blob() {
  return (
    <div className="crave-card__blob" aria-hidden="true">
      <svg viewBox="0 0 200 340" preserveAspectRatio="xMaxYMid slice">
        <path
          d="M200 0V340H96C58 326 84 292 70 262C54 226 6 232 10 188C14 146 74 150 68 108C62 70 36 36 74 0Z"
          fill="var(--blob)"
        />
        <path d="M200 64L168 104L200 126Z" fill="var(--spike)" />
      </svg>
    </div>
  );
}

/* ---------- data layanan: terang -> sedang -> bold ---------- */
export const SERVICES = [
  {
    id: "pos",
    tone: "light",
    name: "Crave POS",
    title: "Kasir yang rapi",
    desc: "Catat penjualan, stok, dan laporan harian toko atau kafemu dari satu layar.",
    cta: "Coba Crave POS",
    href: "https://pos.craveservices.my.id",
    logo: { type: "icon+text", src: posIcon, text: "Crave POS" },
    Art: PosArt,
  },
  {
    id: "event",
    tone: "mid",
    name: "Crave Event",
    title: "Webinar tanpa repot",
    desc: "Buat acara, jual tiket, dan kelola peserta webinar dari satu tempat.",
    cta: "Lihat Crave Event",
    href: "https://event.craveservices.my.id",
    logo: { type: "wordmark", src: eventLogo, ratio: 1277.5 / 256 },
    Art: EventArt,
  },
  {
    id: "pay",
    tone: "bold",
    name: "Crave Pay",
    title: "Terima QRIS langsung",
    desc: "Pembayaran QRIS masuk ke rekening usahamu, tanpa mesin EDC.",
    cta: "Aktifkan Crave Pay",
    href: "https://pay.craveservices.my.id",
    logo: { type: "wordmark", src: payLogo, ratio: 848.09 / 192 },
    Art: PayArt,
  },
];

function Logo({ logo, name }) {
  if (logo.type === "icon+text") {
    return (
      <div className="crave-card__logo" role="img" aria-label={name}>
        <span
          className="crave-card__logo-mark"
          style={{ "--logo": `url(${logo.src})`, aspectRatio: "1 / 1" }}
        />
        <span className="crave-card__logo-text" aria-hidden="true">
          {logo.text}
        </span>
      </div>
    );
  }
  return (
    <div className="crave-card__logo" role="img" aria-label={name}>
      <span
        className="crave-card__logo-mark"
        style={{ "--logo": `url(${logo.src})`, aspectRatio: String(logo.ratio) }}
      />
    </div>
  );
}

export function CraveServiceCard({ service }) {
  const { tone, name, title, desc, cta, href, logo, Art } = service;
  return (
    <article className={`crave-card crave-card--${tone}`}>
      <Blob />
      <div className="crave-card__art">
        <Art />
      </div>

      <Logo logo={logo} name={name} />

      <div className="crave-card__body">
        <h3 className="crave-card__title">{title}</h3>
        <p className="crave-card__desc">{desc}</p>
        <a className="crave-card__cta" href={href}>
          {cta}
        </a>
      </div>
    </article>
  );
}

export default function CraveServiceCards({ services = SERVICES }) {
  return (
    <section className="crave-cards" aria-label="Layanan Crave Services">
      {services.map((s) => (
        <CraveServiceCard key={s.id} service={s} />
      ))}
    </section>
  );
}
