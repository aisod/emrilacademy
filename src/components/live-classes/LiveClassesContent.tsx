
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSessionsList } from "@/components/live-classes/ActiveSessionsList";
import { SessionHistoryList } from "@/components/live-classes/SessionHistoryList";
import { LiveClassesHeader } from "./LiveClassesHeader";
import { useActiveSessions } from "@/hooks/use-active-sessions";
import { useSessionHistory } from "@/hooks/use-session-history";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";
import { useState } from "react";
import { useFilteredSessions } from "@/hooks/use-filtered-sessions";

export function LiveClassesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    data: activeSessions,
    refetch: refetchActiveSessions,
    isLoading: activeSessionsLoading,
    error: activeSessionsError
  } = useActiveSessions();

  const { 
    data: sessionHistory,
    refetch: refetchSessionHistory,
    isLoading: historyLoading,
    error: historyError
  } = useSessionHistory();

  useSupabaseSubscription('class_sessions', () => {
    refetchActiveSessions();
    refetchSessionHistory();
  });

  const filteredActiveSessions = useFilteredSessions(activeSessions, searchQuery);
  const filteredHistorySessions = useFilteredSessions(sessionHistory, searchQuery);

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <LiveClassesHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ActiveSessionsList 
            activeSessions={filteredActiveSessions} 
            isLoading={activeSessionsLoading}
          />
          {activeSessionsError && (
            <p className="text-red-500 mt-4">Error loading active sessions. Please try again.</p>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <SessionHistoryList 
            sessionHistory={filteredHistorySessions || []} 
            isLoading={historyLoading}
          />
          {historyError && (
            <p className="text-red-500 mt-4">Error loading session history. Please try again.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
