
import { useMemo } from "react";

export function useFilteredSessions(sessions: any[] | undefined, searchQuery: string) {
  return useMemo(() => {
    if (!sessions) return [];
    
    return sessions.filter(session => 
      session.class.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${session.class.teacher.first_name} ${session.class.teacher.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [sessions, searchQuery]);
}
