export type CreateSupportTicketDto = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type AssignSupportTicketDto = {
  supportId: number;
  assigneeId: number;
};
