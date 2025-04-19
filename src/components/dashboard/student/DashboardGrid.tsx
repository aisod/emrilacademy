
import React from 'react';
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { UpcomingAssignments } from "@/components/dashboard/student/UpcomingAssignments";

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <NextClassCard />
      <RecentMessages />
      <UpcomingAssignments />
    </div>
  );
}
