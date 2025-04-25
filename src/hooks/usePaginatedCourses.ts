
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Course } from "@/hooks/use-courses";

export function usePaginatedCourses() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const offset = (currentPage - 1) * pageSize;

  const fetchCourses = async () => {
    let query = supabase
      .from("courses")
      .select("*", { count: 'exact' })
      .range(offset, offset + pageSize - 1);

    // Add search filter if provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Add sorting
    if (sort) {
      switch (sort) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
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
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching courses:", error);
      return { courses: [], totalCount: 0 };
    }
    
    return { 
      courses: data as Course[], 
      totalCount: count || 0 
    };
  };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["courses", currentPage, pageSize, sort, searchTerm],
    queryFn: fetchCourses,
    placeholderData: (previousData) => previousData,
  });

  const paginatedCourses = data?.courses || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
    paginatedCourses,
    isLoading,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
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
