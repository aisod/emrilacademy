
export interface ClassFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  classType: "live" | "recorded";
}

export interface CreateClassFormProps {
  onSuccess: () => void;
}
