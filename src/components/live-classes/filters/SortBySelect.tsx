
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SortBySelectProps {
  value: "recent" | "duration" | "participants";
  onValueChange: (value: "recent" | "duration" | "participants") => void;
}

export function SortBySelect({ value, onValueChange }: SortBySelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-by">Sort by:</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]" id="sort-by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="duration">Longest Duration</SelectItem>
          <SelectItem value="participants">Most Participants</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
