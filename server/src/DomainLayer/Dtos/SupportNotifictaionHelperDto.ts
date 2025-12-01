export class ProcessNewTicketDto {
  creatorId: number;
  firstName: string;
  lastName: string;
  creatorEmail: string;
  ticketId: string;
  subject: string;
  message: string;
}

export class ProcessAssignedTicketDto {
  creatorId: number;
  creatorEmail: string;
  assigneeId: number;
  assigneeEmail: string;
  ticketId: string;
  assigneeFirstName: string;
  assigneeLastName: string;
}

export class ProcessResolvedTicketDto {
  creatorId: number;
  creatorEmail: string;
  ticketId: string;
  // firstName: string;
  // lastName: string;
}
