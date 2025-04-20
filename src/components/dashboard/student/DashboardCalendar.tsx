
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export function DashboardCalendar() {
  return (
    <Card className="border border-card-border shadow-sm bg-white">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl font-heading font-semibold text-gray-900">
          Class Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ClassCalendar role="student" />
      </CardContent>
    </Card>
  );
}
