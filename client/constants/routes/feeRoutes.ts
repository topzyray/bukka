import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFeeApi =
  | "createSchoolFeesInASchool"
  | "createOptionalFeesInASchool"
  | "createMandatoryFeesInASchool"
  | "addOptionalFeeDuringTerm"
  | "addMandatoryFeeDuringTerm"
  | "getSchoolFeesInASchool"
  | "getMandatoryFeesInASchool"
  | "getOptionalFeesInASchool";

const rawFeeRoutes: Record<IFeeApi, string> = {
  createSchoolFeesInASchool: "/fees/create-school-fees",
  createOptionalFeesInASchool: "/fees/create-optional-fees",
  createMandatoryFeesInASchool: "/fees/create-mandatory-fees",
  addOptionalFeeDuringTerm: "/fees/add-optional-fees-during-term",
  addMandatoryFeeDuringTerm: "/fees/add-mandatory-fees-during-term",
  getSchoolFeesInASchool: "/fees/get-school-fees",
  getMandatoryFeesInASchool: "/fees/get-all-mandatory-fees",
  getOptionalFeesInASchool: "/fees/get-all-optional-fees",
};

// Use the function to create routes with the base path
export const feeRoutes: Record<IFeeApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawFeeRoutes,
);
