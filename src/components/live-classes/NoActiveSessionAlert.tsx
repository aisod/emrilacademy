
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NoActiveSessionAlert() {
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
        onClick={() => navigate('/browse-classes')}
        className="mt-4"
        variant="outline"
      >
        Browse Classes
      </Button>
    </div>
  );
}
