
import { Button } from "@/components/ui/button";
import { X, Filter, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
  isFiltering?: boolean;
  hasFilters?: boolean;
  className?: string;
}

export function FilterActions({ 
  onReset, 
  onApply, 
  isFiltering = false,
  hasFilters = false,
  className = ""
}: FilterActionsProps) {
  const handleReset = () => {
    // Track filter reset event
    trackEvent("class_view", {
      action: "reset_filters"
    });
    onReset();
  };

  const handleApply = () => {
    // Track filter apply event
    trackEvent("class_view", {
      action: "apply_filters"
    });
    onApply();
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline" 
        onClick={handleReset}
        className="flex items-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        disabled={isFiltering || !hasFilters}
        title="Reset all filters"
        data-testid="reset-filters-btn"
      >
        <X className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
      <Button 
        onClick={handleApply}
        className="flex items-center"
        disabled={isFiltering}
        title="Apply selected filters"
        data-testid="apply-filters-btn"
      >
        {isFiltering ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Filter className="mr-2 h-4 w-4" />
        )}
        Apply Filters
      </Button>
    </div>
  );
}
