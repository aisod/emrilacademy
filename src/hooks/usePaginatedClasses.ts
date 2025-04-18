
import { useState, useEffect, useCallback } from 'react';
import { Class } from '@/components/classes/types';
import { usePagination } from './usePagination';

export function usePaginatedClasses(classes: Class[], searchTerm: string) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredClasses = classes?.filter(cls => 
    cls.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    cls.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    `${cls.teacher.first_name} ${cls.teacher.last_name}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
    currentPage,
    nextPage,
    prevPage,
    totalPages,
    pageSize,
    changePageSize,
    goToPage,
  };
}
