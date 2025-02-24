
export interface Class {
  id: string;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  class_type: "live" | "recorded";
  teacher: {
    first_name: string;
    last_name: string;
  };
  enrollments: { count: number }[];
  capacity: number;
  enrolled: { student_id: string }[];
  isEnrolled?: boolean;
}

export interface ClassListProps {
  classes: Class[];
  isLoading: boolean;
}
