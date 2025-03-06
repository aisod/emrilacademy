
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface NoActiveSessionAlertProps {
  redirectPath?: string;
  redirectLabel?: string;
  title?: string;
  description?: string;
}

export function NoActiveSessionAlert({ 
  redirectPath = '/browse-classes',
  redirectLabel = 'Browse Classes',
  title = "No Active Session",
  description = "There is no active session for this class. Please check back later when the teacher starts the session."
}: NoActiveSessionAlertProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Alert className="max-w-md border-amber-200 bg-amber-50">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {description}
        </AlertDescription>
      </Alert>
      <div className="mt-6 flex gap-3">
        <Button 
          onClick={() => navigate(redirectPath)}
          variant="outline"
        >
          {redirectLabel}
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
