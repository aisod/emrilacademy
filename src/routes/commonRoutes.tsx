
import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./protectedRoutes";

export const commonRoutes = [
  ...publicRoutes,
  ...protectedRoutes
];
