export type SigninDto = {
  email: string;
  password: string;
};

export type VerifyUserEmailDto = {
  token: string;
};

export type ResendEmailVerificationDto = {
  email: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  newPassword: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};
