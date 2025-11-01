export type CreateSupportTicketDto = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type AssignupportTicketDto = {
  supportId: number;
  assigneeId: number;
};
