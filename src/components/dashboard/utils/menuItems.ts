export const commonMenuItems = [
  {
    label: "Messages",
    path: "/messages",
  },
  {
    label: "Resources",
    path: "/resources",
  },
  {
    label: "Live Classes",
    path: "/live-classes",
  }
];

export const adminMenuItems = [
  {
    label: "Dashboard",
    path: "/admin",
  },
  {
    label: "Users",
    path: "/admin/users",
  },
];

export const studentMenuItems = [
  {
    label: "Dashboard",
    path: "/student",
  },
  {
    label: "My Classes",
    path: "/courses",
  },
  {
    label: "Browse Classes",
    path: "/browse-classes",
  },
];

export const teacherMenuItems = [
  {
    label: "Dashboard",
    path: "/teacher",
  },
  {
    label: "My Classes",
    path: "/courses",
  },
];

export const getMenuItems = (userRole: "student" | "teacher" | "admin" | null) => [
  ...(userRole === "student" 
    ? studentMenuItems 
    : userRole === "admin" 
    ? adminMenuItems 
    : teacherMenuItems),
  ...commonMenuItems,
];
