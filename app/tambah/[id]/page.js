import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import ContentForm from "../../components/ContentForm";

export default async function EditContentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("content_plan").select("*").eq("id", id).maybeSingle();

  return (
    <DashboardShell>
      <ContentForm initialData={data} />
    </DashboardShell>
  );
}