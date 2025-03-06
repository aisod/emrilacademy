
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface SessionHistoryFilterProps {
  onFilterChange: (filters: {
    searchTerm: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    sortBy: "date" | "duration" | "participants";
  }) => void;
}

export function SessionHistoryFilter({ onFilterChange }: SessionHistoryFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState<Date | null>(null);
  const [dateTo, setDateTo] = React.useState<Date | null>(null);
  const [sortBy, setSortBy] = React.useState<"date" | "duration" | "participants">("date");

  const handleApplyFilter = () => {
    onFilterChange({
      searchTerm,
      dateFrom,
      dateTo,
      sortBy,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setDateFrom(null);
    setDateTo(null);
    setSortBy("date");
    onFilterChange({
      searchTerm: "",
      dateFrom: null,
      dateTo: null,
      sortBy: "date",
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by class title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-1 gap-2">
          <div className="relative w-full">
            <DatePicker
              date={dateFrom}
              onSelect={setDateFrom}
              placeholder="From date"
            />
          </div>
          <div className="relative w-full">
            <DatePicker
              date={dateTo}
              onSelect={setDateTo}
              placeholder="To date"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "date" | "duration" | "participants")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (newest first)</SelectItem>
              <SelectItem value="duration">Duration (longest first)</SelectItem>
              <SelectItem value="participants">Participants (most first)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button onClick={handleApplyFilter}>Apply Filters</Button>
      </div>
    </div>
  );
}
