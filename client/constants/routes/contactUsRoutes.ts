import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IContactUsApi = "createContactUs" | "getAllContactUs" | "getContactUsById";

const rawContactUsRoutes: Record<IContactUsApi, string> = {
  createContactUs: "/contact-us/create-contact-us",
  getAllContactUs: "/contact-us/get-all-contact-us",
  getContactUsById: "/contact-us/get-contact-us-by-id",
};

// Use the function to create routes with the base path
export const contactUsRoutes: Record<IContactUsApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawContactUsRoutes,
);
