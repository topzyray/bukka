import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISupportApi =
  | "createTicket"
  | "getSupport"
  | "getSupportByTicketId"
  | "deleteSupport";

const rawSupportRoutes: Record<ISupportApi, string> = {
  createTicket: "/supports",
  getSupport: "/supports",
  getSupportByTicketId: "/supports",
  deleteSupport: "/supports",
};

export const supportRoutes: Record<ISupportApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawSupportRoutes);
