export type LoginDto = {
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
  password: string;
  confirm_password: string;
  token: string;
};

export type RefreshTokenDto = {
  refereshToken: string;
};
