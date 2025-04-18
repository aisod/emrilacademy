import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassList } from "./ClassList";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { debounce } from "lodash";

interface StudentClassesViewProps {
  type: "enrolled" | "completed" | "saved";
}

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16];
const DEFAULT_PAGE_SIZE = 8;

export function StudentClassesView({ type }: StudentClassesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const { toast } = useToast();

  // Set up debounced search term
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchTerm]);
  
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["student-classes", type, sort, debouncedSearchTerm],
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
        const classes = data.map(item => ({
          ...item,
          isEnrolled: true,
        }));

        return {
          classes,
          totalCount: classes.length
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

  // Apply search filter
  const filteredClasses = data?.classes
    ? data.classes.filter(cls => 
        cls.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        `${cls.teacher.first_name} ${cls.teacher.last_name}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : [];
  
  // Set up pagination
  const { 
    currentPage,
    nextPage,
    prevPage,
    paginatedData,
    totalPages,
    pageSize,
    changePageSize,
    resetPagination
  } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
    totalItems: filteredClasses.length
  });
  
  // Get current page of classes
  const paginatedClasses = paginatedData(filteredClasses);
  
  // Reset pagination when search or sort changes
  useEffect(() => {
    resetPagination();
  }, [debouncedSearchTerm, sort, type, resetPagination]);

  // Refresh data
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing classes",
      description: "Getting the latest class information",
    });
  };

  // Show error state when query fails
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">Unable to load classes</h3>
        <p className="text-red-600 dark:text-red-400">Please try refreshing the page.</p>
        <Button 
          variant="outline" 
          className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

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
          <Select value={sort} onValueChange={(value) => setSort(value)}>
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
              <div className="py-4 space-y-4">
                <h3 className="text-lg font-medium mb-4">Filter Classes</h3>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Results per page</h4>
                  <div className="flex flex-wrap gap-2">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <Button
                        key={size}
                        variant={pageSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => changePageSize(size)}
                        className="h-8"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-gray-500 text-sm">More filter options coming soon.</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleRefresh} disabled={isFetching}>
            {isFetching ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Calendar
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
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
            {debouncedSearchTerm ? "No classes match your search" : "No classes found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {type === "enrolled" 
              ? "You haven't enrolled in any classes yet."
              : type === "completed" 
                ? "You haven't completed any classes yet."
                : "No saved classes found."
            }
          </p>
          {debouncedSearchTerm && (
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
            <div className="flex items-center justify-between gap-2 mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredClasses.length)} of {filteredClasses.length}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNumber: number;
                    
                    // Refactored page number logic
                    if (totalPages > 5) {
                      if (currentPage <= 3) {
                        pageNumber = i < 4 ? i + 1 : totalPages;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = i === 0 ? 1 : totalPages - 4 + i;
                      } else {
                        pageNumber = i === 0 ? 1 : (i === 4 ? totalPages : currentPage - 1 + i);
                      }
                    } else {
                      pageNumber = i + 1;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          // Type-safe page navigation
                          if (typeof pageNumber === 'number') {
                            // Use goToPage from usePagination hook for safer navigation
                            goToPage(pageNumber);
                          }
                        }}
                        className="h-8 w-8 p-0"
                        aria-label={`Go to page ${pageNumber}`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading indicator for background refetches */}
      {!isLoading && isFetching && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500 flex items-center justify-center">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Updating...
          </span>
        </div>
      )}
    </div>
  );
}
