import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import TalentForm from "../../components/TalentForm";
import TalentJadwalManager from "../../components/TalentJadwalManager";

export default async function EditTalentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: talent }, { data: contentOptions }, { data: jadwalList }, { data: lokasiOptions }] =
    await Promise.all([
      supabase.from("talent_collab").select("*").eq("id", id).maybeSingle(),
      supabase.from("content_plan").select("id, judul").order("tanggal_posting", { ascending: false }),
      supabase
        .from("talent_jadwal")
        .select("*, lokasi_shooting(nama_lokasi)")
        .eq("talent_collab_id", id)
        .order("tanggal", { ascending: true }),
      supabase.from("lokasi_shooting").select("id, nama_lokasi").order("nama_lokasi"),
    ]);

  return (
    <DashboardShell>
      <TalentForm initialData={talent} contentOptions={contentOptions || []} />
      <TalentJadwalManager
        talentCollabId={Number(id)}
        jadwalList={jadwalList || []}
        lokasiOptions={lokasiOptions || []}
      />
    </DashboardShell>
  );
}