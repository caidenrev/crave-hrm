/**
 * Deterministic Employee & User Cartoon Avatar Helper
 * Memastikan setiap pengguna/karyawan memiliki avatar karakter kartun yang konsisten
 * di seluruh aplikasi (Header, Sidebar, Dashboard, Karyawan, Payroll, Rekrutmen, dll).
 */

export const CARTOON_AVATARS = [
  "/images/avatars/avatar-1.jpg",
  "/images/avatars/avatar-2.jpg",
  "/images/avatars/avatar-3.jpg",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Cek apakah URL adalah foto unggahan lokal resmi user (bukan stock placeholder eksternal).
 * Menolak hotlink eksternal (Unsplash, Pravatar, dll.) demi keamanan, privasi & performa.
 */
function isVerifiedLocalAvatar(url) {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes("profile-logo.jpeg")) return false;
  return trimmed.startsWith("/storage/") || trimmed.startsWith("/images/avatars/");
}

/**
 * Mengembalikan URL gambar avatar yang sesuai untuk user/karyawan/kandidat.
 * Prioritas:
 * 1. Foto unggahan lokal resmi (/storage/ atau /images/avatars/)
 * 2. Pemetaan tetap tim inti (Eka Revandi -> avatar-1, Egi -> avatar-2, Aufa -> avatar-3)
 * 3. Hash deterministik dari ID / nama / email ke salah satu dari 3 avatar kartun
 */
export function getEmployeeAvatar(person) {
  if (!person) {
    return CARTOON_AVATARS[0];
  }

  if (typeof person === "string") {
    const lower = person.toLowerCase();
    if (lower.includes("revandi") || lower.includes("founder@")) return CARTOON_AVATARS[0];
    if (lower.includes("egi")) return CARTOON_AVATARS[1];
    if (lower.includes("aufa")) return CARTOON_AVATARS[2];
    return CARTOON_AVATARS[hashString(lower) % CARTOON_AVATARS.length];
  }

  const customPhoto = person.foto_url || person.avatar_url || person.avatar;
  if (isVerifiedLocalAvatar(customPhoto)) {
    return customPhoto.trim();
  }

  const email = String(person.email || "").toLowerCase();
  const displayName = String(
    person.nama_lengkap || person.full_name || person.name || ""
  ).toLowerCase();

  if (email.includes("founder@") || displayName.includes("revandi") || displayName === "eka") {
    return CARTOON_AVATARS[0];
  }
  if (email.includes("egi@") || displayName.includes("egi")) {
    return CARTOON_AVATARS[1];
  }
  if (email.includes("aufa@") || displayName.includes("aufa")) {
    return CARTOON_AVATARS[2];
  }

  if (person.id !== undefined && person.id !== null && !Number.isNaN(Number(person.id))) {
    const idx = Math.abs(Number(person.id)) % CARTOON_AVATARS.length;
    return CARTOON_AVATARS[idx];
  }

  const seed = displayName || email || "crave-employee";
  return CARTOON_AVATARS[hashString(seed) % CARTOON_AVATARS.length];
}
