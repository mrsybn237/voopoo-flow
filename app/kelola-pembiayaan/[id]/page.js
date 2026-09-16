import { createClient } from "../../lib/supabase-server";
import DashboardShell from "../../components/DashboardShell";
import PembiayaanForm from "../../components/PembiayaanForm";

export default async function EditPembiayaanPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase.from("pembiayaan").select("*").eq("id", id).maybeSingle();

  if (error) {
    return (
      <DashboardShell>
        <div className="bg-panel border border-line-soft rounded-[10px] p-5 text-ember text-[13px]">
          Gagal memuat data: {error.message}
        </div>
      </DashboardShell>
    );
  }

  if (!item) {
    return (
      <DashboardShell>
        <div className="bg-panel border border-line-soft rounded-[10px] p-5 text-muted text-[13px]">
          Data tidak ditemukan (ID: {id}).
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PembiayaanForm initialData={item} />
    </DashboardShell>
  );
}