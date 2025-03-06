
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSessionsList } from "@/components/live-classes/ActiveSessionsList";
import { SessionHistoryList } from "@/components/live-classes/SessionHistoryList";
import { useActiveSessions } from "@/hooks/use-active-sessions";
import { useSessionHistory } from "@/hooks/use-session-history";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

  // Use the custom hook for Supabase subscription
  useSupabaseSubscription('class_sessions', () => {
    refetchActiveSessions();
    refetchSessionHistory();
  });

  // Filter sessions based on search query
  const filteredActiveSessions = activeSessions?.filter(session => 
    session.class.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${session.class.teacher.first_name} ${session.class.teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistorySessions = sessionHistory?.filter(session =>
    session.classes?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Live Class Sessions</h1>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search sessions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

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
            sessionHistory={filteredHistorySessions} 
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
