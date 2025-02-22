
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export function CreateClassForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    classType: "live" as "live" | "recorded",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("classes").insert({
        ...formData,
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
        class_type: formData.classType,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class created successfully",
      });

      onSuccess();
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        classType: "live",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startTime: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endTime: e.target.value }))
            }
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              classType: e.target.value as "live" | "recorded",
            }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="live">Live</option>
          <option value="recorded">Recorded</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Class"}
      </Button>
    </form>
  );
}
