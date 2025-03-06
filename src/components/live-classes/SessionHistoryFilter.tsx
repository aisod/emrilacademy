
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Search, CalendarIcon, X } from "lucide-react";

interface SessionHistoryFilterProps {
  onFilterChange: (filters: SessionFilters) => void;
}

export interface SessionFilters {
  searchTerm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: "recent" | "duration" | "participants";
}

export function SessionHistoryFilter({ onFilterChange }: SessionHistoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"recent" | "duration" | "participants">("recent");
  
  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      searchTerm,
      startDate,
      endDate,
      sortBy
    });
  };
  
  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy("recent");
    
    onFilterChange({
      searchTerm: "",
      startDate: undefined,
      endDate: undefined,
      sortBy: "recent"
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by class name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilterChange()}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM d, yyyy") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM d, yyyy") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate ? date < startDate : false}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-by">Sort by:</Label>
          <Select 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value as "recent" | "duration" | "participants")}
          >
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
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={handleFilterChange}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
