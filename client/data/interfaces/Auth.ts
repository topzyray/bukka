import { JwtPayload } from "jwt-decode";
import { User } from "./User";

export interface AuthResponse {
  user: User;
  token: string;
}

export type UserRole = "ADMIN" | "USER" | "VENDOR" | "RIDER" | "INVESTOR";

export interface CustomJwtPayload extends JwtPayload {
  role: UserRole;
}
