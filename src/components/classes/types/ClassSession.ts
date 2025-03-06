
export interface ClassSession {
  id: string;
  class_id: string;
  is_active: boolean;
  started_at: string | null;
  ended_at: string | null;
  status: 'pending' | 'active' | 'ended';
  created_at: string;
  updated_at: string;
}

export const isClassSession = (obj: any): obj is ClassSession => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.class_id === 'string' &&
    typeof obj.is_active === 'boolean' &&
    (obj.started_at === null || typeof obj.started_at === 'string') &&
    (obj.ended_at === null || typeof obj.ended_at === 'string') &&
    ['pending', 'active', 'ended'].includes(obj.status) &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};
