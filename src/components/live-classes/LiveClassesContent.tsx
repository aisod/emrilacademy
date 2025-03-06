
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSessionsList } from "@/components/live-classes/ActiveSessionsList";
import { SessionHistoryList } from "@/components/live-classes/SessionHistoryList";
import { useActiveSessions } from "@/hooks/use-active-sessions";
import { useSessionHistory } from "@/hooks/use-session-history";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";

export function LiveClassesContent() {
  const { 
    data: activeSessions,
    refetch: refetchActiveSessions
  } = useActiveSessions();

  const { 
    data: sessionHistory,
    refetch: refetchSessionHistory
  } = useSessionHistory();

  // Use the custom hook for Supabase subscription
  useSupabaseSubscription('class_sessions', () => {
    refetchActiveSessions();
    refetchSessionHistory();
  });

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Live Class Sessions</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ActiveSessionsList activeSessions={activeSessions} />
        </TabsContent>
        
        <TabsContent value="history">
          <SessionHistoryList sessionHistory={sessionHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
