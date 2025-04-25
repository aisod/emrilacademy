import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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

export interface ClassFilters {
  searchTerm?: string;
  classType?: Database["public"]["Enums"]["class_type"] | null;
  teacherId?: string;
  startDateMin?: string;
  startDateMax?: string;
}

interface ClassesResponse {
  classes: Class[];
  totalCount: number;
}

export function usePaginatedClasses(courseId?: string, initialFilters: ClassFilters = {}) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [filters, setFilters] = useState<ClassFilters>({
    classType: initialFilters.classType,
    teacherId: initialFilters.teacherId,
    startDateMin: initialFilters.startDateMin,
    startDateMax: initialFilters.startDateMax,
  });

  const offset = (currentPage - 1) * pageSize;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sort, courseId, filters]);

  const fetchClasses = async (): Promise<ClassesResponse> => {
    let query = supabase
      .from("classes")
      .select("*", { count: 'exact' })
      .range(offset, offset + pageSize - 1);
    
    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    // Add search filter if provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply class type filter
    if (filters.classType) {
      query = query.eq('class_type', filters.classType);
    }

    // Apply teacher filter
    if (filters.teacherId) {
      query = query.eq('teacher_id', filters.teacherId);
    }

    // Apply date range filters
    if (filters.startDateMin) {
      query = query.gte('start_time', filters.startDateMin);
    }
    if (filters.startDateMax) {
      query = query.lte('start_time', filters.startDateMax);
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

  // Setup the query with proper caching
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["classes", currentPage, pageSize, sort, searchTerm, filters, courseId],
    queryFn: fetchClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  // Prefetch next page - fixed to use data from the query result instead of a local variable
  const prefetchNextPage = useCallback(() => {
    if (currentPage < Math.ceil((data?.totalCount || 0) / pageSize)) {
      const nextPageOffset = currentPage * pageSize;
      
      let query = supabase
        .from("classes")
        .select("*")
        .range(nextPageOffset, nextPageOffset + pageSize - 1);
      
      if (courseId) {
        query = query.eq("course_id", courseId);
      }
      
      // Apply the same filters as the current query
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (filters.classType) {
        query = query.eq('class_type', filters.classType);
      }

      if (sort) {
        // Apply the same sort
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
        }
      }
      
      query.then(({ data: prefetchedData }) => {
        if (prefetchedData) {
          queryClient.setQueryData(
            ["classes", currentPage + 1, pageSize, sort, searchTerm, filters, courseId],
            { classes: prefetchedData, totalCount: data?.totalCount || 0 }
          );
        }
      });
    }
  }, [currentPage, pageSize, sort, searchTerm, filters, courseId, queryClient, data]);

  // Prefetch the next page when current page data is available
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      prefetchNextPage();
    }
  }, [data, isLoading, isFetching, prefetchNextPage]);

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

  const updateFilters = (newFilters: Partial<ClassFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    paginatedClasses,
    isLoading,
    isFetching,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
    pageSize,
    changePageSize,
    refetch,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    prevPage
  };
}
