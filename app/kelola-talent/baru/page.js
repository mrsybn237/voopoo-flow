import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import TalentForm from "../../components/TalentForm";

export default async function TambahTalentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_plan")
    .select("id, judul")
    .order("tanggal_posting", { ascending: false });

  return (
    <DashboardShell>
      <TalentForm contentOptions={data || []} />
    </DashboardShell>
  );
}