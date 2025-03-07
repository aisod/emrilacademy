
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ResourceListStateProps {
  isLoading: boolean;
  isEmpty: boolean;
}

export function ResourceListState({ isLoading, isEmpty }: ResourceListStateProps) {
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

  if (isEmpty) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No resources available</p>
      </Card>
    );
  }

  return null;
}
