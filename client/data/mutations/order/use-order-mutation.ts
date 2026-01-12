"use client";

import { queryClient } from "@/lib";
import { toast } from "sonner";
import { useCustomMutation } from "../base";
import { OrderApiService } from "@/data/services";
import { Order } from "@/data/interfaces/Order";
import { QueryKeyEnum } from "@/data/enums";

export const useOrderMutation = () => {
  const mutation = useCustomMutation(OrderApiService.createOrder, {
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeyEnum.ORDERS] });

      const prevOrders =
        queryClient.getQueryData<Order[]>([QueryKeyEnum.ORDERS]) || [];

      // const optimisticOrder: Order = {
      //   id: `temp-${Date.now()}`,
      //   businessId: newOrder.businessId,
      //   itemName: newOrder.itemName,
      //   quantity: newOrder.quantity,
      //   note: newOrder.note,
      //   status: "pending",
      //   createdAt: new Date().toISOString(),
      // };
      const optimisticOrder = {
        id: `temp-${Date.now()}`,
        businessId: newOrder.businessId,
        itemName: newOrder.itemName,
        quantity: newOrder.quantity,
        note: newOrder.note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        [QueryKeyEnum.ORDERS],
        [...prevOrders, optimisticOrder]
      );

      toast.loading("Placing your order...");

      return { prevOrders };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Order[]>([QueryKeyEnum.ORDERS], (old = []) =>
        old.map((o) => (o.id.startsWith("temp-") ? data : o))
      );
      toast.success("Order confirmed!");
    },

    onError: (error: any, _, context) => {
      toast.error("Order failed. Please try again.");
      if (context?.prevOrders) {
        queryClient.setQueryData([QueryKeyEnum.ORDERS], context.prevOrders);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.ORDERS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
  });

  return mutation;
};

export const useOrderStatusMutation = (businessId: number) => {
  const mutation = useCustomMutation(OrderApiService.createOrder, {
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeyEnum.ORDERS] });

      const prevOrders =
        queryClient.getQueryData<Order[]>([QueryKeyEnum.ORDERS]) || [];

      const optimisticOrder = {
        id: `temp-${Date.now()}`,
        businessId: newOrder.businessId,
        itemName: newOrder.itemName,
        quantity: newOrder.quantity,
        note: newOrder.note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      // const optimisticOrder: Order = {
      //   id: `temp-${Date.now()}`,
      //   businessId: newOrder.businessId,
      //   itemName: newOrder.itemName,
      //   quantity: newOrder.quantity,
      //   note: newOrder.note,
      //   status: "pending",
      //   createdAt: new Date().toISOString(),
      // };

      queryClient.setQueryData(
        [QueryKeyEnum.ORDERS],
        [...prevOrders, optimisticOrder]
      );

      toast.loading("Placing your order...");

      return { prevOrders };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Order[]>([QueryKeyEnum.ORDERS], (old = []) =>
        old.map((o) => (o.id.startsWith("temp-") ? data : o))
      );
      toast.success("Order confirmed!");
    },

    onError: (error: any, _, context) => {
      toast.error("Order failed. Please try again.");
      if (context?.prevOrders) {
        queryClient.setQueryData([QueryKeyEnum.ORDERS], context.prevOrders);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.ORDERS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
  });

  return mutation;
};
