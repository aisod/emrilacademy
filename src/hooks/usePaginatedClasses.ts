
import { useState, useEffect, useCallback } from 'react';
import { Class } from '@/components/classes/types';
import { usePagination } from './usePagination';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePaginatedClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Fetch classes from database
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['classes', sort],
    queryFn: async () => {
      let query = supabase
        .from('classes')
        .select(`
          *,
          enrollments:enrollments(count)
        `);

      // Apply sorting
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sort === 'upcoming') {
        query = query.order('start_time', { ascending: true });
      } else if (sort === 'title-asc') {
        query = query.order('title', { ascending: true });
      } else if (sort === 'title-desc') {
        query = query.order('title', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredClasses = data?.filter(cls => 
    cls.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    cls.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ) ?? [];

  const { 
    currentPage,
    nextPage,
    prevPage,
    paginatedData,
    totalPages,
    pageSize,
    changePageSize,
    resetPagination,
    goToPage,
  } = usePagination({
    initialPage: 1,
    initialPageSize: 8,
    totalItems: filteredClasses.length
  });

  const paginatedClasses = paginatedData(filteredClasses);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearchTerm, resetPagination]);

  return {
    filteredClasses,
    paginatedClasses,
    isLoading,
    isFetching,
    currentPage,
    nextPage,
    prevPage,
    totalPages,
    pageSize,
    sort,
    setSort,
    setSearchTerm,
    changePageSize,
    setPageSize: changePageSize, // Alias for backward compatibility
    goToPage,
    refetch,
    resetPagination,
    classes: paginatedClasses // Provide classes alias for backward compatibility
  };
}
