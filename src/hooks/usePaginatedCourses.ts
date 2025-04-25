import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Course } from "@/hooks/use-courses";

export interface CourseFilters {
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  minDuration?: number;
  maxDuration?: number;
  teacherId?: string;
}

interface CoursesResponse {
  courses: Course[];
  totalCount: number;
}

export function usePaginatedCourses(initialFilters: CourseFilters = {}) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string | null>(initialFilters.sortBy || null);
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [filters, setFilters] = useState<CourseFilters>({
    status: initialFilters.status || undefined,
    minDuration: initialFilters.minDuration,
    maxDuration: initialFilters.maxDuration,
    teacherId: initialFilters.teacherId
  });
  
  const offset = (currentPage - 1) * pageSize;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sort, filters]);

  const fetchCourses = async (): Promise<CoursesResponse> => {
    let query = supabase
      .from("courses")
      .select("*", { count: 'exact' })
      .range(offset, offset + pageSize - 1);

    // Add search filter if provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply teacher filter
    if (filters.teacherId) {
      query = query.eq('teacher_id', filters.teacherId);
    }

    // Apply duration filters
    if (filters.minDuration) {
      query = query.gte('duration_weeks', filters.minDuration);
    }
    if (filters.maxDuration) {
      query = query.lte('duration_weeks', filters.maxDuration);
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
        case "duration-asc":
          query = query.order("duration_weeks", { ascending: true });
          break;
        case "duration-desc":
          query = query.order("duration_weeks", { ascending: false });
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

  // Setup the query with proper caching
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["courses", currentPage, pageSize, sort, searchTerm, filters],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  // Prefetch next page - fixed to use data from the query result instead of a local variable
  const prefetchNextPage = useCallback(() => {
    if (currentPage < Math.ceil((data?.totalCount || 0) / pageSize)) {
      const nextPageOffset = currentPage * pageSize;
      
      let query = supabase
        .from("courses")
        .select("*")
        .range(nextPageOffset, nextPageOffset + pageSize - 1);
      
      // Apply the same filters as the current query
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (sort) {
        // Apply the same sort
        const [field, direction] = sort.split('-');
        if (field === 'newest') {
          query = query.order("created_at", { ascending: false });
        } else if (field === 'oldest') {
          query = query.order("created_at", { ascending: true });
        } else if (field === 'title') {
          query = query.order("title", { ascending: direction !== 'desc' });
        } else if (field === 'duration') {
          query = query.order("duration_weeks", { ascending: direction !== 'desc' });
        }
      }
      
      query.then(({ data: prefetchedData }) => {
        if (prefetchedData) {
          queryClient.setQueryData(
            ["courses", currentPage + 1, pageSize, sort, searchTerm, filters],
            { courses: prefetchedData, totalCount: data?.totalCount || 0 }
          );
        }
      });
    }
  }, [currentPage, pageSize, sort, searchTerm, filters, queryClient, data]);

  // Prefetch the next page when current page data is available
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      prefetchNextPage();
    }
  }, [data, isLoading, isFetching, prefetchNextPage]);

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

  const updateFilters = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    paginatedCourses,
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
