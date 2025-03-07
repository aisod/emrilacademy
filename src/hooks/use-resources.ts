
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
      
      // Start building our query with the base select and class_id filter
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
      
      // Add ordering
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Map the results to ensure type safety - explicitly construct Resource objects
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        file_url: item.file_url,
        created_at: item.created_at,
        category: item.category as string | undefined,
        class_id: item.class_id
      }));
    },
    enabled: !!classId,
  });
}
