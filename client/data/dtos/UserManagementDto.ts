import { UserRoleEnum } from "../enums";

export type CreateAdminUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRoleEnum;
};

export type AdminUpdateUserDto = {
  id: number;
  userStatus: string;
  role: UserRoleEnum;
};
