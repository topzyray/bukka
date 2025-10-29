"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useCurrentUser } from "@/server/queries";
import { BukkaButton } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useToggleFavorite } from "@/server/mutations/favorite/use-toggle-favorite";

export const FavoriteButton = ({
  businessId,
  isFavorite,
}: {
  businessId: number;
  isFavorite: boolean;
}) => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handleClick = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    toggleFavorite({ businessId, userId: user?.id });
  };

  return (
    <BukkaButton
      size="icon"
      variant="ghost"
      onClick={handleClick}
      disabled={isPending}
      className={cn("rounded-full", isFavorite && "text-red-500")}
      title={user ? "Add to favorites" : "Login to save favorites"}
    >
      <Heart className={cn("w-5 h-5", isFavorite ? "fill-current" : "")} />
    </BukkaButton>
  );
};
