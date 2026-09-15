import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import TalentForm from "../../components/TalentForm";

export default async function EditTalentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: talent }, { data: contentOptions }] = await Promise.all([
    supabase.from("talent_collab").select("*").eq("id", id).maybeSingle(),
    supabase.from("content_plan").select("id, judul").order("tanggal_posting", { ascending: false }),
  ]);

  return (
    <DashboardShell>
      <TalentForm initialData={talent} contentOptions={contentOptions || []} />
    </DashboardShell>
  );
}