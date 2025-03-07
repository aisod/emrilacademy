
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, File } from "lucide-react";
import { Resource } from "@/types/resources";

interface ResourceItemProps {
  resource: Resource;
  isTeacher?: boolean;
  onDelete: (id: string, filePath: string) => Promise<void>;
}

export function ResourceItem({ resource, isTeacher, onDelete }: ResourceItemProps) {
  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <h3 className="font-semibold text-gray-900 break-words">{resource.title}</h3>
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
