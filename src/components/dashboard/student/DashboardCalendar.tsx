
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export function DashboardCalendar() {
  return (
    <Card className="border-2 border-gray-300 shadow-md bg-white">
      <CardHeader className="border-b-2 border-gray-300 bg-white">
        <CardTitle className="text-xl font-heading font-semibold text-gray-800">
          Class Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <ClassCalendar role="student" />
      </CardContent>
    </Card>
  );
}
