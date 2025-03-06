
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import { LiveClassesContent } from "@/components/live-classes/LiveClassesContent";
import { SingleClassView } from "@/components/live-classes/SingleClassView";

export default function LiveClasses() {
  const { classId } = useParams();

  if (classId) {
    return (
      <DashboardLayout>
        <SingleClassView classId={classId} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LiveClassesContent />
    </DashboardLayout>
  );
}
