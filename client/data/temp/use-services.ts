import { queryClient } from "@/lib";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface Service {
  id: number;
  businessId: number;
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({ baseURL: "/api/vendor/services" });

export function useGetServices(businessId: number) {
  return useQuery<Service[]>({
    queryKey: ["services", businessId],
    queryFn: async () => {
      const { data } = await api.get(`?businessId=${businessId}`);
      return data;
    },
    enabled: !!businessId,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (payload: Partial<Service>) => {
      const { data } = await api.post("/", payload);
      return data;
    },
    onSuccess: (_, __, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ["services", context?.businessId],
      });
    },
  });
}

export function useUpdateService() {
  return useMutation({
    mutationFn: async (payload: Partial<Service> & { id: number }) => {
      const { data } = await api.put(`/${payload.id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.businessId],
      });
    },
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/${id}`);
    },
    onSuccess: (_, __, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ["services", context?.businessId],
      });
    },
  });
}
