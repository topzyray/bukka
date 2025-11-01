import { SupportStatusEnum } from "../enums/SupportStatusEnum";
import { User } from "./User";

export interface Support {
  id: number;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportStatusEnum;
  assigneeId: number;
  assignee: User;
  resolvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
