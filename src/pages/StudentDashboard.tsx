
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function StudentDashboard() {
  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome to your student dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
