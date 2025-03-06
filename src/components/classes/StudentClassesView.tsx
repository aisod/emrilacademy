
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassList } from "./ClassList";
import { Button } from "@/components/ui/button";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

interface StudentClassesViewProps {
  type: "enrolled" | "completed" | "saved";
}

export function StudentClassesView({ type }: StudentClassesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const { toast } = useToast();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["student-classes", type, sort],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Determine query based on type
      let query = supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          ),
          enrollments:enrollments(count),
          enrolled:enrollments!inner(student_id)
        `)
        .eq("enrolled.student_id", session.user.id);

      // Filter for completed classes (classes with past end times)
      if (type === "completed") {
        query = query.lt("end_time", new Date().toISOString());
      } else if (type === "enrolled") {
        query = query.gte("end_time", new Date().toISOString());
      }

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

      // Set isEnrolled flag for each class
      return data.map(item => ({
        ...item,
        isEnrolled: true,
      }));
    },
  });

  const filteredClasses = classes
    ? classes.filter(cls => 
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${cls.teacher.first_name} ${cls.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
        </div>
      </div>

      <ClassList 
        classes={filteredClasses} 
        isLoading={isLoading} 
      />
    </div>
  );
}
