
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";

const NotFound = () => {
  const location = useLocation();
  const { data: userRole } = useUserRole();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine the home route based on user role
  const getHomeRoute = () => {
    if (userRole === "teacher") return "/teacher";
    if (userRole === "student") return "/student";
    return "/";
  };

  const homeRoute = getHomeRoute();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">404</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          The path "{location.pathname}" could not be found on our server.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Link to={homeRoute}>
              <Home className="h-4 w-4" />
              <span>{userRole ? "Dashboard" : "Home"}</span>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
