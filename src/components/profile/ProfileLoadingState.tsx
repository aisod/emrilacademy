
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
