
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import { UserManagement } from "@/components/dashboard/admin/UserManagement";
import { AdminOverview } from "@/components/dashboard/admin/AdminOverview";

export default function AdminDashboard() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="animate-fade-up space-y-4 md:space-y-6">
        <AdminOverview />
        <AdminStats />
        <UserManagement />
      </div>
    </DashboardLayout>
  );
}
