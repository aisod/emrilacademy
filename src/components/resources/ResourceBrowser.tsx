
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResourceList } from "@/components/resources/ResourceList";
import { Search, RefreshCw, Filter } from "lucide-react";

interface ClassOption {
  id: string;
  title: string;
}

interface ResourceBrowserProps {
  classes: ClassOption[];
  isTeacher: boolean;
  onResourceChange: () => void;
}

// Define the resource type explicitly to prevent infinite type instantiation
interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
  category?: string;
  class_id: string;
}

export function ResourceBrowser({ classes, isTeacher, onResourceChange }: ResourceBrowserProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes.length > 0 ? classes[0].id : ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const categories = [
    { id: "", name: "All Categories" },
    { id: "general", name: "General" },
    { id: "lecture", name: "Lecture Notes" },
    { id: "assignment", name: "Assignment" },
    { id: "reading", name: "Reading Material" },
    { id: "reference", name: "Reference" }
  ];

  // Fix the TypeScript error by using a more explicit approach and avoiding complex type inference
  const fetchResources = async (): Promise<Resource[]> => {
    if (!selectedClassId) return [];
    
    let query = supabase
      .from("resources")
      .select("*")
      .eq("class_id", selectedClassId);
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return data as Resource[];
  };

  const { data: resources, isLoading, refetch } = useQuery<Resource[]>({
    queryKey: ["resources", selectedClassId, searchTerm, selectedCategory],
    queryFn: fetchResources,
    enabled: !!selectedClassId,
  });

  const handleRefresh = () => {
    refetch();
    onResourceChange();
  };

  const handleDelete = () => {
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-1/3">
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
              
              <div className="w-full md:flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh}
                className="hidden md:flex"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Filter by:</span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
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
        </CardContent>
      </Card>
      
      <div>
        {selectedClassId ? (
          <ResourceList
            classId={selectedClassId}
            isTeacher={isTeacher}
            onDelete={handleDelete}
            resources={resources}
            isLoading={isLoading}
          />
        ) : (
          <Card className="p-6">
            <p className="text-center text-gray-500">
              {classes.length === 0 
                ? "You are not enrolled in any classes"
                : "Select a class to view resources"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
