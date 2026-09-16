// Format tanggal ke YYYY-MM-DD berdasarkan waktu LOKAL (bukan UTC).
// Jangan pakai d.toISOString().slice(0,10) untuk ini -- itu konversi ke UTC
// dan bisa geser tanggal mundur/maju di timezone WIB (UTC+7).
export function toISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Hasilkan 6 bulan terakhir (termasuk bulan berjalan), urut dari lama ke baru.
// Tiap item: { key: "2026-09", label: "Sep 26", start: "2026-09-01", end: "2026-09-30" }
export function last6Months(today = new Date()) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const start = toISODate(d);
    const end = toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${BULAN_SINGKAT[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    months.push({ key, label, start, end });
  }
  return months;
}

const HARI_PENUH = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Ubah tanggal ISO jadi teks relatif yang gampang dibaca:
// "Hari ini" / "Besok" / "Kemarin" / nama hari (kalau masih dalam ±6 hari) / "18 Sep"
export function formatRelativeDate(dateISO, today = new Date()) {
  if (!dateISO) return "-";
  const target = new Date(dateISO + "T00:00:00");
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  if (diffDays === -1) return "Kemarin";
  if (diffDays > 1 && diffDays <= 6) return HARI_PENUH[target.getDay()];
  if (diffDays < -1 && diffDays >= -6) return `${HARI_PENUH[target.getDay()]} lalu`;

  const sameYear = target.getFullYear() === now.getFullYear();
  return target.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
}

// Level urgensi buat kasih warna beda di badge/UI:
// "overdue" (lewat) | "urgent" (hari ini/besok) | "soon" (2-3 hari lagi) | "normal"
export function deadlineUrgency(dateISO, today = new Date()) {
  if (!dateISO) return "normal";
  const target = new Date(dateISO + "T00:00:00");
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 1) return "urgent";
  if (diffDays <= 3) return "soon";
  return "normal";
}