import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusStopApi = "createBusCategory" | "subscribeToBusForANewTermInASchool" | "getAllBusStops";

const rawBusStopRoutes: Record<IBusStopApi, string> = {
  createBusCategory: "/addresses/create-bus-category",
  subscribeToBusForANewTermInASchool: "/addresses/new-term-bus-subscription",
  getAllBusStops: "/addresses/get-all-bus-stops",
};

// Use the function to create routes with the base path
export const busStopRoutes: Record<IBusStopApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawBusStopRoutes,
);
