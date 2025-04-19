
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHistoryFilter } from "./SessionHistoryFilter";
import { SessionCard } from "./SessionCard";
import { NoSessionsFound } from "./NoSessionsFound";
import { useSessionFilters } from "@/hooks/use-session-filters";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionHistoryListProps {
  sessionHistory: any[];
  isLoading?: boolean;
}

export function SessionHistoryList({ sessionHistory, isLoading = false }: SessionHistoryListProps) {
  const { filters, setFilters, filteredSessions } = useSessionFilters();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <SessionHistoryFilter onFilterChange={setFilters} />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-36" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filtered = filteredSessions(sessionHistory);

  if (!sessionHistory || sessionHistory.length === 0) {
    return (
      <div className="space-y-4">
        <SessionHistoryFilter onFilterChange={setFilters} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No session history available</h3>
              <p className="text-gray-500">
                You haven't conducted any class sessions yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SessionHistoryFilter onFilterChange={setFilters} />
      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              expandedSession={expandedSession}
              onToggleExpand={(sessionId) => setExpandedSession(expandedSession === sessionId ? null : sessionId)}
            />
          ))
        ) : (
          <NoSessionsFound 
            onClearFilters={() => setFilters({
              searchTerm: "",
              startDate: undefined,
              endDate: undefined,
              sortBy: "recent"
            })}
          />
        )}
      </div>
    </div>
  );
}
