"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { TextHelper } from "@/helpers";
import { Globe, MapPin, Phone } from "lucide-react";
import { useMemo } from "react";
import { BusinessHelper } from "../helper/bussiness-helper";

export function BusinessInfoCard({ business }: { business: Business }) {
  const openNow = useMemo(
    () => BusinessHelper.isOpenNow(business?.openingHours),
    [business?.openingHours]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-6 h-16">
          <div className="space-y-2">
            <Label>Type/Category</Label>
            <Badge variant="outline" className="uppercase">
              {TextHelper.normalizeText(business?.type)}
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

        <div className="space-y-2">
          <Label>Cuisines</Label>
          <div className="flex flex-wrap gap-1">
            {business?.cuisines?.length === 0
              ? "No cusines add yet!"
              : business.cuisines?.map((c: string) => (
                  <Badge key={c} variant="secondary" className="capitalize">
                    {c}
                  </Badge>
                ))}
          </div>
        </div>

        <Separator />

        <p className="text-muted-foreground leading-relaxed">
          {business.description || "No description provided."}
        </p>

        <div className="flex items-center gap-3">
          {business.website && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(business.website, "_blank")}
            >
              <Globe className="w-5 h-5" />
            </Button>
          )}
          {business.phoneNumber && (
            <Button asChild variant="outline" size="icon">
              <a href={`tel:${business.phoneNumber}`}>
                <Phone className="w-5 h-5" />
              </a>
            </Button>
          )}
          <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {business.location?.address ??
                `${business.location?.city ?? ""}${
                  business.location?.state ? ", " + business.location.state : ""
                }`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
