
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  onRefresh: () => void;
}

export function DashboardError({ onRefresh }: DashboardErrorProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg text-red-700 dark:text-red-300">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-medium">Error loading dashboard data</h3>
      </div>
      <p className="text-sm">
        Please try refreshing the page. If the problem persists, contact support.
      </p>
      <Button 
        variant="outline" 
        size="sm"
        className="mt-2 border-red-300 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/50"
        onClick={onRefresh}
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        Retry
      </Button>
    </div>
  );
}
