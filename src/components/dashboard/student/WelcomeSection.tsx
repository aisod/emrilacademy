
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface WelcomeSectionProps {
  firstName: string | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function WelcomeSection({ 
  firstName, 
  isLoading, 
  onRefresh, 
  isRefreshing 
}: WelcomeSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {isLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            `Welcome, ${firstName || "Student"}!`
          )}
        </h1>
        <Button 
          size="sm"
          variant="ghost" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 p-1"
          aria-label="Refresh dashboard data"
        >
          <RefreshCw 
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          <span className="sr-only">Refresh data</span>
        </Button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
        Here's an overview of your learning journey
      </p>
    </div>
  );
}
