
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassStatusBadge } from "./ClassStatusBadge";
import { ClassDetails } from "./ClassDetails";
import { EnrollmentActions } from "./EnrollmentActions";
import type { ClassListProps } from "./types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { ClassSession, isClassSession } from "./types/ClassSession";

export function ClassList({ classes, isLoading }: ClassListProps) {
  const [classTimers, setClassTimers] = useState<Record<string, string | null>>({});
  const [activeSessions, setActiveSessions] = useState<Record<string, boolean>>({});

  // Subscribe to active sessions
  useEffect(() => {
    if (!classes.length) return;

    // Get initial active sessions
    const fetchActiveSessions = async () => {
      const { data } = await supabase
        .from('class_sessions')
        .select('class_id, is_active')
        .in('class_id', classes.map(c => c.id))
        .eq('is_active', true);

      if (data) {
        const sessionsMap: Record<string, boolean> = {};
        data.forEach(session => {
          sessionsMap[session.class_id] = session.is_active;
        });
        setActiveSessions(sessionsMap);
      }
    };

    fetchActiveSessions();

    // Subscribe to changes
    const channel = supabase.channel('active-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions',
          filter: `class_id=in.(${classes.map(c => c.id).join(',')})`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.new && isClassSession(payload.new)) {
            setActiveSessions(prev => ({
              ...prev,
              [payload.new.class_id]: payload.new.is_active
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classes]);

  // Calculate time until class starts for each class
  useEffect(() => {
    if (classes.length) {
      const timers: Record<string, string | null> = {};
      
      const intervals: NodeJS.Timeout[] = [];
      
      classes.forEach(class_ => {
        if (class_.start_time) {
          const updateTimer = () => {
            const now = new Date();
            const start = new Date(class_.start_time);
            const diff = start.getTime() - now.getTime();
            
            if (diff <= 0) {
              timers[class_.id] = null;
            } else {
              const hours = Math.floor(diff / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              timers[class_.id] = `${hours}h ${minutes}m`;
            }
            
            setClassTimers(prev => ({ ...prev, [class_.id]: timers[class_.id] }));
          };
          
          updateTimer();
          
          // Set up interval to update the timer
          const interval = setInterval(updateTimer, 60000);
          intervals.push(interval);
        }
      });
      
      return () => {
        intervals.forEach(interval => clearInterval(interval));
      };
    }
  }, [classes]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">No classes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((class_) => (
        <Card key={class_.id} className="overflow-hidden">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{class_.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  by {class_.teacher.first_name} {class_.teacher.last_name}
                </p>
              </div>
              <ClassStatusBadge
                classType={class_.class_type}
                isActive={activeSessions[class_.id] || false}
                timeUntilClass={classTimers[class_.id]}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {class_.description && (
              <p className="text-gray-600 text-sm">{class_.description}</p>
            )}
            <ClassDetails class_={class_} />
            <EnrollmentActions class_={class_} isSessionActive={activeSessions[class_.id] || false} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
