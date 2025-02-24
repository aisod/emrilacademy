
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, children, className }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "text-gray-700 hover:text-primary transition-colors",
        isActive && "text-primary font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
};

export function LandingNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 top-0 left-0 transition-all duration-200",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
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
          <span className="self-center text-2xl font-semibold">Emmadex</span>
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
            isOpen ? "block opacity-100" : "hidden md:opacity-100 opacity-0"
          )}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <NavLink to="/about">About</NavLink>
              <NavLink to="/courses">Courses</NavLink>
              <NavLink to="/teachers">Teachers</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Link to="/auth?mode=signin">
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button 
                  className="w-full md:w-auto"
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
