
import { useMemo } from "react";

export function useFilteredSessions(sessions: any[] | undefined, searchQuery: string) {
  return useMemo(() => {
    if (!sessions) return [];
    
    if (!searchQuery) return sessions;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return sessions.filter(session => {
      // Handle potential undefined values
      if (!session) return false;
      
      // Check if session.class exists and has title
      if (session.class?.title && 
          session.class.title.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Check if session.classes exists and has title (for data structure consistency)
      if (session.classes?.title && 
          session.classes.title.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Check teacher name if available
      if (session.class?.teacher?.first_name && session.class?.teacher?.last_name) {
        const teacherName = `${session.class.teacher.first_name} ${session.class.teacher.last_name}`.toLowerCase();
        if (teacherName.includes(lowerCaseQuery)) {
          return true;
        }
      }
      
      return false;
    });
  }, [sessions, searchQuery]);
}
