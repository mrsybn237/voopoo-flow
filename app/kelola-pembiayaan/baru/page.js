import DashboardShell from "../../components/DashboardShell";
import PembiayaanForm from "../../components/PembiayaanForm";

export default function TambahPembiayaanPage() {
  return (
    <DashboardShell>
      <PembiayaanForm initialData={null} />
    </DashboardShell>
  );
}