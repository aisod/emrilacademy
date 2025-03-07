
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen } from "lucide-react";

interface TeacherCardProps {
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    classes: { count: number }[];
  };
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const initials = `${teacher.first_name.charAt(0)}${teacher.last_name.charAt(0)}`;
  const classCount = teacher.classes[0]?.count || 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex justify-between items-center">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={teacher.avatar_url || undefined} alt={`${teacher.first_name} ${teacher.last_name}`} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{classCount} Classes</span>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4 text-yellow-400"
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{teacher.first_name} {teacher.last_name}</h3>
        <p className="text-gray-500 line-clamp-3">
          Experienced teacher specializing in interactive learning methods and personalized education.
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 gap-2 flex">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/classes?teacher=${teacher.id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Classes
          </Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link to={`/messages?contact=${teacher.id}`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
