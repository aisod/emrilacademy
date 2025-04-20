
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export function DashboardCalendar() {
  return (
    <Card className="border-2 border-gray-400 shadow-lg bg-white">
      <CardHeader className="border-b-2 border-gray-400 bg-white">
        <CardTitle className="text-xl font-heading font-bold text-gray-900">
          Class Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <ClassCalendar role="student" />
      </CardContent>
    </Card>
  );
}
