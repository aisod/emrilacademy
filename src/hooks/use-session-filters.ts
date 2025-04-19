
import { useState } from "react";
import { startOfDay, endOfDay } from "date-fns";

export interface SessionFilters {
  searchTerm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: "recent" | "duration" | "participants";
}

export function useSessionFilters() {
  const [filters, setFilters] = useState<SessionFilters>({
    searchTerm: "",
    startDate: undefined,
    endDate: undefined,
    sortBy: "recent"
  });

  const filteredSessions = (sessions: any[] | undefined) => {
    if (!sessions) return [];
    
    return sessions.filter(session => {
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
    }).sort((a, b) => {
      if (filters.sortBy === "recent") {
        return new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime();
      } else if (filters.sortBy === "duration") {
        return (b.duration_seconds || 0) - (a.duration_seconds || 0);
      } else if (filters.sortBy === "participants") {
        return (b.participant_count || 0) - (a.participant_count || 0);
      }
      return 0;
    });
  };

  return {
    filters,
    setFilters,
    filteredSessions
  };
}
