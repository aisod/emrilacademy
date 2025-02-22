
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
