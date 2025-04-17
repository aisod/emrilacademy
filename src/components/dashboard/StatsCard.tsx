
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
    <Card className="p-6 border border-card-border shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary-light dark:bg-primary-dark rounded-full">
          <Icon className="h-6 w-6 text-primary dark:text-primary-light" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value || 0}</h3>
          )}
        </div>
      </div>
    </Card>
  );
}
