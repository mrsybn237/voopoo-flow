import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import JadwalTalentForm from "../../components/JadwalTalentForm";

export default async function EditJadwalTalentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: jadwal } = await supabase.from("jadwal_talent").select("*").eq("id", id).maybeSingle();

  return (
    <DashboardShell>
      <JadwalTalentForm initialData={jadwal} />
    </DashboardShell>
  );
}