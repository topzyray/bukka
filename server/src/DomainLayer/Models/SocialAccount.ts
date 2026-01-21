import { User } from './User';

export class SocialAccount {
  id: number;
  provider: string; // 'google' | 'github' | 'facebook' etc
  providerId: string;
  userId: number;
  profileJson: {} | unknown | object;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
