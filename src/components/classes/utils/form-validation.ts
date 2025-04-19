
import { ClassFormData } from "../types/CreateClassFormTypes";

export const validateClassForm = (formData: ClassFormData) => {
  if (!formData.title.trim()) {
    throw new Error("Title is required");
  }

  if (!formData.startTime) {
    throw new Error("Start time is required");
  }

  if (!formData.endTime) {
    throw new Error("End time is required");
  }

  const startDate = new Date(formData.startTime);
  const endDate = new Date(formData.endTime);
  
  if (endDate <= startDate) {
    throw new Error("End time must be after start time");
  }
};
