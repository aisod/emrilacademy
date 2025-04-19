
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
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        onClick={handleReset}
        className="flex items-center h-9 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        disabled={isFiltering || !hasFilters}
        title="Reset all filters"
        data-testid="reset-filters-btn"
        size="sm"
        aria-label="Reset filters"
      >
        <X className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Reset</span>
      </Button>
      <Button 
        onClick={handleApply}
        className="flex items-center h-9"
        disabled={isFiltering}
        title="Apply selected filters"
        data-testid="apply-filters-btn"
        size="sm"
        aria-label="Apply filters"
      >
        {isFiltering ? (
          <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
        ) : (
          <Filter className="h-4 w-4 sm:mr-2" />
        )}
        <span className="hidden sm:inline">Apply</span>
      </Button>
    </div>
  );
}
