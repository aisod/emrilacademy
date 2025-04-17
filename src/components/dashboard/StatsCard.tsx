
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number | null;
  icon: LucideIcon;
  isLoading?: boolean;
}

export function StatsCard({ title, value, icon: Icon, isLoading }: StatsCardProps) {
  return (
    <Card className="p-5 border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center space-x-4">
        <div className="p-2 sm:p-3 bg-primary-light/20 dark:bg-primary-dark/30 rounded-full">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-primary-light" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{title}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mt-1" />
          ) : (
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{value || 0}</h3>
          )}
        </div>
      </div>
    </Card>
  );
}
