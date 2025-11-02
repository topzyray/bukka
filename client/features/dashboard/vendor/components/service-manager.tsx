// components/vendor/services/ServiceManager.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceList } from "./ui/service-list";
import { ServiceForm } from "./form/service-form";
import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  Service,
} from "@/data/temp/use-services";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  businessId: number;
}

export function ServiceManager({ businessId }: Props) {
  const { data: services, isLoading } = useGetServices(businessId);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Service | null>(null);

  const handleCreateOrUpdate = async (data: Partial<Service>) => {
    try {
      if (editData) {
        // await updateService.mutateAsync({
        //   ...data,
        //   id: editData?.id,
        //   businessId,
        // });
        toast.success("Service updated successfully");
      } else {
        await createService.mutateAsync({ ...data, businessId });
        toast.success("Service created successfully");
      }
      setOpenForm(false);
      setEditData(null);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteService.mutateAsync(id, {});
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Services</h2>
        <Button onClick={() => setOpenForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <ServiceList
        services={services || []}
        onEdit={(service) => {
          setEditData(service);
          setOpenForm(true);
        }}
        onDelete={handleDelete}
      />

      <ServiceForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        initialData={editData || undefined}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}
