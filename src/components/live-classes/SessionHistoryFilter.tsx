
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { SortBySelect } from "./filters/SortBySelect";
import { FilterActions } from "./filters/FilterActions";
import type { SessionFilters } from "@/hooks/use-session-filters";

interface SessionHistoryFilterProps {
  onFilterChange: (filters: SessionFilters) => void;
}

export function SessionHistoryFilter({ onFilterChange }: SessionHistoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"recent" | "duration" | "participants">("recent");
  
  const handleFilterChange = () => {
    onFilterChange({
      searchTerm,
      startDate,
      endDate,
      sortBy
    });
  };
  
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
        
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <SortBySelect value={sortBy} onValueChange={setSortBy} />
        <FilterActions onReset={handleReset} onApply={handleFilterChange} />
      </div>
    </div>
  );
}
