
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Emmadex
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
            Courses
          </Link>
          <Link to="/teachers" className="text-gray-600 hover:text-primary transition-colors">
            Teachers
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-primary hover:text-primary/80 transition-colors">
            Log in
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
