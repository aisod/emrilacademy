
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassGrid } from "./ClassGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function TeacherClassesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const { data: classes, isLoading, refetch } = useQuery({
    queryKey: ["teacher-classes-view", sort],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      let query = supabase
        .from("classes")
        .select(`
          *,
          enrollments:enrollments(count)
        `)
        .eq("teacher_id", session.user.id);

      // Apply sorting
      if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (sort === "upcoming") {
        query = query.order("start_time", { ascending: true });
      } else if (sort === "title-asc") {
        query = query.order("title", { ascending: true });
      } else if (sort === "title-desc") {
        query = query.order("title", { ascending: false });
      } else if (sort === "popularity") {
        query = query.order("enrollments.count", { ascending: false, referencedTable: "enrollments" });
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching classes",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  const filteredClasses = classes
    ? classes.filter(cls => 
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleClassCreated = () => {
    setShowCreateForm(false);
    refetch();
    toast({
      title: "Class created successfully",
      description: "Your new class has been created.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="title-asc">A-Z</SelectItem>
              <SelectItem value="title-desc">Z-A</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h3 className="text-lg font-medium mb-4">Filter Classes</h3>
                {/* Placeholder for future filter options */}
                <p className="text-gray-500">Filter options coming soon.</p>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <CreateClassForm onSuccess={handleClassCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ClassGrid 
        classes={filteredClasses} 
        isLoading={isLoading} 
        teacherView={true}
      />
    </div>
  );
}
