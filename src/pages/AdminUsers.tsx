
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AllUsersTable } from "@/components/dashboard/admin/AllUsersTable";

export default function AdminUsers() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="animate-fade-up space-y-4 md:space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
            View and manage all users in the system
          </p>
        </div>
        <AllUsersTable />
      </div>
    </DashboardLayout>
  );
}
