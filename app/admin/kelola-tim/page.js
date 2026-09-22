import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import TeamMemberManager from "../../components/TeamMemberManager";

export default async function KelolaTimPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").order("nama");

  return (
    <DashboardShell>
      <div className="max-w-[640px] mx-auto px-6 pb-16">
        <div className="font-display text-xl font-semibold text-text mb-1">Kelola Tim</div>
        <div className="text-[13px] text-muted mb-7">Halaman ini cuma bisa diakses admin.</div>
        <TeamMemberManager members={data || []} />
      </div>
    </DashboardShell>
  );
}