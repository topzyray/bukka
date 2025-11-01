"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const data: { items: { id: number; name: string; description: string }[] } = {
  items: [
    {
      id: 1,
      name: "Chicken Periperi",
      description: "Very delicious",
    },
  ],
};

export const MenuManager: React.FC<{ businessId: string | number }> = ({
  businessId,
}) => {
  // const qc = useQueryClient();
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu</h3>
      </div>

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

      <div className="pt-4">
        <h4 className="font-medium">Add item</h4>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm((s) => ({ ...s, price: Number(e.target.value) }))
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm((s) => ({ ...s, image: e.target.files?.[0] ?? null }))
          }
        />
        <div className="mt-2">
          <Button disabled={creating}>Add</Button>
        </div>
      </div>
    </div>
  );
};
