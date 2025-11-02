"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCustomMutation } from "../base";
import { OrderApiService } from "@/data/services";
import { Order } from "@/data/interfaces/Order";

export const useOrderMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useCustomMutation(OrderApiService.createOrder, {
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const prevOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];

      const optimisticOrder: Order = {
        id: `temp-${Date.now()}`,
        businessId: newOrder.businessId,
        itemName: newOrder.itemName,
        quantity: newOrder.quantity,
        note: newOrder.note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["orders"], [...prevOrders, optimisticOrder]);

      toast.loading("Placing your order...");

      return { prevOrders };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.map((o) => (o.id.startsWith("temp-") ? data : o))
      );
      toast.success("Order confirmed!");
    },

    onError: (error: any, _, context) => {
      toast.error("Order failed. Please try again.");
      if (context?.prevOrders) {
        queryClient.setQueryData(["orders"], context.prevOrders);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return mutation;
};

export const useOrderStatusMutation = (businessId: number) => {
  const queryClient = useQueryClient();

  const mutation = useCustomMutation(OrderApiService.createOrder, {
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const prevOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];

      const optimisticOrder: Order = {
        id: `temp-${Date.now()}`,
        businessId: newOrder.businessId,
        itemName: newOrder.itemName,
        quantity: newOrder.quantity,
        note: newOrder.note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["orders"], [...prevOrders, optimisticOrder]);

      toast.loading("Placing your order...");

      return { prevOrders };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.map((o) => (o.id.startsWith("temp-") ? data : o))
      );
      toast.success("Order confirmed!");
    },

    onError: (error: any, _, context) => {
      toast.error("Order failed. Please try again.");
      if (context?.prevOrders) {
        queryClient.setQueryData(["orders"], context.prevOrders);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return mutation;
};
