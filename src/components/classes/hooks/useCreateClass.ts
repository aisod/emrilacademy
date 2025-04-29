
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClassFormData } from "../types/CreateClassFormTypes";
import { validateClassForm } from "../utils/form-validation";

export const useCreateClass = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClassFormData>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    classType: "live",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      validateClassForm(formData);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { error } = await supabase.from("classes").insert({
        title: formData.title,
        description: formData.description,
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
        class_type: formData.classType,
        teacher_id: session.user.id
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

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
  };
};
