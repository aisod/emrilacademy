
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
      
      // Start building our query
      let query = supabase
        .from("resources")
        .select("id, title, description, file_url, created_at, class_id, category");
      
      // Add the class_id filter
      query = query.eq("class_id", classId);
      
      // Apply search term filter if provided
      if (searchTerm) {
        // Use ilike for case-insensitive searching on title and description
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if provided
      if (category) {
        query = query.eq("category", category);
      }
      
      // Execute the query with sorting
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
      
      return (data || []) as Resource[];
    },
    enabled: !!classId,
  });
}
