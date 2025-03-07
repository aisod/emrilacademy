
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/components/resources/ResourceItem";

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
      
      // Build the base query
      const query = supabase
        .from("resources")
        .select("*")
        .eq("class_id", classId);
      
      // Apply search filter if needed
      const filteredQuery = searchTerm 
        ? query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`) 
        : query;
      
      // Apply category filter if needed
      const finalQuery = category 
        ? filteredQuery.eq("category", category) 
        : filteredQuery;
      
      // Execute the query
      const { data, error } = await finalQuery.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!classId,
  });
}
