
import { Card } from "@/components/ui/card";
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
          <Card key={i} className="p-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!teachers.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No teachers found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
        <Card 
          key={teacher.id} 
          className="group p-6 hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
              <AvatarImage 
                src={teacher.avatar_url} 
                alt={`${teacher.first_name} ${teacher.last_name}`} 
              />
              <AvatarFallback className="bg-primary/5 text-primary font-medium">
                {`${teacher.first_name[0]}${teacher.last_name[0]}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {`${teacher.first_name} ${teacher.last_name}`}
              </h3>
              {teacher.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                  {teacher.bio}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
