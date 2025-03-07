
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import BrowseClasses from "./pages/BrowseClasses";
import LiveClasses from "./pages/LiveClasses";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Courses from "./pages/Courses";
import ResourcesPage from "./pages/ResourcesPage";
import TeachersPage from "./pages/TeachersPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/browse-classes" element={<BrowseClasses />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/live-classes/:classId" element={<LiveClasses />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
