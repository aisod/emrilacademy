
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/components/resources/ResourceItem";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface ResourceQueryOptions {
  classId: string;
  searchTerm?: string;
  category?: string;
}

export function useResources({ classId, searchTerm, category }: ResourceQueryOptions) {
  return useQuery({
    queryKey: ["resources", classId, searchTerm, category],
    queryFn: async (): Promise<Resource[]> => {
      if (!classId) return [];
      
      // Build the base query with explicit type assertion
      let query = supabase
        .from("resources")
        .select("*")
        .eq("class_id", classId) as PostgrestFilterBuilder<any, any, any>;
      
      // Apply search filter if needed
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if needed
      if (category) {
        query = query.eq("category", category);
      }
      
      // Execute the query with sorting
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!classId,
  });
}
