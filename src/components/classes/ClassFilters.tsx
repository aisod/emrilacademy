
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Calendar, RefreshCw } from 'lucide-react';

interface ClassFiltersProps {
  sort: string;
  onSortChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
  isFetching: boolean;
}

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16];

export function ClassFilters({
  sort,
  onSortChange,
  pageSize,
  onPageSizeChange,
  onRefresh,
  isFetching,
}: ClassFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="title-asc">A-Z</SelectItem>
          <SelectItem value="title-desc">Z-A</SelectItem>
        </SelectContent>
      </Select>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="py-4 space-y-4">
            <h3 className="text-lg font-medium mb-4">Filter Classes</h3>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Results per page</h4>
              <div className="flex flex-wrap gap-2">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    variant={pageSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageSizeChange(size)}
                    className="h-8"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Button variant="outline" className="w-full sm:w-auto" onClick={onRefresh} disabled={isFetching}>
        {isFetching ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Calendar className="h-4 w-4 mr-2" />
        )}
        Calendar
      </Button>
    </div>
  );
}
