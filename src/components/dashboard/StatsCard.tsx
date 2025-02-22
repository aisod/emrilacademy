
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
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900">{value || 0}</h3>
          )}
        </div>
      </div>
    </Card>
  );
}
