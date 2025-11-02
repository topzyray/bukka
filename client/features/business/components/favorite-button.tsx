"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/data/queries";
import { cn } from "@/lib/utils";
import { useToggleFavorite } from "@/data/mutations/favorite/use-toggle-favorite";
import { useFavorites } from "@/data/queries/use-favorites";
import { Favorite } from "@/data/interfaces/Favorite";
import { BukkaButton } from "@/components/ui/button-variants";

export const FavoriteButton = ({
  useIcon = true,
  businessId,
  className,
  iconClassName,
  variant = "ghost",
  size = "icon",
}: {
  useIcon?: boolean;
  businessId: number;
  className?: string;
  iconClassName?: string;
  size?: "default" | "sm" | "lg" | "icon" | "xl" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "hero"
    | "warm"
    | "glow"
    | "glass"
    | "float"
    | null
    | undefined;
}) => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: userFavoriteData } = useFavorites();

  const isUserFavorite =
    userFavoriteData?.responseData?.data &&
    userFavoriteData?.responseData?.data.find(
      (fav: Favorite) =>
        fav.businessId === businessId && fav.userId === user?.id
    );

  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      router.push("/signin");
      return;
    }
    toggleFavorite({ businessId, userId: user?.id });
  };

  return (
    <BukkaButton
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-full",
        isUserFavorite && "text-red-500",
        className
      )}
      title={user ? "Add to favorites" : "Login to save favorites"}
    >
      {useIcon ? (
        <Heart
          className={cn(
            "w-4 h-4",
            isUserFavorite ? "fill-current" : "",
            iconClassName
          )}
        />
      ) : (
        <>
          {isPending ? (
            <span className="flex items-center gap-1">
              <Loader2 size={16} className="animate-spin" />
              <span className="animate-pulse">Adding Business</span>
            </span>
          ) : isUserFavorite ? (
            <span className="flex items-center gap-1">
              <span>In Your Favourite </span>
              <Heart
                className={cn(
                  "w-5 h-5",
                  isUserFavorite ? "fill-current" : "",
                  iconClassName
                )}
              />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>Add to Favourite</span>
              <Heart
                className={cn(
                  "w-5 h-5",
                  isUserFavorite ? "fill-current" : "",
                  iconClassName
                )}
              />
            </span>
          )}
        </>
      )}
    </BukkaButton>
  );
};
