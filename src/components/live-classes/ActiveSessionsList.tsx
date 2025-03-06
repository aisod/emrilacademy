
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface ActiveClassSession {
  id: string;
  class_id: string;
  is_active: boolean;
  started_at: string | null;
  status: 'pending' | 'active' | 'ended';
  class: {
    title: string;
    teacher: {
      first_name: string;
      last_name: string;
    };
  };
}

interface ActiveSessionsListProps {
  activeSessions: ActiveClassSession[] | undefined;
  isLoading?: boolean;
}

export function ActiveSessionsList({ activeSessions, isLoading = false }: ActiveSessionsListProps) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleJoinClass = (selectedClassId: string) => {
    navigate(`/live-classes/${selectedClassId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!activeSessions || activeSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There are no live classes in session right now. Check back later or browse available classes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeSessions.map((session) => (
        <Card 
          key={session.id} 
          className="overflow-hidden transition-all duration-200 hover:shadow-md"
          onMouseEnter={() => setHoveredCard(session.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{session.class.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  by {session.class.teacher.first_name} {session.class.teacher.last_name}
                </p>
              </div>
              <Badge className="bg-green-500">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.started_at && (
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{format(new Date(session.started_at), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Started {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}</span>
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => handleJoinClass(session.class_id)}
                className="w-full"
                variant={hoveredCard === session.id ? "default" : "outline"}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Join Live Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
