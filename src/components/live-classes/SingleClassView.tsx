
import { useState, useEffect } from "react";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useClassDetails } from "@/hooks/use-class-details";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";

interface SingleClassViewProps {
  classId: string;
}

export function SingleClassView({ classId }: SingleClassViewProps) {
  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { 
    data: classDetails, 
    isLoading, 
    error, 
    refetch 
  } = useClassDetails(classId);

  // Subscribe to any changes in the class details
  useSupabaseSubscription('classes', refetch, { filter: `id=eq.${classId}` });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading class",
        description: "We couldn't load the class details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        <div className="h-[calc(100vh-12rem)] bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Error Loading Class
            </CardTitle>
            <CardDescription>
              We couldn't load the class details. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate('/live-classes')}
            >
              Back to Live Classes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teacherFullName = classDetails?.teacher 
    ? `${classDetails.teacher.first_name} ${classDetails.teacher.last_name}`
    : "Unknown Teacher";

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{classDetails.title}</h1>
            <p className="text-gray-600">Taught by {teacherFullName}</p>
          </div>
          <div className="flex items-center space-x-3">
            {classDetails.start_time && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(classDetails.start_time), "MMM d, yyyy")}
              </div>
            )}
            {classDetails.start_time && classDetails.end_time && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(classDetails.start_time), "h:mm a")} - {format(new Date(classDetails.end_time), "h:mm a")}
              </div>
            )}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Live Class
            </Badge>
          </div>
        </div>
      </div>
      
      <LiveClassRoom
        classId={classId}
        className={classDetails.title}
        teacherName={teacherFullName}
        isJoined={isJoined}
        onJoinStatusChange={setIsJoined}
      />
    </div>
  );
}
