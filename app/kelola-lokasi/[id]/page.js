import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import LokasiForm from "../../components/LokasiForm";

export default async function EditLokasiPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lokasi } = await supabase.from("lokasi_shooting").select("*").eq("id", id).maybeSingle();

  return (
    <DashboardShell>
      <LokasiForm initialData={lokasi} />
    </DashboardShell>
  );
}