import { ClaimStatusEnum } from "../enums";
import { User } from "./User";

export interface BusinessClaim {
  id: number;
  business: {
    name: string;
    [key: string]: any;
  } | null;
  claimer: User | null;
  status: ClaimStatusEnum;
  phoneNumber?: string;
  ownershipDocument?: File | string;
  note?: string;
  submittedAt?: string;
}
