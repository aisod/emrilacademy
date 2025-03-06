
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseSubscription(
  tableName: string,
  onChangeCallback: () => void,
  filter?: { column: string; value: any }
) {
  useEffect(() => {
    let channel = supabase.channel(`${tableName}-changes`);
    
    const config = {
      event: '*' as const,
      schema: 'public',
      table: tableName,
    };
    
    // Add filter if provided
    if (filter) {
      config['filter'] = `${filter.column}=eq.${filter.value}`;
    }
    
    channel = channel.on('postgres_changes', config, () => {
      onChangeCallback();
    });
    
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, onChangeCallback, filter?.column, filter?.value]);
}
