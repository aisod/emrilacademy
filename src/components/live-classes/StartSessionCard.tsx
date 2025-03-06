
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface StartSessionCardProps {
  classId: string;
  onSessionStarted: () => void;
}

export function StartSessionCard({ classId, onSessionStarted }: StartSessionCardProps) {
  const { toast } = useToast();

  // Mutation to start a new session
  const startSession = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('class_sessions')
        .upsert({
          class_id: classId,
          is_active: true,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Live session started",
        description: "Students can now join your class.",
      });
      onSessionStarted();
    },
    onError: (error: any) => {
      toast({
        title: "Error starting session",
        description: error.message || "Could not start the live session",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start Live Class Session</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">No active session found for this class. Would you like to start one?</p>
          <Button 
            onClick={() => startSession.mutate()}
            className="w-full"
          >
            Start Live Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
