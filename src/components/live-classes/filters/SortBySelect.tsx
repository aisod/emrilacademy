
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpDown, Clock, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export type SortOption = "recent" | "duration" | "participants";

interface SortBySelectProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  disabled?: boolean;
  className?: string;
}

export function SortBySelect({ 
  value, 
  onValueChange, 
  disabled = false,
  className = ""
}: SortBySelectProps) {
  const handleSortChange = (newValue: SortOption) => {
    // Track sort selection event
    trackEvent("class_view", {
      action: "change_sort",
      sort_option: newValue
    });
    onValueChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label htmlFor="sort-by" className="text-sm font-medium whitespace-nowrap">Sort by:</Label>
      <Select value={value} onValueChange={handleSortChange} disabled={disabled}>
        <SelectTrigger 
          className="w-[180px]" 
          id="sort-by"
          data-testid="sort-select"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent" className="flex items-center">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Most Recent</span>
            </div>
          </SelectItem>
          <SelectItem value="duration" className="flex items-center">
            <div className="flex items-center">
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              <span>Longest Duration</span>
            </div>
          </SelectItem>
          <SelectItem value="participants" className="flex items-center">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Most Participants</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
