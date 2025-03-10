
import { Button } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Trash2, FileText, File, Image, Music, Video, Archive, Code } from "lucide-react";
import { getCategoryLabel, getCategoryColor } from "./utils/resourceUtils";

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
  category?: string;
}

interface ResourceItemProps {
  resource: Resource;
  isTeacher?: boolean;
  onDelete: (id: string, filePath: string) => Promise<void>;
}

export function ResourceItem({ resource, isTeacher, onDelete }: ResourceItemProps) {
  const renderIcon = () => {
    const iconName = getFileIconComponent(resource.file_url);
    return iconName;
  };

  const getFileIconComponent = (fileUrl: string) => {
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

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {renderIcon()}
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
              onClick={() => onDelete(resource.id, resource.file_url)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
