"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  BukkaButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { AddEditMenuForm } from "../forms/add-edit-menu-form";
import { Menu, Plus } from "lucide-react";

const data: { items: { id: number; name: string; description: string }[] } = {
  items: [
    {
      id: 1,
      name: "Chicken Periperi",
      description: "Very delicious",
    },
  ],
};

export const MenuManager: React.FC<{ business: Business }> = ({ business }) => {
  // const { data } = useQuery(["menu", businessId], async () => {
  //   const { data } = await axiosClient.get(
  //     `/api/vendor/businesses/${businessId}/menu`
  //   );
  //   return data;
  // });

  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: 0,
    image: null as File | null,
  });

  // const createMutation = useMutation({
  //   mutationFn: async (payload: any) => {
  //     const { data } = await axiosClient.post(
  //       `/api/vendor/businesses/${businessId}/menu`,
  //       payload
  //     );
  //     return data;
  //   },
  //   onMutate: async (newItem) => {
  //     await qc.cancelQueries({ queryKey: ["menu", businessId] });
  //     const prev = qc.getQueryData(["menu", businessId]);
  //     qc.setQueryData(["menu", businessId], (old: any[] = []) => [
  //       { id: `temp-${Date.now()}`, ...newItem },
  //       ...old,
  //     ]);
  //     toast.loading("Adding menu item...");
  //     return { prev };
  //   },
  //   onError: (err, _, ctx: any) => {
  //     toast.error("Failed to add item");
  //     if (ctx?.prev) qc.setQueryData(["menu", businessId], ctx.prev);
  //   },
  //   onSuccess: () => {
  //     toast.success("Menu item added");
  //     qc.invalidateQueries({ queryKey: ["menu", businessId] });
  //   },
  // });

  // const handleCreate = async () => {
  //   setCreating(true);
  //   try {
  //     let imageUrl = null;
  //     if (form.image) {
  //       const res = await upload(form.image);
  //       imageUrl = res.fullPath;
  //     }
  //     await createMutation.mutateAsync({
  //       name: form.name,
  //       description: form.description,
  //       price: form.price,
  //       image: imageUrl,
  //     });
  //     setForm({ name: "", description: "", price: 0, image: null });
  //   } catch (err) {
  //     // handled by mutation
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <BukkaButton>
          <Menu /> Menu
        </BukkaButton>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Menu Management</SheetTitle>
          <SheetDescription>
            Manage all business menu for{" "}
            <span className="capitalize">{business?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="px-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Menu Form</CardTitle>
              </CardHeader>
              <CardContent>
                <AddEditMenuForm business={business} isEdit={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border p-2 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <div>₦{item.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
