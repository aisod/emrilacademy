
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { getCategoryLabel, getCategoryColor, getFileIcon } from "./utils/resourceUtils";
import { Resource } from "@/types/resources";

interface ResourceItemProps {
  resource: Resource;
  isTeacher?: boolean;
  onDelete: (id: string, filePath: string) => Promise<void>;
}

export function ResourceItem({ resource, isTeacher, onDelete }: ResourceItemProps) {
  const iconName = getFileIcon(resource.file_url);
  
  // Import icons dynamically based on the file type
  const getIconComponent = () => {
    const { FileText, File, Image, Music, Video, Archive, Code } = require("lucide-react");
    
    switch (iconName) {
      case 'file-text':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'archive':
        return <Archive className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Get color classes based on category
  const getCategoryColorClasses = (category?: string | null) => {
    const colorName = getCategoryColor(category);
    return {
      badge: `border-${colorName}-200 bg-${colorName}-50 text-${colorName}-700`,
    };
  };

  const colorClasses = getCategoryColorClasses(resource.category);

  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {getIconComponent()}
            <h3 className="font-semibold text-gray-900 break-words">{resource.title}</h3>
            {resource.category && (
              <Badge 
                variant="outline" 
                className={colorClasses.badge}
              >
                {getCategoryLabel(resource.category)}
              </Badge>
            )}
          </div>
          {resource.description && (
            <p className="text-sm text-gray-500 break-words">{resource.description}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="h-8 px-2"
          >
            <a href={resource.file_url} target="_blank" rel="noopener noreferrer" aria-label="Download">
              <Download className="h-4 w-4" />
            </a>
          </Button>
          {isTeacher && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(resource.id, resource.file_url)}
              className="h-8 px-2"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
