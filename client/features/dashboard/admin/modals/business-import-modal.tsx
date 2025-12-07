"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  BukkaButton,
  DialogDescription,
  Separator,
  Card,
  CardContent,
  ScrollArea,
  DialogClose,
} from "@/components/ui";
import { PlaceProviderEnum } from "@/data/enums/PlaceProviderEnum";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";
import { useImportBusiness } from "@/data/mutations/business/use-business-mutation";
import { DataHelper } from "@/helpers";
import { useAuth } from "@/providers";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface BusinessImported {
  name: string;
  country: string;
  country_code: string;
  state: string;
  county: string;
  city: string;
  postcode: string;
  suburb: string;
  street: string;
  iso3166_2: string;
  lon: string;
  lat: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  categories: string[];
  details: [];
  datasource: {
    sourcename: string;
    attribution: string;
    license: string;
    url: string;
    raw: {
      name: string;
      osm_id: number;
      amenity: string;
      osm_type: string;
    };
  };
  distance: number;
  place_id: string;
}

interface BusinessImportDialog {
  data: BusinessImported;
  categoriesData: BusinessCategory[];
  watchCategory: string;
  watchProvider: PlaceProviderEnum;
}

export function BusinessImportDialog({
  data,
  categoriesData,
  watchCategory,
  watchProvider,
}: BusinessImportDialog) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const categoryId = DataHelper.extractValueFromArray(
    categoriesData,
    "type",
    watchCategory,
    "id"
  );

  const categorySlug = DataHelper.extractValueFromArray(
    categoriesData,
    "type",
    watchCategory,
    "slug"
  );

  const categoryType = DataHelper.extractValueFromArray(
    categoriesData,
    "type",
    watchCategory,
    "type"
  );

  // const validated = businessSchema.parse(business);

  const business = DataHelper.transformPlaceToBusinessUniversal(
    data,
    user?.id as number,
    categoryId as number,
    watchProvider
  );

  const businessPayload = {
    recommenderId: user?.id,
    name: data.name,
    categoryId: categoryId,
    description: business.description ?? "",
  };

  let locationPayload: any = {
    placeId: data.place_id,
    longitude: Number(data.lon),
    latitude: Number(data.lat),
    type: categoryType,
    slug: categorySlug,
    address: data.address_line2,
    city: data.city,
    state: data.state,
    country: data.country,
    suburb: data.suburb,
    county: data.county,
    street: data.street,
    countryId: data.country_code,
    zipCode: data.postcode,
  };

  const importBusinessMutation = useImportBusiness({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const confirmSingleImport = () => {
    const newImportData = {
      ...businessPayload,
      ...locationPayload,
    };
    importBusinessMutation.mutate(newImportData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <BukkaButton size="sm">Import Business</BukkaButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Business from 3rd-party API</DialogTitle>
          <DialogDescription>
            Review all information before importing
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[80vh]">
          <Card className="overflow-hidden">
            <CardContent className="space-y-4">
              <div className="space-y-4 pr-2 wrap-break-word">
                {/* BASIC INFO */}
                <section className="capitalize">
                  <h3 className="font-semibold">Basic Info</h3>

                  <p className="wrap-break-word">
                    <strong>Name:</strong> {data?.name}
                  </p>

                  <p className="wrap-break-word">
                    <strong>Category:</strong>{" "}
                    {data?.categories?.join(", ") || "N/A"}
                  </p>

                  <p className="wrap-break-word">
                    <strong>Formatted Address:</strong> {data?.formatted}
                  </p>

                  <p className="break-all">
                    <strong>Place ID:</strong> {data?.place_id}
                  </p>
                </section>

                {/* ADDRESS DETAILS */}
                <section>
                  <h3 className="font-semibold">Address Details</h3>

                  <p className="wrap-break-word">
                    <strong>Country:</strong> {data?.country}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Country Code:</strong> {data?.country_code}
                  </p>
                  <p className="wrap-break-word">
                    <strong>State:</strong> {data?.state}
                  </p>
                  <p className="wrap-break-word">
                    <strong>County:</strong> {data?.county}
                  </p>
                  <p className="wrap-break-word">
                    <strong>City:</strong> {data?.city}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Postcode:</strong> {data?.postcode}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Suburb:</strong> {data?.suburb}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Street:</strong> {data?.street}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Address Line 1:</strong> {data?.address_line1}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Address Line 2:</strong> {data?.address_line2}
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold">Coordinates</h3>
                  <p className="break-all">
                    <strong>Latitude:</strong> {data?.lat}
                  </p>
                  <p className="break-all">
                    <strong>Longitude:</strong> {data?.lon}
                  </p>
                </section>

                <Separator />

                {/* DATASOURCE */}
                <section>
                  <h3 className="font-semibold">Datasource</h3>

                  <p className="wrap-break-word">
                    <strong>Source Name:</strong> {data?.datasource?.sourcename}
                  </p>

                  <p className="wrap-break-word">
                    <strong>Attribution:</strong>{" "}
                    {data?.datasource?.attribution}
                  </p>

                  <p className="wrap-break-word">
                    <strong>License:</strong> {data?.datasource?.license}
                  </p>

                  <p className="break-all">
                    <strong>URL:</strong> {data?.datasource?.url}
                  </p>

                  <h4 className="font-semibold mt-2">Raw Data</h4>

                  <p className="break-all">
                    <strong>OSM ID:</strong> {data?.datasource?.raw?.osm_id}
                  </p>
                  <p className="wrap-break-word">
                    <strong>OSM Type:</strong> {data?.datasource?.raw?.osm_type}
                  </p>
                  <p className="wrap-break-word">
                    <strong>Amenity:</strong> {data?.datasource?.raw?.amenity}
                  </p>
                </section>

                {/* DISTANCE / CATEGORY ID */}
                <section>
                  <h3 className="font-semibold">Additional Info</h3>
                  <p className="wrap-break-word">
                    <strong>Distance:</strong> {data?.distance} meters
                  </p>
                  <p className="wrap-break-word">
                    <strong>Category ID:</strong> {categoryId}
                  </p>
                </section>
              </div>

              <Separator />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={confirmSingleImport}>
                  {importBusinessMutation.isPending ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="animate-spin" />
                      Importing
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </DialogFooter>
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
