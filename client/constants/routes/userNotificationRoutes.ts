import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserNotificationApi =
  | "createNotification"
  | "getAllMyNotifications"
  | "deleteAllNofifications"
  | "getNotificationById"
  | "deleteNotificationById"
  | "readNotificationById"
  | "readAllMyNotification"
  | "getUnreadNotificationCount";

const rawUserNotificationRoutes: Record<IUserNotificationApi, string> = {
  createNotification: "/users/notifications",
  deleteNotificationById: "/users/notifications",
  getNotificationById: "/users/notifications",
  readNotificationById: "/users/notifications",
  readAllMyNotification: "/users/notifications/mark-all-read",
  getUnreadNotificationCount: "/users/notifications/unread-count",
  getAllMyNotifications: "/users/notifications/my-notifications",
  deleteAllNofifications: "/users/notifications/delete-my-notifications",
};

export const userNotificationRoutes: Record<IUserNotificationApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawUserNotificationRoutes);
