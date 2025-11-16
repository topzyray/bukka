import { Order } from "../interfaces/Order";
import { OrderApiService } from "../services";
import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomQuery,
} from "./base";

export const useOrdersQuery = ({
  filters = {},
  pageNumber = 1,
  pageSize = 10,
  enabled = true,
}: {
  filters?: Record<string, any>;
  pageNumber?: number;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Order[]>>, Error>(
    ["orders", filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      OrderApiService.getOrders({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, ...filters },
      enabled,
    }
  );
};

export const useVendorsOrder = ({
  filters = {},
  pageNumber = 1,
  pageSize = 10,
  enabled = true,
}: {
  filters?: Record<string, any>;
  pageNumber?: number;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Order[]>>, Error>(
    ["orders", filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      OrderApiService.getOrders({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, ...filters },
      enabled,
    }
  );
};

export const useOrderDetailsQuery = ({
  orderId,
  enabled = true,
}: {
  orderId?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<Order>, Error>(
    ["order-details", orderId],
    () => OrderApiService.getOrderById(orderId as number),
    {
      enabled: enabled && !!orderId,
    }
  );
};
