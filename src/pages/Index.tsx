
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="p-4 flex justify-end">
        <Link to="/auth">
          <Button variant="outline" className="shadow-sm">
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </nav>
      <div className="container mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold">
            Transform Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600">
            Join our interactive online classes with expert teachers and a supportive global learning community. Start your educational journey today.
          </p>
          <div className="flex gap-4">
            <Link to="/auth">
              <Button size="lg" className="font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <img 
            src="/lovable-uploads/81e294e2-d94a-42af-aa50-841e8c6a2b4e.png" 
            alt="Online learning platform interface" 
            className="w-full rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
