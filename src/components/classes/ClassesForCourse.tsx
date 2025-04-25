import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassGrid } from "./ClassGrid";
import { usePaginatedClasses } from "@/hooks/usePaginatedClasses";
import { ClassFilters } from "./ClassFilters";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
export function ClassesForCourse() {
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const {
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
  } = usePaginatedClasses();
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Classes</h2>
        <Button onClick={() => setShowCreateClassForm(true)} className="text-sky-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      <ClassFilters sort={sort} onSortChange={setSort} pageSize={pageSize} onPageSizeChange={changePageSize} onRefresh={refetch} isFetching={isFetching} />

      <ClassGrid classes={paginatedClasses || []} isLoading={isLoading} teacherView={true} />

      {/* Pagination controls */}
      {!isLoading && paginatedClasses && paginatedClasses.length > 0 && <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => prevPage()} className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>
            
            {Array.from({
          length: Math.min(5, totalPages)
        }, (_, i) => {
          // Logic to show pagination numbers
          let pageNum = i + 1;
          if (totalPages > 5 && currentPage > 3) {
            pageNum = currentPage - 3 + i;
            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
          }
          return <PaginationItem key={i}>
                  <PaginationLink onClick={() => goToPage(pageNum)} isActive={currentPage === pageNum}>
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>;
        })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>}
            
            <PaginationItem>
              <PaginationNext onClick={() => nextPage()} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>}

      <Dialog open={showCreateClassForm} onOpenChange={setShowCreateClassForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <CreateClassForm onSuccess={() => {
          setShowCreateClassForm(false);
          refetch();
        }} />
        </DialogContent>
      </Dialog>
    </div>;
}