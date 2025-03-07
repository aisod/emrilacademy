
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
  category: string | null;
  class_id?: string;
}
