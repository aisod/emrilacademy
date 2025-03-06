
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseSubscription(
  table: string, 
  callback: () => void,
  filter?: string | Record<string, any>
) {
  useEffect(() => {
    // Create channel name based on table and any filter provided
    const channelName = filter 
      ? `${table}-${typeof filter === 'string' ? filter : JSON.stringify(filter)}`
      : table;
    
    // Set up subscription filter
    const subscriptionFilter = typeof filter === 'object' 
      ? filter 
      : {};
    
    // Subscribe to changes
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...subscriptionFilter
        },
        () => {
          // Call the callback when changes are detected
          callback();
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, filter]);
}
