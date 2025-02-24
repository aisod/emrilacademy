
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function LandingNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold">Emmadex</span>
        </Link>
        
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <Link to="#" className="text-gray-700 hover:text-primary">About</Link>
              <Link to="#" className="text-gray-700 hover:text-primary">Courses</Link>
              <Link to="#" className="text-gray-700 hover:text-primary">Teachers</Link>
              <Link to="#" className="text-gray-700 hover:text-primary">Contact</Link>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Link to="/auth">
                <Button variant="outline" className="w-full md:w-auto">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="w-full md:w-auto">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
