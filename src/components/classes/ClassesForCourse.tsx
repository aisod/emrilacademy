
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassGrid } from "./ClassGrid";
import { usePaginatedClasses } from "@/hooks/usePaginatedClasses";
import { ClassFilters } from "./ClassFilters";

export function ClassesForCourse() {
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const {
    classes,
    isLoading,
    sort,
    setSort,
    pageSize,
    setPageSize,
    refetch,
    isFetching
  } = usePaginatedClasses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Classes</h2>
        <Button onClick={() => setShowCreateClassForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      <ClassFilters
        sort={sort}
        onSortChange={setSort}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <ClassGrid 
        classes={classes} 
        isLoading={isLoading} 
        teacherView={true}
      />

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
    </div>
  );
}
