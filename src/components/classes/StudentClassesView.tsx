import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClassList } from "./ClassList";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "./SearchBar";
import { ClassFilters } from "./ClassFilters";
import { PaginationControls } from "./PaginationControls";
import { usePaginatedClasses } from "@/hooks/usePaginatedClasses";

interface StudentClassesViewProps {
  type: "enrolled" | "completed" | "saved";
}

export function StudentClassesView({ type }: StudentClassesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const { toast } = useToast();
  
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["student-classes", type, sort],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

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

        if (type === "completed") {
          query = query.lt("end_time", new Date().toISOString());
        } else if (type === "enrolled") {
          query = query.gte("end_time", new Date().toISOString());
        }

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
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  const {
    filteredClasses,
    paginatedClasses,
    currentPage,
    nextPage,
    prevPage,
    totalPages,
    pageSize,
    changePageSize,
    goToPage,
  } = usePaginatedClasses(data?.classes || [], searchTerm);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing classes",
      description: "Getting the latest class information",
    });
  };

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
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <ClassFilters
          sort={sort}
          onSortChange={setSort}
          pageSize={pageSize}
          onPageSizeChange={changePageSize}
          onRefresh={handleRefresh}
          isFetching={isFetching}
        />
      </div>

      <ClassList 
        classes={paginatedClasses} 
        isLoading={isLoading} 
      />

      {!isLoading && filteredClasses.length > 0 && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredClasses.length}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPrevPage={prevPage}
          onNextPage={nextPage}
        />
      )}

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
