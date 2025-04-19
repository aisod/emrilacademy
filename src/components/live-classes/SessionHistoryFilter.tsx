
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FilterActions } from "./filters/FilterActions";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { SortBySelect, SortOption } from "./filters/SortBySelect";

export interface SessionFilterOptions {
  searchTerm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: SortOption;
}

interface SessionHistoryFilterProps {
  onFilterChange: (filters: SessionFilterOptions) => void;
  initialFilters?: Partial<SessionFilterOptions>;
  className?: string;
}

export function SessionHistoryFilter({ 
  onFilterChange, 
  initialFilters = {},
  className = ""
}: SessionHistoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [startDate, setStartDate] = useState<Date | undefined>(initialFilters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialFilters.endDate);
  const [sortBy, setSortBy] = useState<SortOption>(initialFilters.sortBy || "recent");
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasUnappliedFilters, setHasUnappliedFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<SessionFilterOptions>({
    searchTerm,
    startDate,
    endDate,
    sortBy
  });

  // Check if there are unapplied changes
  useEffect(() => {
    const hasChanges = 
      searchTerm !== appliedFilters.searchTerm ||
      startDate !== appliedFilters.startDate ||
      endDate !== appliedFilters.endDate ||
      sortBy !== appliedFilters.sortBy;
    
    setHasUnappliedFilters(hasChanges);
  }, [searchTerm, startDate, endDate, sortBy, appliedFilters]);

  const handleApplyFilters = () => {
    const newFilters: SessionFilterOptions = {
      searchTerm,
      startDate,
      endDate,
      sortBy
    };
    
    setIsFiltering(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      onFilterChange(newFilters);
      setAppliedFilters(newFilters);
      setIsFiltering(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy("recent");
    
    const resetFilters: SessionFilterOptions = {
      searchTerm: "",
      startDate: undefined,
      endDate: undefined,
      sortBy: "recent"
    };
    
    onFilterChange(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const hasActiveFilters = !!searchTerm || !!startDate || !!endDate || sortBy !== "recent";

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isFiltering}
              data-testid="session-search-input"
            />
          </div>
          
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            disabled={isFiltering}
          />

          <div className="flex justify-between items-center gap-4">
            <SortBySelect 
              value={sortBy}
              onValueChange={setSortBy}
              disabled={isFiltering}
            />
          </div>

          <FilterActions
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            isFiltering={isFiltering}
            hasFilters={hasActiveFilters}
            className="self-end justify-self-end"
          />
        </div>
      </CardContent>
    </Card>
  );
}
