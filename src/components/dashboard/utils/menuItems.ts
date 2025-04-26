
import { MenuItem, UserRole } from "../types/menuTypes";
import { adminMenuItems } from "../menu/adminMenu";
import { studentMenuItems } from "../menu/studentMenu";
import { teacherMenuItems } from "../menu/teacherMenu";
import { commonMenuItems } from "../menu/commonMenu";

export { commonMenuItems } from "../menu/commonMenu";
export { adminMenuItems } from "../menu/adminMenu";
export { studentMenuItems } from "../menu/studentMenu";
export { teacherMenuItems } from "../menu/teacherMenu";

export const getMenuItems = (userRole: UserRole): MenuItem[] => [
  ...(userRole === "student" 
    ? studentMenuItems 
    : userRole === "admin" 
    ? adminMenuItems 
    : teacherMenuItems),
  ...commonMenuItems,
];
