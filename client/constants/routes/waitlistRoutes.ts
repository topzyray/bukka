import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IWaitlistApi =
  | "joinWaitlist"
  | "getWaitlists"
  | "getWaitlistById"
  | "getWaitlistCount"
  | "deleteWaitlist";

const rawAuthRoutes: Record<IWaitlistApi, string> = {
  joinWaitlist: "/waitlists/join",
  getWaitlists: "/waitlists",
  getWaitlistById: "/waitlists",
  getWaitlistCount: "/waitlists/count",
  deleteWaitlist: "/waitlists",
};

export const waitlistRoutes: Record<IWaitlistApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawAuthRoutes);
