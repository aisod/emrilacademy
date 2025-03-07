
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/types/resources";
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
      
      // Create an explicitly typed query builder to avoid deep type inference
      let query = supabase
        .from("resources")
        .select("*")
        .eq("class_id", classId);
      
      // Apply filters separately to avoid complex type chaining
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (category) {
        query = query.eq("category", category);
      }
      
      // Execute the final query
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Explicitly cast the result to our Resource type
      return (data || []) as Resource[];
    },
    enabled: !!classId,
  });
}
