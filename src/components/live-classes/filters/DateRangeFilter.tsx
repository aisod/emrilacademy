
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, XCircle } from "lucide-react";
import { format, isValid } from "date-fns";
import { trackEvent } from "@/lib/analytics";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
  className = ""
}: DateRangeFilterProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleStartDateChange = (date: Date | undefined) => {
    trackEvent("class_view", {
      action: "filter_date",
      date_type: "start"
    });
    onStartDateChange(date);
    setStartOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    trackEvent("class_view", {
      action: "filter_date",
      date_type: "end"
    });
    onEndDateChange(date);
    setEndOpen(false);
  };

  const clearStartDate = () => {
    onStartDateChange(undefined);
  };

  const clearEndDate = () => {
    onEndDateChange(undefined);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between text-left font-normal"
            disabled={disabled}
            data-testid="start-date-filter"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate && isValid(startDate) ? format(startDate, "MMM d, yyyy") : "Start Date"}
            </div>
            {startDate && (
              <XCircle 
                className="h-4 w-4 opacity-70 ml-2 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearStartDate();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateChange}
            initialFocus
            disabled={(date) => endDate ? date > endDate : false}
          />
        </PopoverContent>
      </Popover>
      
      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between text-left font-normal"
            disabled={disabled}
            data-testid="end-date-filter"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate && isValid(endDate) ? format(endDate, "MMM d, yyyy") : "End Date"}
            </div>
            {endDate && (
              <XCircle 
                className="h-4 w-4 opacity-70 ml-2 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearEndDate();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
            disabled={(date) => startDate ? date < startDate : false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
