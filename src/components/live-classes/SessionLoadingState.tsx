
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SessionLoadingState() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
