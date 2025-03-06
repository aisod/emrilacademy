
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { ClassSession, isClassSession } from "./types/ClassSession";
import { ClassCardHeader } from "./ClassCardHeader";
import { ClassCardActions } from "./ClassCardActions";
import { ClassResourceSection } from "./ClassResourceSection";

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
  const [timeUntilClass, setTimeUntilClass] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResourceSuccess = () => {
    setShowResourceUpload(false);
  };

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = start.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeUntilClass(null);
          clearInterval(timer);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeUntilClass(`${hours}h ${minutes}m`);
        }
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [startTime]);

  useEffect(() => {
    // Subscribe to real-time updates for class sessions
    const channel = supabase.channel(`class-${id}`)
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions',
          filter: `class_id=eq.${id}`,
        },
        (payload: RealtimePostgresChangesPayload<ClassSession>) => {
          if (isClassSession(payload.new)) {
            setClassSession(payload.new);
          }
        }
      )
      .subscribe();

    // Fetch initial session state
    const fetchSessionStatus = async () => {
      const { data, error } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('class_id', id)
        .maybeSingle();
        
      if (!error && data && isClassSession(data)) {
        setClassSession(data);
      }
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
          status: 'active' as const,
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

  return (
    <Card className="overflow-hidden">
      <ClassCardHeader
        title={title}
        description={description}
        startTime={startTime}
        endTime={endTime}
        classType={classType}
        enrollmentCount={enrollmentCount}
        capacity={capacity}
        isActive={classSession?.is_active}
        timeUntilClass={timeUntilClass}
      />

      <div className="p-6 pt-0">
        <ClassCardActions
          classType={classType}
          teacherView={teacherView}
          isSessionActive={classSession?.is_active || false}
          onStartLiveSession={startLiveSession}
          onJoinLiveSession={joinLiveSession}
          onToggleResources={() => setShowResources(!showResources)}
          onToggleResourceUpload={() => setShowResourceUpload(!showResourceUpload)}
        />
      </div>

      <ClassResourceSection
        classId={id}
        showResources={showResources}
        showResourceUpload={showResourceUpload}
        teacherView={teacherView}
        onResourceSuccess={handleResourceSuccess}
        onDelete={() => setShowResources(true)}
      />
    </Card>
  );
}
