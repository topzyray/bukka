import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type INotificationSettingApi =
  | "getMyNotificationSetting"
  | "updateMyNotificationSetting";

const rawNotificationSettingRoutes: Record<INotificationSettingApi, string> = {
  getMyNotificationSetting: "/users/notification-settings",
  updateMyNotificationSetting: "/users/notification-settings",
};

export const notificationSettingRoutes: Record<
  INotificationSettingApi,
  string
> = RouteHelper.createRoutes(BACKEND_SVC_PATH, rawNotificationSettingRoutes);
