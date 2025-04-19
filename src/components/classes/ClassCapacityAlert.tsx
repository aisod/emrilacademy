
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ClassCapacityAlertProps {
  enrollmentCount: number;
  capacity: number;
}

export function ClassCapacityAlert({ enrollmentCount, capacity }: ClassCapacityAlertProps) {
  const capacityPercentage = (enrollmentCount / capacity) * 100;
  const isNearCapacity = capacityPercentage >= 80;
  const isAtCapacity = enrollmentCount >= capacity;
  
  // Don't show the alert if we're not near capacity
  if (!isNearCapacity && !isAtCapacity) {
    return null;
  }
  
  return (
    <Alert variant={isAtCapacity ? "destructive" : "warning"} className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isAtCapacity ? "Class is full" : "Class nearly full"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">
              {isAtCapacity 
                ? "This class has reached its maximum capacity." 
                : "This class is filling up quickly."}
            </span>
            <Badge variant={isAtCapacity ? "destructive" : "outline"}>
              {enrollmentCount}/{capacity} enrolled
            </Badge>
          </div>
          <Progress value={capacityPercentage} className="h-2" />
        </div>
      </AlertDescription>
    </Alert>
  );
}
