
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TeachersGrid } from "@/components/teachers/TeachersGrid";

export default function TeachersPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-up space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-500">
            Browse our qualified teachers and find the perfect mentor for your learning journey
          </p>
        </div>

        <TeachersGrid />
      </div>
    </DashboardLayout>
  );
}
