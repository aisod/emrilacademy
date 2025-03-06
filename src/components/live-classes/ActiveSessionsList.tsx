
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

export function ActiveSessionsList({ activeSessions }: ActiveSessionsListProps) {
  const navigate = useNavigate();

  const handleJoinClass = (selectedClassId: string) => {
    navigate(`/live-classes/${selectedClassId}`);
  };

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
        <Card key={session.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{session.class.title}</CardTitle>
            <p className="text-sm text-gray-500">
              by {session.class.teacher.first_name} {session.class.teacher.last_name}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                Live
              </span>
              {session.started_at && 
                `Started at ${new Date(session.started_at).toLocaleTimeString()}`
              }
            </p>
            <Button
              onClick={() => handleJoinClass(session.class_id)}
              className="w-full"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Join Live Session
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
