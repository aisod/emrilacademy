
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function LiveClasses() {
  const { classId } = useParams();
  const [isJoined, setIsJoined] = useState(false);

  const { data: classDetails } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: async () => {
      if (!classId) return null;
      const { data } = await supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          )
        `)
        .eq("id", classId)
        .single();
      return data;
    },
    enabled: !!classId,
  });

  if (!classId) {
    return (
      <DashboardLayout>
        <div className="container max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Live Classes</h1>
          <Card>
            <CardHeader>
              <CardTitle>No Class Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please select a class from your dashboard to join.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)]">
        <LiveClassRoom
          classId={classId}
          className={classDetails?.title}
          teacherName={`${classDetails?.teacher?.first_name} ${classDetails?.teacher?.last_name}`}
          isJoined={isJoined}
          onJoinStatusChange={setIsJoined}
        />
      </div>
    </DashboardLayout>
  );
}
