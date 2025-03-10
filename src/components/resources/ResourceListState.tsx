
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ResourceListStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  isError?: boolean;
}

export function ResourceListState({ isLoading, isEmpty, isError }: ResourceListStateProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-destructive font-medium">Failed to load resources</p>
          <p className="text-muted-foreground text-sm">Please try again later</p>
        </div>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No resources available</p>
      </Card>
    );
  }

  return null;
}
