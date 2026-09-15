import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import EventForm from "../../components/EventForm";

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).maybeSingle();

  return (
    <DashboardShell>
      <EventForm initialData={event} />
    </DashboardShell>
  );
}