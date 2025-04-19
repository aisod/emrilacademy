
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSessionsList } from "@/components/live-classes/ActiveSessionsList";
import { SessionHistoryList } from "@/components/live-classes/SessionHistoryList";
import { LiveClassesHeader } from "./LiveClassesHeader";
import { useActiveSessions } from "@/hooks/use-active-sessions";
import { useSessionHistory } from "@/hooks/use-session-history";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";
import { useState } from "react";
import { useFilteredSessions } from "@/hooks/use-filtered-sessions";
import { SessionFilterOptions } from "./SessionHistoryFilter";
import { useToast } from "@/components/ui/use-toast";
import { trackEvent } from "@/lib/analytics";

export function LiveClassesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const { toast } = useToast();
  
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

  // Set up real-time subscription for session updates
  useSupabaseSubscription('class_sessions', () => {
    if (activeTab === "active") {
      refetchActiveSessions();
    } else {
      refetchSessionHistory();
    }
  });

  const handleTabChange = (value: string) => {
    const tabValue = value as "active" | "history";
    setActiveTab(tabValue);
    trackEvent("class_view", { action: "change_tab", tab: tabValue });
    
    // Refresh data when switching tabs
    if (tabValue === "active") {
      refetchActiveSessions();
    } else {
      refetchSessionHistory();
    }
  };

  const handleFilterChange = (filters: SessionFilterOptions) => {
    // This would be expanded to handle all filter options
    setSearchQuery(filters.searchTerm);
    trackEvent("class_view", { 
      action: "apply_filters",
      has_search: !!filters.searchTerm,
      has_date_filter: !!(filters.startDate || filters.endDate)
    });
  };

  const handleRefresh = () => {
    if (activeTab === "active") {
      refetchActiveSessions();
    } else {
      refetchSessionHistory();
    }
    
    toast({
      title: "Data refreshed",
      description: "The latest session data has been loaded.",
    });
  };

  // First use the useFilteredSessions hook to filter by search query
  const filteredActiveSessions = useFilteredSessions(activeSessions, searchQuery);
  const filteredHistorySessions = useFilteredSessions(sessionHistory, searchQuery);

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <LiveClassesHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
      />

      <Tabs defaultValue="active" className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="active" data-testid="active-tab">Active Sessions</TabsTrigger>
          <TabsTrigger value="history" data-testid="history-tab">Session History</TabsTrigger>
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
