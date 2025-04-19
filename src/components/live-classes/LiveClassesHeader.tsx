
import { LiveClassSearch } from "./LiveClassSearch";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LiveClassesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
}

export function LiveClassesHeader({ searchQuery, onSearchChange, onRefresh }: LiveClassesHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-2 sm:gap-3 w-full">
      <h1 className="text-xl sm:text-2xl font-bold">Live Class Sessions</h1>
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
            aria-label="Refresh data"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
