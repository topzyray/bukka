import { UserRoleEnum } from '../Enums/UserRoleEnum';

export class ProcessPasswordChangeDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
  link: string;
}

export class ProcessProfileUpdateDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
  link?: string;
}

export class ProcessProfileOnboardingDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
  link: string;
}
