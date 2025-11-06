"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { UserPersonalization } from "@/data/interfaces/UserPersonalization";
import { Button } from "@/components/ui";

interface IUserPersonalizationCard {
  data?: UserPersonalization | null;
  isLoading?: boolean;
  className?: string;
  setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserPersonalizationCard: React.FC<IUserPersonalizationCard> = ({
  data,
  isLoading = false,
  className,
  setEditProfile,
}) => {
  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>User Personalization</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>User Personalization</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground py-8 text-center">
          No personalization data available.
        </CardContent>
      </Card>
    );
  }

  const {
    preferredCuisines,
    dietaryRestrictions,
    mealPreferences,
    preferredDeliveryTime,
    paymentPreference,
    allergies,
  } = data;

  const Section = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );

  const renderBadges = (items: string[]) =>
    items.length > 0 ? (
      items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="text-xs capitalize bg-muted"
        >
          {item}
        </Badge>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">None</p>
    );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>User Personalization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Section label="Preferred Cuisines">
          {renderBadges(preferredCuisines)}
        </Section>

        <Separator />

        <Section label="Dietary Restrictions">
          {renderBadges(dietaryRestrictions)}
        </Section>

        <Separator />

        <Section label="Meal Preferences">
          {renderBadges(mealPreferences)}
        </Section>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Section label="Preferred Delivery Time">
            <Badge variant="outline" className="text-xs">
              {preferredDeliveryTime}
            </Badge>
          </Section>

          <Section label="Payment Preference">
            <Badge variant="outline" className="text-xs">
              {paymentPreference}
            </Badge>
          </Section>
        </div>

        <Separator />

        <Section label="Allergies">
          {allergies ? (
            <Badge variant="destructive" className="text-xs">
              {allergies}
            </Badge>
          ) : (
            <p className="text-sm text-muted-foreground">None</p>
          )}
        </Section>

        <Separator />

        <section className="flex justify-end">
          <Button onClick={() => setEditProfile(true)}>
            Update Preference
          </Button>
        </section>
      </CardContent>
    </Card>
  );
};
