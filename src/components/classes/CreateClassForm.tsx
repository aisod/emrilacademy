import { Button } from "@/components/ui/button";
import { ClassFormFields } from "./form/ClassFormFields";
import { useCreateClass } from "./hooks/useCreateClass";
import type { CreateClassFormProps } from "./types/CreateClassFormTypes";
export function CreateClassForm({
  onSuccess
}: CreateClassFormProps) {
  const {
    formData,
    setFormData,
    loading,
    handleSubmit
  } = useCreateClass(onSuccess);
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <ClassFormFields formData={formData} onChange={handleFieldChange} />
      <Button type="submit" disabled={loading} className="w-full text-sky-500">
        {loading ? "Creating..." : "Create Class"}
      </Button>
    </form>;
}