import { Order } from "../interfaces/Order";
import { OrderApiService } from "../services";
import { useCustomQuery } from "./base";

export const useOrders = () => {
  return useCustomQuery<Order[]>(["orders"], OrderApiService.getOrders, {
    refetchInterval: 4000, // 4s polling for live updates
  });
};

export const useVendorsOrder = () => {
  return useCustomQuery<Order[]>(["orders"], OrderApiService.getOrders, {
    refetchInterval: 4000, // 4s polling for live updates
  });
};
