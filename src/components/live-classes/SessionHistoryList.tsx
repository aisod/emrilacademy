
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { SessionHistoryFilter } from "./SessionHistoryFilter";

interface SessionHistoryItem {
  id: string;
  class_id: string;
  started_at: string | null;
  ended_at: string | null;
  participant_count: number;
  duration_seconds: number;
  class: {
    title: string;
    teacher: {
      first_name: string;
      last_name: string;
    };
  };
}

interface SessionHistoryListProps {
  sessionHistory: SessionHistoryItem[] | undefined;
}

export function SessionHistoryList({ sessionHistory }: SessionHistoryListProps) {
  const [filteredSessions, setFilteredSessions] = useState<SessionHistoryItem[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    sortBy: "date" as "date" | "duration" | "participants",
  });

  useEffect(() => {
    if (!sessionHistory) {
      setFilteredSessions([]);
      return;
    }

    let filtered = [...sessionHistory];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (session) => session.class.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (session) => session.ended_at && new Date(session.ended_at) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      const nextDay = new Date(filters.dateTo);
      nextDay.setDate(nextDay.getDate() + 1);
      filtered = filtered.filter(
        (session) => session.ended_at && new Date(session.ended_at) < nextDay
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date":
          return (
            new Date(b.ended_at || Date.now()).getTime() -
            new Date(a.ended_at || Date.now()).getTime()
          );
        case "duration":
          return (b.duration_seconds || 0) - (a.duration_seconds || 0);
        case "participants":
          return (b.participant_count || 0) - (a.participant_count || 0);
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessionHistory, filters]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!sessionHistory || sessionHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have any past class sessions. When you participate in a class, it will be shown here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <SessionHistoryFilter onFilterChange={setFilters} />
      
      {filteredSessions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matching sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No sessions match your current filters. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{session.class.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  by {session.class.teacher.first_name} {session.class.teacher.last_name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Completed</span>
                  </div>
                  {session.started_at && session.ended_at && (
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.started_at), "MMM d, yyyy · h:mm a")}
                    </p>
                  )}
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <div>
                      <span className="font-medium">Duration:</span> {formatDuration(session.duration_seconds || 0)}
                    </div>
                    <div>
                      <span className="font-medium">Participants:</span> {session.participant_count || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
