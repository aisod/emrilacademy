
import { Input } from "@/components/ui/input";
import { ClassFormData } from "../types/CreateClassFormTypes";

interface ClassFormFieldsProps {
  formData: ClassFormData;
  onChange: (field: keyof ClassFormData, value: string) => void;
}

export function ClassFormFields({ formData, onChange }: ClassFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="classType" className="block text-sm font-medium text-gray-700">
          Class Type
        </label>
        <select
          id="classType"
          value={formData.classType}
          onChange={(e) => onChange("classType", e.target.value as "live" | "recorded")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="live">Live</option>
          <option value="recorded">Recorded</option>
        </select>
      </div>
    </>
  );
}
