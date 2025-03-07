
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Trash2, FileText, File, Image, Music, Video, Archive, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
  category?: string;
}

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
  const { toast } = useToast();

  // Only fetch resources if they're not provided externally
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("class_id", classId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !externalResources && !!classId,
  });

  // Use external resources if provided, otherwise use fetched resources
  const resourcesData = externalResources || resources;
  const loadingState = externalLoading !== undefined ? externalLoading : isLoading;

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "lecture":
        return "Lecture Notes";
      case "assignment":
        return "Assignment";
      case "reading":
        return "Reading Material";
      case "reference":
        return "Reference";
      default:
        return "General";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "lecture":
        return "blue";
      case "assignment":
        return "yellow";
      case "reading":
        return "green";
      case "reference":
        return "purple";
      default:
        return "gray";
    }
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <Image className="h-4 w-4" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className="h-4 w-4" />;
      case 'mp4':
      case 'webm':
      case 'avi':
      case 'mov':
        return <Video className="h-4 w-4" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
        return <Archive className="h-4 w-4" />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
        return <Code className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
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

      onDelete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loadingState) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (!resourcesData?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No resources available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resourcesData.map((resource) => (
        <Card key={resource.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getFileIcon(resource.file_url)}
                <h3 className="font-semibold">{resource.title}</h3>
                {resource.category && (
                  <Badge variant="outline" className={`text-${getCategoryColor(resource.category)}-500 border-${getCategoryColor(resource.category)}-200 bg-${getCategoryColor(resource.category)}-50`}>
                    {getCategoryLabel(resource.category)}
                  </Badge>
                )}
              </div>
              {resource.description && (
                <p className="text-sm text-gray-500">{resource.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                asChild
              >
                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              {isTeacher && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(resource.id, resource.file_url)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
