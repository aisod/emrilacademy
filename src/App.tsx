import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import ResourcesPage from "./pages/ResourcesPage";
import Profile from './pages/Profile';

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const BrowseClasses = lazy(() => import("./pages/BrowseClasses"));
const LiveClasses = lazy(() => import("./pages/LiveClasses"));
const Courses = lazy(() => import("./pages/Courses"));
const Course = lazy(() => import("./pages/Course"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-center">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    };
    
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-user');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      // Could add error reporting service here
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

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
            <Route 
              path="/teacher" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TeacherDashboard />
                </Suspense>
              } 
            />
            <Route 
              path="/student" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <StudentDashboard />
                </Suspense>
              } 
            />
            <Route 
              path="/browse-classes" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <BrowseClasses />
                </Suspense>
              } 
            />
            <Route 
              path="/live-classes" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LiveClasses />
                </Suspense>
              } 
            />
            <Route 
              path="/live-classes/:classId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LiveClasses />
                </Suspense>
              } 
            />
            <Route path="/messages" element={<Messages />} />
            <Route 
              path="/courses" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Courses />
                </Suspense>
              } 
            />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route 
              path="/courses/:slug" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Course />
                </Suspense>
              } 
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
