
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/types/resources";

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
      
      // Apply filters using a different approach
      let filteredQuery = query;
      
      // Apply search term filter if provided
      if (searchTerm) {
        filteredQuery = filteredQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if provided
      if (category) {
        filteredQuery = filteredQuery.eq("category", category);
      }
      
      // Execute the query with sorting
      const { data, error } = await filteredQuery.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Map the results to ensure type safety
      const resources: Resource[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        file_url: item.file_url,
        created_at: item.created_at,
        category: item.category,
        class_id: item.class_id
      }));
      
      return resources;
    },
    enabled: !!classId,
  });
}
