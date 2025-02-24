
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Users, Book, Play, Video } from "lucide-react";
import { ResourceUpload } from "@/components/resources/ResourceUpload";
import { ResourceList } from "@/components/resources/ResourceList";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface ClassCardProps {
  id: string;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  classType: "live" | "recorded";
  enrollmentCount?: number;
  capacity?: number;
  teacherView?: boolean;
}

interface ClassSession {
  is_active: boolean;
  started_at: string | null;
}

export function ClassCard({
  id,
  title,
  description,
  startTime,
  endTime,
  classType,
  enrollmentCount = 0,
  capacity = 30,
  teacherView,
}: ClassCardProps) {
  const [showResources, setShowResources] = useState(false);
  const [showResourceUpload, setShowResourceUpload] = useState(false);
  const [classSession, setClassSession] = useState<ClassSession | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResourceSuccess = () => {
    setShowResourceUpload(false);
  };

  useEffect(() => {
    // Subscribe to real-time updates for class sessions
    const channel = supabase
      .channel(`class-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions',
          filter: `class_id=eq.${id}`,
        },
        (payload) => {
          setClassSession(payload.new as ClassSession);
        }
      )
      .subscribe();

    // Fetch initial session state
    const fetchSessionStatus = async () => {
      const { data } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('class_id', id)
        .single();
      setClassSession(data);
    };

    fetchSessionStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const startLiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .upsert({
          class_id: id,
          is_active: true,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/live-classes/${id}`);
      toast({
        title: "Live session started",
        description: "Students can now join your class.",
      });
    } catch (error) {
      toast({
        title: "Error starting session",
        description: "Could not start the live session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const joinLiveSession = () => {
    navigate(`/live-classes/${id}`);
  };

  const getClassStatus = () => {
    if (!startTime) return null;
    
    const now = new Date();
    const classStart = new Date(startTime);
    const classEnd = endTime ? new Date(endTime) : null;

    if (classSession?.is_active) {
      return <Badge variant="default">In Progress</Badge>;
    }
    
    if (now < classStart) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else if (classEnd && now > classEnd) {
      return <Badge variant="secondary">Ended</Badge>;
    }
    
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            {classType === "live" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                Live
              </Badge>
            )}
            {getClassStatus()}
          </div>
        </div>

        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}

        <div className="mt-4 space-y-2">
          {startTime && (
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(startTime), "MMMM d, yyyy")}</span>
            </div>
          )}
          {startTime && endTime && (
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {format(new Date(startTime), "h:mm a")} -{" "}
                {format(new Date(endTime), "h:mm a")}
              </span>
            </div>
          )}
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>{enrollmentCount} / {capacity} students enrolled</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Class capacity</span>
              <span>{enrollmentCount}/{capacity}</span>
            </div>
            <Progress 
              value={(enrollmentCount / capacity) * 100} 
              className="h-2"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          {classType === "live" && (
            teacherView ? (
              <Button
                onClick={startLiveSession}
                disabled={classSession?.is_active}
              >
                <Play className="mr-2 h-4 w-4" />
                {classSession?.is_active ? "Class in Progress" : "Start Live Session"}
              </Button>
            ) : (
              classSession?.is_active && (
                <Button onClick={joinLiveSession}>
                  <Video className="mr-2 h-4 w-4" />
                  Join Live Session
                </Button>
              )
            )
          )}
          <Button
            variant="outline"
            onClick={() => setShowResources(!showResources)}
          >
            <Book className="mr-2 h-4 w-4" />
            Resources
          </Button>
          {teacherView && (
            <Button
              variant="outline"
              onClick={() => setShowResourceUpload(!showResourceUpload)}
            >
              Upload Resource
            </Button>
          )}
        </div>
      </div>

      {showResourceUpload && (
        <div className="border-t p-6 bg-gray-50">
          <h4 className="text-lg font-semibold mb-4">Upload New Resource</h4>
          <ResourceUpload classId={id} onSuccess={handleResourceSuccess} />
        </div>
      )}

      {showResources && (
        <div className="border-t p-6">
          <h4 className="text-lg font-semibold mb-4">Class Resources</h4>
          <ResourceList
            classId={id}
            isTeacher={teacherView}
            onDelete={() => setShowResources(true)}
          />
        </div>
      )}
    </Card>
  );
}
