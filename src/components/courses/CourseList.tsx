
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaginatedCourses } from "@/hooks/usePaginatedCourses";
import { Loader2, Search, SlidersHorizontal, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Course } from "@/hooks/use-courses";
import { useUserRole } from "@/hooks/use-user-role";

export function CourseList() {
  const { toast } = useToast();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 52]); // 1-52 weeks
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const {
    data: userRole
  } = useUserRole();
  
  const isTeacher = userRole === "teacher";

  const {
    paginatedCourses,
    isLoading,
    isFetching,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    prevPage,
    refetch
  } = usePaginatedCourses({
    status: statusFilter
  });

  const handleFilterApply = () => {
    updateFilters({
      minDuration: durationRange[0],
      maxDuration: durationRange[1],
      status: statusFilter
    });
    setFiltersOpen(false);
    toast({
      title: "Filters applied",
      description: `Showing courses with duration between ${durationRange[0]}-${durationRange[1]} weeks${statusFilter ? ` and status '${statusFilter}'` : ''}`,
    });
  };

  const handleFilterReset = () => {
    setDurationRange([1, 52]);
    setStatusFilter(undefined);
    updateFilters({
      minDuration: undefined,
      maxDuration: undefined,
      status: undefined
    });
    setFiltersOpen(false);
    toast({
      title: "Filters reset",
      description: "Showing all courses"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sort || ""} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="duration-asc">Duration (shortest)</SelectItem>
              <SelectItem value="duration-desc">Duration (longest)</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(filters.minDuration || filters.maxDuration || filters.status) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">•</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Courses</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Duration (weeks)</Label>
                  <div className="pt-6 pb-2">
                    <Slider
                      defaultValue={[1, 52]}
                      value={durationRange}
                      onValueChange={values => setDurationRange(values as [number, number])}
                      min={1}
                      max={52}
                      step={1}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div>{durationRange[0]} weeks</div>
                    <div>{durationRange[1]} weeks</div>
                  </div>
                </div>

                {isTeacher && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter || ""} onValueChange={val => setStatusFilter(val || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleFilterReset}>Reset</Button>
                  <Button onClick={handleFilterApply}>Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.minDuration || filters.maxDuration || filters.status) && (
        <div className="flex flex-wrap gap-2">
          {filters.minDuration && filters.maxDuration && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.minDuration === filters.maxDuration 
                ? `${filters.minDuration} weeks` 
                : `${filters.minDuration}-${filters.maxDuration} weeks`}
              <button 
                onClick={() => updateFilters({ minDuration: undefined, maxDuration: undefined })}
                className="ml-1 text-xs hover:text-primary"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <button 
                onClick={() => updateFilters({ status: undefined })}
                className="ml-1 text-xs hover:text-primary" 
              >
                ×
              </button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs"
            onClick={handleFilterReset}
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.map((course: Course) => (
          <Link key={course.id} to={`/courses/${course.slug}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <p>Duration: {course.duration_weeks} weeks</p>
                  {course.status === 'draft' && isTeacher && (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {paginatedCourses.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              {searchTerm || Object.values(filters).some(v => v !== undefined) 
                ? "No courses found matching your search criteria." 
                : "No courses available."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(((currentPage - 1) * 10) + 1, totalCount)} to {Math.min(currentPage * 10, totalCount)} of {totalCount} courses
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => prevPage()} 
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis */}
              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Page numbers around current page */}
              {Array.from({ length: 5 }, (_, i) => {
                const pageNum = currentPage - 2 + i;
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        onClick={() => goToPage(pageNum)} 
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              {/* Ellipsis */}
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goToPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => nextPage()} 
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Loading state during fetching */}
      {isFetching && !isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}
