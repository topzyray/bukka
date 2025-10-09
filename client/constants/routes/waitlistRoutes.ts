import { BackendUrlEnum } from "@/server/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IWaitlistApi =
  | "joinWaitlist"
  | "getWaitlist"
  | "getWaitlistCount"
  | "deleteWaitlist";

const rawAuthRoutes: Record<IWaitlistApi, string> = {
  joinWaitlist: "/waitlist/join",
  getWaitlist: "/waitlist",
  getWaitlistCount: "/waitlist/count",
  deleteWaitlist: "/waitlist",
};

export const waitlistRoutes: Record<IWaitlistApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawAuthRoutes);
