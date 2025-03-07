
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ResourceUpload } from "@/components/resources/ResourceUpload";

interface ClassOption {
  id: string;
  title: string;
}

interface ResourceUploadSectionProps {
  classes: ClassOption[];
  onSuccess: () => void;
}

export function ResourceUploadSection({ classes, onSuccess }: ResourceUploadSectionProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes.length > 0 ? classes[0].id : ""
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Class</label>
            <Select 
              value={selectedClassId} 
              onValueChange={setSelectedClassId}
              disabled={classes.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedClassId ? (
            <ResourceUpload 
              classId={selectedClassId}
              onSuccess={onSuccess} 
            />
          ) : (
            <p className="text-center py-6 text-gray-500">
              {classes.length === 0 
                ? "You don't have any classes to upload resources for"
                : "Select a class to upload resources"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
