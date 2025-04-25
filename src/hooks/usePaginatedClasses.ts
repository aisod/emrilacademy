
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Class {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  teacher_id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export function usePaginatedClasses(courseId?: string) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string | null>(null);

  const offset = (currentPage - 1) * pageSize;

  const fetchClasses = async () => {
    let query = supabase
      .from("classes")
      .select("*", { count: 'exact' })
      .range(offset, offset + pageSize - 1);
    
    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    // Add sorting with proper column mapping
    switch (sort) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "upcoming":
        query = query.order("start_time", { ascending: true });
        break;
      case "title-asc":
        query = query.order("title", { ascending: true });
        break;
      case "title-desc":
        query = query.order("title", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching classes:", error);
      return { classes: [], totalCount: 0 };
    }
    
    return { 
      classes: data || [], 
      totalCount: count || 0 
    };
  };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["classes", currentPage, pageSize, sort, courseId],
    queryFn: fetchClasses,
    placeholderData: (previousData) => previousData,
  });

  const paginatedClasses = data?.classes || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    paginatedClasses,
    isLoading,
    sort,
    setSort,
    pageSize,
    changePageSize,
    refetch,
    isFetching,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage
  };
}
