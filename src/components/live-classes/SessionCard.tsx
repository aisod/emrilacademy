
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { SessionAnalytics } from "./SessionAnalytics";
import { formatDuration } from "@/utils/session-utils";

interface SessionCardProps {
  session: any;
  expandedSession: string | null;
  onToggleExpand: (sessionId: string) => void;
}

export function SessionCard({ session, expandedSession, onToggleExpand }: SessionCardProps) {
  const isExpanded = expandedSession === session.id;

  return (
    <Card key={session.id} className="overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">
              {session.classes?.title || "Untitled Class"}
            </h3>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {session.started_at 
                  ? format(new Date(session.started_at), "MMM d, yyyy") 
                  : "Unknown date"}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {session.duration_seconds 
                  ? formatDuration(session.duration_seconds) 
                  : "Unknown duration"}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {session.participant_count || 0} participants
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{session.status}</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleExpand(session.id)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show Details
                </>
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <SessionAnalytics sessionId={session.id} />
          </div>
        )}
      </div>
    </Card>
  );
}
