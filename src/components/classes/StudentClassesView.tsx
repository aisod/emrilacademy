import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClassList } from "./ClassList";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "./SearchBar";
import { ClassFilters } from "./ClassFilters";
import { PaginationControls } from "./PaginationControls";
import { usePaginatedClasses } from "@/hooks/usePaginatedClasses";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { RefreshCw } from "lucide-react";

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

        const { data, error } = await query;

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
        throw error;
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRefresh={handleRefresh} />;
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
