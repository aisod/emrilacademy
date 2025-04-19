
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoSessionsFoundProps {
  onClearFilters: () => void;
}

export function NoSessionsFound({ onClearFilters }: NoSessionsFoundProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching sessions found</h3>
          <p className="text-gray-500">
            Try adjusting your filters to find what you're looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
