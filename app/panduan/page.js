import Link from "next/link";

export default function PanduanPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-10">
      <Link href="/" className="font-mono text-[11px] text-muted-dim hover:text-text transition-colors">
        ← Kembali ke Dashboard
      </Link>

      <div className="font-display text-xl font-semibold text-text mt-4 mb-8">
        Panduan Penggunaan
      </div>

      <div className="flex flex-col gap-7 text-[14px] text-text leading-relaxed">
        <Section title="Dashboard Utama">
          Ini halaman utama (`/`). Nunjukin ring pencapaian KPI bulan ini, konten & deadline hari
          ini, jadwal minggu ini, grafik trend performa 6 bulan terakhir, daftar event, daftar
          talent, dan pipeline konten (kanban Brief → Produksi → Review → Posting).
        </Section>

        <Section title="Menambah Konten Baru">
          Klik tombol <b>+ Tambah</b> di bagian Content Pipeline, atau tekan <b>⌘K</b> (Cmd+K di
          Mac, Ctrl+K di Windows) lalu pilih "Tambah Konten Baru". Isi form pakai dropdown/klik,
          gak perlu ketik ulang nilai yang udah baku (status, pilar, platform, dll).
        </Section>

        <Section title="Mengedit atau Menghapus Konten">
          Klik kartu konten di Content Pipeline (kanban), form yang sama bakal muncul terisi data
          lama. Ubah yang perlu, klik "Simpan Perubahan". Kalau mau hapus, ada tombol "Hapus
          konten ini" di bagian bawah form.
        </Section>

        <Section title="Command Palette (⌘K)">
          Tekan Cmd/Ctrl+K dari halaman mana aja buat cari cepat konten atau talent, atau pindah
          ke halaman lain (Tambah Konten, Ringkasan Meeting, Panduan).
        </Section>

        <Section title="Ringkasan Meeting">
          Buka lewat ⌘K atau ketik langsung `/meeting`. Nunjukin daftar konten dalam rentang
          Mingguan atau Bulanan (toggle di kanan atas), lengkap sama total views, link referensi,
          dan link aset — siap dibuka pas meeting sama Bram.
        </Section>

        <Section title="Link Referensi vs Link Aset">
          Di form konten ada 2 kolom link: <b>Link Referensi</b> buat link inspirasi/rujukan
          (competitor, moodboard, dll), dan <b>Link Aset</b> buat link hasil akhir konten yang
          udah jadi/diposting.
        </Section>

        <Section title="Berbagi Brief ke Talent">
          Tiap talent di tabel `talent_collab` punya halaman brief sendiri di
          `/talent/&lt;id&gt;`. Link ini bisa disebar ke talent/partner — mereka cuma lihat nama,
          platform, status, deadline, brief, dan judul konten terkait, gak lihat data internal
          lainnya.
        </Section>

        <Section title="Login">
          Dashboard utama dan form input cuma bisa diakses setelah login pakai akun Google Han.
          Halaman brief talent (`/talent/&lt;id&gt;`) sengaja gak butuh login, biar talent bisa
          buka langsung dari link yang dikasih.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="font-display text-[15px] font-semibold text-ember mb-2">{title}</div>
      <p className="text-muted">{children}</p>
    </div>
  );
}