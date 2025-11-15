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
import { Captions, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  BukkaButton,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";

export function ServiceManager({ business }: { business: Business }) {
  const { data: services, isLoading } = useGetServices(business.id);
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
        await createService.mutateAsync({ ...data, businessId: business.id });
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
    <Sheet>
      <SheetTrigger asChild>
        <BukkaButton>
          <Captions /> Service
        </BukkaButton>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Service Management</SheetTitle>
          <SheetDescription>
            Manage all business services for{" "}
            <span className="capitalize">{business?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <Separator />
        <div className="px-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Services</h2>
              <Button onClick={() => setOpenForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>

            <ServiceForm
              open={openForm}
              onClose={() => {
                setOpenForm(false);
                setEditData(null);
              }}
              initialData={editData || undefined}
              onSubmit={handleCreateOrUpdate}
            />

            <Separator />

            <ServiceList
              services={services || []}
              onEdit={(service) => {
                setEditData(service);
                setOpenForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
