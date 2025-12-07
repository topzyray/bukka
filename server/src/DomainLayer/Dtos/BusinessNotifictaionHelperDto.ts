export class ProcessBusinessCreationDto {
  firstName: string;
  lastName: string;
  businessId: number;
  ownerId: number;
  ownerEmail: string;
  businessName: string;
}

export class ProcessBusinessImportDto {
  firstName: string;
  lastName: string;
  businessId: number;
  recommenderId: number;
  ownerEmail: string;
  businessName: string;
}

export class ProcessBusinessUpdatedDto {
  firstName: string;
  lastName: string;
  businessId: number;
  ownerId: number;
  ownerEmail: string;
  businessName: string;
}

export class ProcessBusinessDeletedDto {
  firstName: string;
  lastName: string;
  businessId: number;
  ownerId: number;
  ownerEmail: string;
  businessName: string;
}
