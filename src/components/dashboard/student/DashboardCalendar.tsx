
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export function DashboardCalendar() {
  return (
    <Card className="border border-card-border shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
          Class Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ClassCalendar role="student" />
      </CardContent>
    </Card>
  );
}
