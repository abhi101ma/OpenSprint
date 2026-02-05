import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { requireAuth } from "@/lib/guards";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
