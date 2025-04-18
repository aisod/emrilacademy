
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRefresh: () => void;
}

export function ErrorState({ onRefresh }: ErrorStateProps) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
      <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
        Unable to load classes
      </h3>
      <p className="text-red-600 dark:text-red-400">
        Please try refreshing the page.
      </p>
      <Button 
        variant="outline" 
        className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}
