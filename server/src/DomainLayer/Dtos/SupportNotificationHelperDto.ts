export class processAccountConfirmationDto {
  userId: number;
  email: string;
  firstName: string;
  confirmationCode: string;
  confirmationCodeExpires: Date;
}

export class processPasswordResetDto {
  userId: number;
  email: string;
  firstName: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
}

export class ProcessSignupDto {
  userId: number;
  email: string;
  firstName: string;
  getStartedLink: string;
  userType: string;
}

export class processResendConfirmationDto {
  userId: number;
  email: string;
  firstName: string;
  confirmationCode: string;
  confirmationCodeExpires: Date;
}

export class ProcessReferralSignupDto {
  userId: number;
  firstName: string;
  email: string;
  defaultPassword: string;
  referrerCode: string;
}
