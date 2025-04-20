
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
}

interface TeacherListProps {
  teachers: Teacher[];
  isLoading: boolean;
}

export function TeacherList({ teachers, isLoading }: TeacherListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!teachers.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No teachers found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
              <AvatarFallback>{`${teacher.first_name[0]}${teacher.last_name[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{`${teacher.first_name} ${teacher.last_name}`}</h3>
              {teacher.bio && (
                <p className="text-sm text-gray-500 line-clamp-2">{teacher.bio}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
