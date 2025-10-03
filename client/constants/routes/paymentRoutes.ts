import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IPaymentApi =
  | "addFeeToStudentPaymentDocumentInASchool"
  | "getPaymentPriorityForMySchool"
  | "createPaymentDocumentForAllStudentInASchool";

const rawPaymentRoutes: Record<IPaymentApi, string> = {
  addFeeToStudentPaymentDocumentInASchool: "/payments/add-fee-to-student-payment-document",
  getPaymentPriorityForMySchool: "/payments/get-my-school-payment-priority",
  createPaymentDocumentForAllStudentInASchool:
    "/payments/create-payment-document-with-only-school-fees",
};

// Use the function to create routes with the base path
export const paymentRoutes: Record<IPaymentApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawPaymentRoutes,
);
