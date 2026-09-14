import DashboardShell from "../components/DashboardShell";

export default function PanduanPage() {
  return (
    <DashboardShell>
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="font-display text-xl font-semibold text-text mb-8">
          Panduan Penggunaan
        </div>

        <div className="flex flex-col gap-7 text-[14px] text-text leading-relaxed">
          <Section title="Dashboard Utama">
            Ini halaman utama (`/`). Nunjukin ring pencapaian KPI bulan ini, konten & deadline
            hari ini, jadwal minggu ini, grafik trend performa 6 bulan terakhir, daftar event,
            daftar talent, dan pipeline konten (kanban Brief → Produksi → Review → Posting).
          </Section>

          <Section title="Menambah Konten Baru">
            Klik tombol <b>+ Tambah</b> di Content Pipeline, atau lewat tab "Tambah" di navigasi
            atas, atau tekan <b>⌘K</b> dari dashboard. Isi form pakai dropdown/klik.
          </Section>

          <Section title="Mengedit atau Menghapus Konten">
            Arahkan kursor ke kartu konten di Content Pipeline buat lihat preview brief, atau
            klik kartunya buat buka form edit lengkap. Tombol "Hapus konten ini" ada di bagian
            bawah form edit.
          </Section>

          <Section title="Command Palette (⌘K)">
            Tekan Cmd/Ctrl+K dari dashboard buat cari cepat konten atau talent, atau pindah ke
            halaman lain.
          </Section>

          <Section title="Ringkasan Meeting">
            Buka lewat tab "Meeting" di navigasi atas. Nunjukin daftar konten dalam rentang
            Mingguan atau Bulanan, lengkap sama total views, link referensi, dan link aset.
          </Section>

          <Section title="Link Referensi vs Link Aset">
            <b>Link Referensi</b> buat link inspirasi/rujukan (competitor, moodboard, dll), dan{" "}
            <b>Link Aset</b> buat link hasil akhir konten yang udah jadi/diposting.
          </Section>

          <Section title="Berbagi Brief ke Talent">
            Tiap talent punya halaman brief sendiri di `/talent/&lt;id&gt;`. Link ini bisa
            disebar ke talent/partner — mereka cuma lihat data yang relevan, gak lihat data
            internal lainnya.
          </Section>

          <Section title="Login">
            Dashboard dan form input cuma bisa diakses setelah login pakai akun Google Han.
            Halaman brief talent sengaja gak butuh login.
          </Section>
        </div>
      </div>
    </DashboardShell>
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