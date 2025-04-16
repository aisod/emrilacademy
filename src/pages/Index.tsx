import { LandingNavigation } from "@/components/LandingNavigation";
import { FeatureCard } from "@/components/FeatureCard";
import { ArrowRight, Video, BookOpen, Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { data: role, isLoading } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && role) {
      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'student') {
        navigate('/student');
      }
    }
  }, [role, isLoading, navigate]);

  // If still loading, return null to prevent flash of content
  if (isLoading) {
    return null;
  }

  // If user is authenticated and has a role, they will be redirected
  // If not authenticated or no role, show landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Inter']">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h1 className="text-5xl font-bold leading-tight">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600">
              Join our interactive online classes with expert teachers and a supportive global learning community. Start your educational journey today.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth?mode=signup")}
                className="flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/courses")}
              >
                Browse Courses
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img 
              alt="Video conference interface" 
              className="rounded-lg shadow-2xl" 
              src="/lovable-uploads/265014d0-c0a9-483b-98b2-1922c400afd1.jpg"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Emmadex?</h2>
            <p className="text-gray-600">Discover the features that make our platform unique</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Video} title="Live Interactive Classes" description="Engage in real-time with expert teachers and fellow students." />
            <FeatureCard icon={BookOpen} title="Study Resources" description="Access comprehensive study materials and recorded sessions." />
            <FeatureCard icon={Users} title="Community Learning" description="Learn together with peers in a collaborative environment." />
            <FeatureCard icon={GraduationCap} title="Expert Teachers" description="Learn from qualified and experienced educators." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How Emmadex Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            step: "1",
            title: "Sign Up",
            description: "Create your account and choose your courses"
          }, {
            step: "2",
            title: "Join Live Classes",
            description: "Attend interactive live sessions with your teachers"
          }, {
            step: "3",
            title: "Learn & Grow",
            description: "Access resources, take assessments, and track your progress"
          }].map(item => <div key={item.step} className="text-center animate-fade-up">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-8">
            Join thousands of students already learning with Emmadex. Get access to expert teachers and a supportive learning community.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
            <button className="px-6 py-3 border border-white rounded-md hover:bg-primary/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">EmRil Academy</h3>
              <p className="text-sm">
                Transforming online education through interactive live learning experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teachers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li>Email: info@emmadex.com</li>
                <li>Phone: +44 7849 389090</li>
                <li>Address: 123 Learning Street</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm">
              © 2024 EmRil Academy. All rights reserved. | Developed By{" "}
              <a href="https://www.aisod.tech" className="text-primary hover:text-primary/80 transition-colors">
                AISOD
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
