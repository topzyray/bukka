export type OnboardingProgressDto = {
  userId: number;
  stepIndex: number;
};

export type UpdateUserDto = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
};
