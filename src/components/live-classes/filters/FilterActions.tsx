
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

export function FilterActions({ onReset, onApply }: FilterActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onReset}
        className="flex items-center transition-colors hover:bg-gray-100"
      >
        <X className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
      <Button 
        onClick={onApply}
        className="flex items-center"
      >
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
