"use client";

import {
  Badge,
  BukkaButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { DataHelper, TextHelper } from "@/helpers";
import { Globe, MapPin, Phone } from "lucide-react";
import { useMemo } from "react";
import { BusinessHelper } from "../helper/bussiness-helper";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { toast } from "sonner";
import { useAuth } from "@/providers";
import { useRouter } from "next/navigation";

export function BusinessInfoCard({
  business,
}: {
  business: Business | Recommendation;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const data = DataHelper.normalizeBusiness(business);
  const openNow = useMemo(
    () => BusinessHelper.isOpenNow(data?.openingHours),
    [data?.openingHours]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between flex-wrap gap-6">
          <div className="flex gap-6">
            <div className="space-y-2">
              <Label>Type/Category</Label>
              <Badge variant="outline" className="uppercase">
                {TextHelper.normalizeText(data?.type)}
              </Badge>
            </div>

            <Separator orientation="vertical" />

            <div className="space-y-2">
              <Label>Availability</Label>
              <Badge variant={openNow ? "success" : "destructive"}>
                {openNow ? "Open Now" : "Closed"}
              </Badge>
            </div>
          </div>

          {!business.ownerId && (
            <BukkaButton
              size="sm"
              variant="glow"
              onClick={() => {
                if (!user) {
                  toast("Requires Signin", {
                    description:
                      "You need to sign in before recommending a business",
                  });
                } else {
                }
              }}
            >
              Claim Business
            </BukkaButton>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Cuisines</Label>
          <div className="flex flex-wrap gap-1">
            {data?.cuisines?.length === 0
              ? "No cusines add yet!"
              : data.cuisines?.map((c: string) => (
                  <Badge key={c} variant="secondary" className="capitalize">
                    {c}
                  </Badge>
                ))}
          </div>
        </div>

        <Separator />

        <p className="text-muted-foreground leading-relaxed">
          {data.description || "No description provided."}
        </p>

        <div className="flex items-center gap-3">
          {data.website && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(data.website, "_blank")}
            >
              <Globe className="w-5 h-5" />
            </Button>
          )}
          {data.phoneNumber && (
            <Button asChild variant="outline" size="icon">
              <a href={`tel:${data.phoneNumber}`}>
                <Phone className="w-5 h-5" />
              </a>
            </Button>
          )}
          <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {data.location?.address ??
                `${data.location?.city ?? ""}${
                  data.location?.state ? ", " + data.location.state : ""
                }`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
