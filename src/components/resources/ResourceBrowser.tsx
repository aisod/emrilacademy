
import { useState, useEffect } from "react";
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
import { useResources } from "@/hooks/use-resources";
import { useToast } from "@/hooks/use-toast";

interface ClassOption {
  id: string;
  title: string;
}

interface ResourceBrowserProps {
  classes: ClassOption[];
  isTeacher: boolean;
  onResourceChange: () => void;
}

export function ResourceBrowser({ classes, isTeacher, onResourceChange }: ResourceBrowserProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes.length > 0 ? classes[0].id : ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  
  // Reset search and category when class changes
  useEffect(() => {
    setSearchTerm("");
    setSelectedCategory("all");
  }, [selectedClassId]);
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "general", name: "General" },
    { id: "lecture", name: "Lecture Notes" },
    { id: "assignment", name: "Assignment" },
    { id: "reading", name: "Reading Material" },
    { id: "reference", name: "Reference" }
  ];

  const { data: resources, isLoading, refetch, isError } = useResources({
    classId: selectedClassId,
    searchTerm: searchTerm,
    category: selectedCategory === "all" ? "" : selectedCategory
  });

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error loading resources",
        description: "Failed to load resources. Please try again."
      });
    }
  }, [isError, toast]);

  const handleRefresh = () => {
    refetch();
    onResourceChange();
  };

  const handleDelete = () => {
    handleRefresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
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
              
              <form onSubmit={handleSearch} className="w-full md:flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="secondary" className="hidden md:flex">
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  type="button"
                  className="hidden md:flex"
                  title="Refresh resources"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Filter by:</span>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  refetch();
                }}
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
