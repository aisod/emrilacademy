
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

export function FilterActions({ onReset, onApply }: FilterActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onReset}>
        <X className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
      <Button onClick={onApply}>Apply Filters</Button>
    </div>
  );
}
