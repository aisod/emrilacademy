
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
  isError?: boolean;
}

export function ResourceList({ 
  classId, 
  isTeacher, 
  onDelete,
  resources,
  isLoading,
  isError
}: ResourceListProps) {
  const { deleteResource } = useResourceDeletion();

  const handleDelete = async (id: string, filePath: string) => {
    const success = await deleteResource(id, filePath);
    if (success && onDelete) {
      onDelete();
    }
  };

  // Show loading, error or empty state
  if (isLoading || isError || !resources?.length) {
    return (
      <ResourceListState 
        isLoading={!!isLoading} 
        isError={!!isError}
        isEmpty={!isLoading && !isError && !resources?.length} 
      />
    );
  }

  // Show resources
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
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
