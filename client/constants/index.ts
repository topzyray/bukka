import { DataOptionOne } from "../../types";

export const dashboardTitle: Record<string, string> = {
  super_admin: "Super Admin Dashboard",
  admin: "Admin Dashboard",
  teacher: "Teacher Dashboard",
  non_teaching: "Non-Teaching Dashboard",
  parent: "Parent Dashboard",
  student: "Student Dashboard",
};

export const userRegistrableDataSchoolOwner: DataOptionOne[] = [
  { label: "Admin", value: "admin" },
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
];

export const userRegistrableDataSchoolAmin: DataOptionOne[] = [
  { label: "Student", value: "student" },
  { label: "Parent", value: "parent" },
  { label: "Teacher", value: "teacher" },
];
