
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoActiveSessionAlertProps {
  redirectPath?: string;
  redirectLabel?: string;
}

export function NoActiveSessionAlert({ 
  redirectPath = '/browse-classes',
  redirectLabel = 'Browse Classes'
}: NoActiveSessionAlertProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Alert className="max-w-md">
        <AlertTitle>No Active Session</AlertTitle>
        <AlertDescription>
          There is no active session for this class. Please check back later when the teacher starts the session.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => navigate(redirectPath)}
        className="mt-4"
        variant="outline"
      >
        {redirectLabel}
      </Button>
    </div>
  );
}
