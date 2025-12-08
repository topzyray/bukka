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

export class ProcessBusinessFeaturedDto {
  adminId: number;
  adminEmail: string;
  adminfirstName: string;
  adminlastName: string;
  ownerEmail: string;
  ownerId: number;
  ownerFirstName: string;
  ownerLastName: string;
  recommenderEmail: string;
  recommenderId: number;
  recommenderFirstName: string;
  recommenderLastName: string;
  businessId: number;
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
