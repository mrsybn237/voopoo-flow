import { createClient } from "../../lib/supabase-server";
import ContentForm from "../../components/ContentForm";

export default async function EditContentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("content_plan").select("*").eq("id", id).maybeSingle();

  return <ContentForm initialData={data} />;
}