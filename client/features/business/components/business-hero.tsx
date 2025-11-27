import Image from "next/image";
import { Button, SmartFileUploader } from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { File } from "@/data/interfaces/File";
import { Loader2, Share2, Star } from "lucide-react";
import { FavoriteButton } from "./favorite-button";
import { toast } from "sonner";
import { FileApiService } from "@/data/services";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
  UserRoleEnum,
} from "@/data/enums";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers";

export function BusinessHero({
  isLoadingFiles,
  business,
  coverImage,
}: {
  business: Business;
  isLoadingFiles: boolean;
  coverImage: File | null | undefined;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleShare = async () => {
    try {
      if (!business) return;
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Success", {
          description: "Link copied to clipboard!",
        });
      }
    } catch {
      // swallow but optionally show
      toast.error("Failure", {
        description: "Unable to copy/share link.",
      });
    }
  };

  return (
    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
      {isLoadingFiles ? (
        <Loader2 className="animate-spin h-32 w-32" />
      ) : coverImage ? (
        <Image
          src={coverImage?.fullPath}
          alt={business?.name}
          fill
          className="object-cover"
          priority={!!coverImage?.fullPath}
        />
      ) : (
        <div className="w-full h-full warm-gradient flex items-center justify-center">
          <span className="text-white text-4xl lg:text-6xl font-bold">
            {business?.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/28" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {business?.name}
          </h1>
          <div className="flex items-center gap-3 text-white">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {business?.averageRating?.toFixed(1) ?? "0.0"}
            </span>
            <span className="opacity-80">
              ({business?.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            title={"Share Business"}
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <FavoriteButton
            variant="outline"
            businessId={business?.id}
            className="rounded-lg"
            iconClassName="w-4 h-4 text-red-500"
          />
        </div>
      </div>

      {user &&
        [UserRoleEnum.ADMIN, UserRoleEnum.VENDOR].includes(
          user?.role as UserRoleEnum
        ) && (
          <div className="absolute top-12 right-0">
            <div className="relative">
              <SmartFileUploader
                title="Add Business Images"
                isMultiple={true}
                maxFiles={1}
                useCameraModal
                uploadFn={FileApiService.uploadFile}
                // cameraModalTrigger={
                //   <BukkaButton size="sm">Upload Photos</BukkaButton>
                // }
                extraParams={{
                  referenceType: FileReferenceTypeEnum.BUSINESS,
                  category: FileCategoryEnum.BUSINESS_COVER,
                  referenceId: business?.id,
                  isPublic: true,
                  metadata: {
                    altText: `${business?.name} - cover image`,
                  },
                }}
                onUploadSuccess={() => {
                  queryClient.invalidateQueries({
                    queryKey: [QueryKeyEnum.BUSINESS_FILES, business?.id],
                  });
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
}
