"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// const EditableMap = dynamic(() => import("./EditableMap"), { ssr: false });

export const LocationPicker: React.FC<{ business: any }> = ({ business }) => {
  const qc = useQueryClient();
  const [pos, setPos] = useState<{ lat: number; lng: number }>(() => ({
    lat: business.location?.latitude ?? 0,
    lng: business.location?.longitude ?? 0,
  }));

  // const mutation = useMutation({
  //   mutationFn: async (payload: any) => {
  //     const { data } = await axiosClient.put(
  //       `/api/vendor/businesses/${business.id}`,
  //       { location: payload }
  //     );
  //     return data;
  //   },
  //   onMutate: async (newLoc) => {
  //     await qc.cancelQueries({ queryKey: ["vendor-business", business.id] });
  //     const prev = qc.getQueryData(["vendor-business", business.id]);
  //     qc.setQueryData(["vendor-business", business.id], (old: any) => ({
  //       ...old,
  //       location: { ...old.location, ...newLoc },
  //     }));
  //     toast.loading("Updating location...");
  //     return { prev };
  //   },
  //   onError: (err, vars, ctx: any) => {
  //     toast.error("Failed to update location");
  //     if (ctx?.prev)
  //       qc.setQueryData(["vendor-business", business.id], ctx.prev);
  //   },
  //   onSuccess: () => {
  //     toast.success("Location updated");
  //     qc.invalidateQueries({ queryKey: ["vendor-business", business.id] });
  //     qc.invalidateQueries({ queryKey: ["vendor-businesses"] });
  //   },
  // });

  const save = async () => {
    // await mutation.mutateAsync({ latitude: pos.lat, longitude: pos.lng });
  };

  return (
    <div className="space-y-3">
      <div className="w-full h-56 rounded-md overflow-hidden">
        {/* <EditableMap
          lat={pos.lat}
          lng={pos.lng}
          onChange={(lat, lng) => setPos({ lat, lng })}
        /> */}
        EDIT MAP WILL BE HERE
      </div>
      <div className="flex gap-2">
        <Button onClick={save}>Save Location</Button>
      </div>
    </div>
  );
};
