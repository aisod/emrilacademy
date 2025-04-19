
import React from 'react';
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <NextClassCard />
      <RecentMessages />
    </div>
  );
}
