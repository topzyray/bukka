import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IClaimApi =
  | "createClaim"
  | "getClaims"
  | "getClaimById"
  | "getLoggedInUserClaims"
  | "approveClaim"
  | "rejectClaim"
  | "deleteClaim";

const rawClaimRoutes: Record<IClaimApi, string> = {
  createClaim: "/claims",
  getClaims: "/claims",
  getClaimById: "/claims",
  getLoggedInUserClaims: "/claims/my-claims",
  approveClaim: "/claims",
  rejectClaim: "/claims",
  deleteClaim: "/claims",
};

export const claimRoutes: Record<IClaimApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawClaimRoutes
);
