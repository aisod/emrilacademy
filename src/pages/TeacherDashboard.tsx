
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function TeacherDashboard() {
  return (
    <DashboardLayout requiredRole="teacher">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome to your teaching dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
