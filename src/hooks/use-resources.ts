
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/types/resources";
import { useToast } from "@/hooks/use-toast";

interface ResourceQueryOptions {
  classId: string;
  searchTerm?: string;
  category?: string;
}

export function useResources({ classId, searchTerm, category }: ResourceQueryOptions) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["resources", classId, searchTerm, category],
    queryFn: async (): Promise<Resource[]> => {
      if (!classId) return [];
      
      try {
        // Start building our query
        let query = supabase
          .from("resources")
          .select("*");
        
        // Add the class_id filter
        query = query.eq("class_id", classId);
        
        // Apply search term filter if provided
        if (searchTerm && searchTerm.trim() !== '') {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }
        
        // Apply category filter if provided
        if (category && category.trim() !== '') {
          query = query.eq("category", category);
        }
        
        // Execute the query with sorting
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data as Resource[];
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error loading resources",
          description: error.message || "Failed to load resources"
        });
        return [];
      }
    },
    enabled: !!classId,
  });
}
