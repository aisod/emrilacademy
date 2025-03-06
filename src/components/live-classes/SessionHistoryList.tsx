import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionHistoryFilter, SessionFilters } from "./SessionHistoryFilter";
import { SessionAnalytics } from "./SessionAnalytics";
import { Clock, Calendar, Users, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionHistoryListProps {
  sessionHistory: any[];
  isLoading?: boolean;
}

export function SessionHistoryList({ sessionHistory, isLoading = false }: SessionHistoryListProps) {
  const [filters, setFilters] = useState<SessionFilters>({
    searchTerm: "",
    startDate: undefined,
    endDate: undefined,
    sortBy: "recent"
  });
  
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
  
  const filteredSessions = sessionHistory
    ? sessionHistory.filter(session => {
        if (filters.searchTerm && !session.classes?.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
        }
        
        if (filters.startDate || filters.endDate) {
          const sessionDate = session.started_at ? new Date(session.started_at) : null;
          
          if (!sessionDate) return false;
          
          if (filters.startDate && sessionDate < startOfDay(filters.startDate)) {
            return false;
          }
          
          if (filters.endDate && sessionDate > endOfDay(filters.endDate)) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "recent") {
          return new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime();
        } else if (filters.sortBy === "duration") {
          return (b.duration_seconds || 0) - (a.duration_seconds || 0);
        } else if (filters.sortBy === "participants") {
          return (b.participant_count || 0) - (a.participant_count || 0);
        }
        return 0;
      })
    : [];
    
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
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <SessionHistoryFilter onFilterChange={setFilters} />
      
      <div className="grid gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {session.classes?.title || "Untitled Class"}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {session.started_at 
                          ? format(new Date(session.started_at), "MMM d, yyyy") 
                          : "Unknown date"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration_seconds 
                          ? formatDuration(session.duration_seconds) 
                          : "Unknown duration"}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {session.participant_count || 0} participants
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{session.status}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    >
                      {expandedSession === session.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {expandedSession === session.id && (
                  <div className="mt-4 pt-4 border-t">
                    <SessionAnalytics sessionId={session.id} />
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching sessions found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilters({
                    searchTerm: "",
                    startDate: undefined,
                    endDate: undefined,
                    sortBy: "recent"
                  })}
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
