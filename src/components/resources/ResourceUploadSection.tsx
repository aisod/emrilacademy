
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
  
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  
  const categories = [
    { id: "general", name: "General" },
    { id: "lecture", name: "Lecture Notes" },
    { id: "assignment", name: "Assignment" },
    { id: "reading", name: "Reading Material" },
    { id: "reference", name: "Reference" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedClassId ? (
            <ResourceUpload 
              classId={selectedClassId} 
              category={selectedCategory}
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
