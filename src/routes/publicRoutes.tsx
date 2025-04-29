
import { Route } from "react-router-dom";

// Import components
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

export const publicRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="auth" path="/auth" element={<Auth />} />,
  <Route key="not-found" path="*" element={<NotFound />} />,
];
