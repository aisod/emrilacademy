
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceItem } from "./ResourceItem";
import { ResourceListState } from "./ResourceListState";
import { useResourceDeletion } from "@/hooks/use-resource-deletion";
import { Resource } from "@/types/resources";

interface ResourceListProps {
  classId: string;
  isTeacher?: boolean;
  onDelete?: () => void;
  resources?: Resource[];
  isLoading?: boolean;
}

export function ResourceList({ 
  classId, 
  isTeacher, 
  onDelete,
  resources: externalResources,
  isLoading: externalLoading
}: ResourceListProps) {
  const { deleteResource } = useResourceDeletion();

  // Only fetch resources if they're not provided externally
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description, file_url, created_at, class_id, category")
        .eq("class_id", classId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Resource[];
    },
    enabled: !externalResources && !!classId,
  });

  // Use external resources if provided, otherwise use fetched resources
  const resourcesData = externalResources || resources;
  const loadingState = externalLoading !== undefined ? externalLoading : isLoading;

  const handleDelete = async (id: string, filePath: string) => {
    const success = await deleteResource(id, filePath);
    if (success && onDelete) {
      onDelete();
    }
  };

  // Show loading or empty state
  if (loadingState || !resourcesData?.length) {
    return (
      <ResourceListState 
        isLoading={loadingState} 
        isEmpty={!loadingState && !resourcesData?.length} 
      />
    );
  }

  // Show resources
  return (
    <div className="space-y-4">
      {resourcesData.map((resource) => (
        <ResourceItem 
          key={resource.id} 
          resource={resource} 
          isTeacher={isTeacher} 
          onDelete={handleDelete} 
        />
      ))}
    </div>
  );
}
