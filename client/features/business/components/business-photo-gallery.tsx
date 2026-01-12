"use client";

import {
  BukkaButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LazyImage,
  SmartFileUploader,
} from "@/components/ui";
import {
  FileCategoryEnum,
  FileReferenceTypeEnum,
  QueryKeyEnum,
  UserRoleEnum,
} from "@/data/enums";
import { Business } from "@/data/interfaces/Business";
import { File } from "@/data/interfaces/File";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { useDeleteFile } from "@/data/mutations/file/use-file-mutations";
import { FileApiService } from "@/data/services";
import { useAuth } from "@/providers";
import { queryClient } from "@/lib";
import { Camera, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface IBusinessPhotoGallery {
  business: Business | Recommendation;
  businessImages: File[];
}

export function BusinessPhotoGallery({
  business,
  businessImages,
}: IBusinessPhotoGallery) {
  const { user } = useAuth();
  const pathname = usePathname();

  const hasAccessToUpdate =
    [UserRoleEnum.ADMIN, UserRoleEnum.VENDOR].includes(
      user?.role as UserRoleEnum
    ) && pathname.startsWith("/dashboard");

  const deleteFileMutation = useDeleteFile({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_FILES],
      });
    },
  });

  const handleMakeCover = (image: File) => {
    console.log("IMAGE TO MAKE COVER: ", image);
  };

  const handleDelete = (image: File) => {
    deleteFileMutation.mutate(image.id as number);
  };

  return (
    <Card className="h-max">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Photos
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full space-y-6">
        {businessImages.length > 0 && (
          <div className="flex space-x-3 overflow-x-auto py-1">
            {businessImages.map((p, i) => (
              <div
                key={p?.id ?? i}
                className="relative flex-shrink-0 rounded-lg overflow-hidden group"
                style={{
                  aspectRatio: "1 / 1",
                  width: "150px",
                }}
              >
                <LazyImage
                  src={p?.fullPath}
                  alt={`${business?.name} photo ${i + 1}`}
                  className="object-cover w-full h-full"
                />

                {/* Overlay for hover (desktop) */}
                {hasAccessToUpdate && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex flex-col items-center justify-center gap-2 text-white">
                    <BukkaButton size="sm" onClick={() => handleMakeCover(p)}>
                      Make Cover
                    </BukkaButton>
                    <BukkaButton
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(p)}
                      disabled={deleteFileMutation.isPending}
                    >
                      {deleteFileMutation.isPending ? (
                        <span className="flex gap-2 items-center">
                          <Loader2 className="animate-spin" />
                          Deleting
                        </span>
                      ) : (
                        "Delete"
                      )}
                    </BukkaButton>
                  </div>
                )}

                {/* Mobile-friendly actions (no hover) */}
                {hasAccessToUpdate && (
                  <div className="absolute bottom-1 right-1 lg:hidden flex gap-2">
                    <BukkaButton
                      size="sm"
                      onClick={() => handleMakeCover(p)}
                      className="p-1 text-xs"
                    >
                      Cover
                    </BukkaButton>
                    <BukkaButton
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p)}
                      className="p-1 text-xs"
                      disabled={deleteFileMutation.isPending}
                    >
                      {deleteFileMutation.isPending ? (
                        <span className="flex gap-2 items-center">
                          <Loader2 className="animate-spin" />
                          Deleting
                        </span>
                      ) : (
                        "Delete"
                      )}
                    </BukkaButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {businessImages.length === 0 && (
          <div>
            <p className="text-muted-foreground leading-relaxed">
              No photo yet.
            </p>
          </div>
        )}

        {hasAccessToUpdate && (
          <div>
            <SmartFileUploader
              title="Add Business Images"
              useCameraModal
              isMultiple
              uploadFn={FileApiService.uploadFile}
              cameraModalTrigger={
                <BukkaButton size="sm">Upload Photos</BukkaButton>
              }
              extraParams={{
                referenceType: FileReferenceTypeEnum.BUSINESS,
                category: FileCategoryEnum.BUSINESS_IMAGES,
                referenceId: business?.id,
                isPublic: true,
                metadata: {
                  altText: `${business?.name} - images`,
                },
              }}
              onUploadSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: [QueryKeyEnum.BUSINESS_FILES, business?.id],
                });
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
