
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassList } from "./ClassList";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentClassesViewProps {
  type: "enrolled" | "completed" | "saved";
}

const ITEMS_PER_PAGE = 6;

export function StudentClassesView({ type }: StudentClassesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["student-classes", type, sort],
    queryFn: async () => {
      try {
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

        const { data, error, count } = await query;

        if (error) throw error;

        // Set isEnrolled flag for each class
        return {
          classes: data.map(item => ({
            ...item,
            isEnrolled: true,
          })),
          totalCount: data.length
        };
      } catch (error: any) {
        console.error("Error fetching classes:", error);
        toast({
          variant: "destructive",
          title: "Error fetching classes",
          description: error.message,
        });
        return { classes: [], totalCount: 0 };
      }
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Show error state when query fails
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">Unable to load classes</h3>
        <p className="text-red-600 dark:text-red-400">Please try refreshing the page.</p>
        <Button 
          variant="outline" 
          className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    );
  }

  // Apply search filter
  const filteredClasses = data?.classes
    ? data.classes.filter(cls => 
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${cls.teacher.first_name} ${cls.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={sort} onValueChange={(value) => {
            setSort(value);
            setCurrentPage(1); // Reset to first page when sorting changes
          }}>
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

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-6">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state when no classes found */}
      {!isLoading && filteredClasses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            {searchTerm ? "No classes match your search" : "No classes found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {type === "enrolled" 
              ? "You haven't enrolled in any classes yet."
              : type === "completed" 
                ? "You haven't completed any classes yet."
                : "No saved classes found."
            }
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {!isLoading && filteredClasses.length > 0 && (
        <>
          <ClassList 
            classes={paginatedClasses} 
            isLoading={false} 
          />
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Loading indicator for background refetches */}
      {!isLoading && isFetching && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Updating...</span>
        </div>
      )}
    </div>
  );
}
