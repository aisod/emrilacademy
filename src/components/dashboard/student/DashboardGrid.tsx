
import React from 'react';
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { UpcomingAssignments } from "@/components/dashboard/student/UpcomingAssignments";

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="md:col-span-2 lg:col-span-3">
        <NextClassCard />
      </div>
      <div className="md:col-span-1">
        <RecentMessages />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <UpcomingAssignments />
      </div>
    </div>
  );
}
