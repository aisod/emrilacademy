
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useResourceDeletion() {
  const { toast } = useToast();

  const deleteResource = async (id: string, filePath: string) => {
    try {
      // Extract the path from the full URL
      const filePathParts = filePath.split('/');
      const bucketPath = filePathParts.slice(filePathParts.indexOf('resources') + 1).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("resources")
        .remove([bucketPath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return false;
    }
  };

  return { deleteResource };
}
