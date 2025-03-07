
import { ResourceUpload } from "@/components/resources/ResourceUpload";
import { ResourceList } from "@/components/resources/ResourceList";

interface ClassResourceSectionProps {
  classId: string;
  showResources: boolean;
  showResourceUpload: boolean;
  teacherView?: boolean;
  onResourceSuccess: () => void;
  onDelete?: () => void;
}

export function ClassResourceSection({
  classId,
  showResources,
  showResourceUpload,
  teacherView,
  onResourceSuccess,
  onDelete,
}: ClassResourceSectionProps) {
  return (
    <>
      {showResourceUpload && (
        <div className="border-t p-6 bg-gray-50">
          <h4 className="text-lg font-semibold mb-4">Upload New Resource</h4>
          <ResourceUpload 
            classId={classId} 
            category="general" 
            onSuccess={onResourceSuccess} 
          />
        </div>
      )}

      {showResources && (
        <div className="border-t p-6">
          <h4 className="text-lg font-semibold mb-4">Class Resources</h4>
          <ResourceList
            classId={classId}
            isTeacher={teacherView}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
}
