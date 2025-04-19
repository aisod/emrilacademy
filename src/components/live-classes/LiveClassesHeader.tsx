
import { LiveClassSearch } from "./LiveClassSearch";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface LiveClassesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
}

export function LiveClassesHeader({ searchQuery, onSearchChange, onRefresh }: LiveClassesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Live Class Sessions</h1>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <LiveClassSearch 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        {onRefresh && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRefresh}
            className="flex-shrink-0"
            title="Refresh data"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
