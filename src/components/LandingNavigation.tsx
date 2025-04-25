import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ to, children, className, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "text-gray-700 dark:text-gray-300 hover:text-primary transition-colors",
        isActive && "text-primary dark:text-primary-light font-medium",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export function LandingNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const closeMenu = () => setIsOpen(false);

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 top-0 left-0 transition-all duration-200 mobile-safe-area",
        isScrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link 
          to="/" 
          className="flex items-center space-x-3"
          aria-label="Go to homepage"
        >
          <span className="self-center text-xl md:text-2xl font-semibold">EmRil Academy</span>
        </Link>
        
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div 
          id="mobile-menu"
          className={cn(
            "w-full md:block md:w-auto transition-all duration-200 ease-in-out",
            isOpen 
              ? "block opacity-100 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-md shadow-lg absolute top-full left-0 right-0 mt-2 z-50" 
              : "hidden md:opacity-100 opacity-0 max-h-0 md:max-h-none"
          )}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 px-4 md:px-0">
              <NavLink to="/about" onClick={closeMenu}>About</NavLink>
              <NavLink to="/courses" onClick={closeMenu}>Courses</NavLink>
              <NavLink to="/teachers" onClick={closeMenu}>Teachers</NavLink>
              <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center mt-4 md:mt-0 p-4 border-t md:border-none border-gray-200 dark:border-gray-700 md:p-0">
              <Link to="/auth?mode=signin" className="w-full md:w-auto" onClick={closeMenu}>
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto border-2 border-primary bg-white text-primary hover:bg-primary/10"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup" className="w-full md:w-auto" onClick={closeMenu}>
                <Button 
                  className="w-full md:w-auto bg-primary text-white font-semibold"
                  aria-label="Create a new account"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
