
import { useState } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { SortOption } from "@/components/live-classes/filters/SortBySelect";

export interface SessionFilters {
  searchTerm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: SortOption;
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
      if (filters.searchTerm && !matchesSearchTerm(session, filters.searchTerm)) {
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

  // Helper function to check if session matches search term
  const matchesSearchTerm = (session: any, term: string): boolean => {
    const lowercaseTerm = term.toLowerCase();
    
    // Check class title
    if (session.classes?.title?.toLowerCase().includes(lowercaseTerm)) {
      return true;
    }
    
    // Check alternative class title location
    if (session.class?.title?.toLowerCase().includes(lowercaseTerm)) {
      return true;
    }
    
    // Check teacher name
    if (session.classes?.teacher?.first_name && session.classes?.teacher?.last_name) {
      const teacherName = `${session.classes.teacher.first_name} ${session.classes.teacher.last_name}`.toLowerCase();
      if (teacherName.includes(lowercaseTerm)) {
        return true;
      }
    }
    
    // Check alternative teacher name location
    if (session.class?.teacher?.first_name && session.class?.teacher?.last_name) {
      const teacherName = `${session.class.teacher.first_name} ${session.class.teacher.last_name}`.toLowerCase();
      if (teacherName.includes(lowercaseTerm)) {
        return true;
      }
    }
    
    return false;
  };

  return {
    filters,
    setFilters,
    filteredSessions
  };
}
