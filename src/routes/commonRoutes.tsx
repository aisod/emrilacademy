
import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./protectedRoutes";
import { adminRoutes } from "./adminRoutes";

export const commonRoutes = [
  ...publicRoutes,
  ...protectedRoutes,
  adminRoutes // Make sure the adminRoutes are included
];
