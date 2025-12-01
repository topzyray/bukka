import { SupportStatusEnum } from '../Enums/SupportStatusEnum';
import { User } from './User';

export class Support {
  id: number;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportStatusEnum;
  assigneeId: number;
  assignee: User;
  creatorId: string;
  creatorEmail: string;
  resolvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
