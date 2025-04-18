import { useState, useCallback, useMemo } from "react";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0,
}: PaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return totalItems ? Math.max(1, Math.ceil(totalItems / pageSize)) : 0;
  }, [totalItems, pageSize]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  const paginatedData = useCallback(
    <T>(data: T[]) => {
      if (!data?.length) return [];
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, data.length);
      return data.slice(startIndex, endIndex);
    },
    [currentPage, pageSize]
  );

  const changePageSize = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      // Adjust current page to keep items in view when possible
      const newTotalPages = Math.ceil(totalItems / newSize);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    },
    [currentPage, totalItems]
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    paginatedData,
    changePageSize,
    resetPagination,
  };
}
