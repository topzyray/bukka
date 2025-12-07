import * as z from "zod";
import { toast } from "sonner";
import {
  openingHoursSchema,
  timeRegex,
  weekdayNames,
} from "@/data/schemas/business";
import { Business } from "@/data/interfaces/Business";
import { BusinessLike } from "@/data/interfaces/BusinessLike";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { PlaceProviderEnum } from "@/data/enums/PlaceProviderEnum";
import { TransformedBusiness } from "@/data/interfaces/TransformedBusiness";

interface ItemWithId {
  _id: string | number;
  [key: string]: any;
}

export class DataHelper {
  static getMatchingValues<T, U, R>(
    sourceArray: T[],
    compareArray: U[],
    matcher: (sourceItem: T, compareItem: U) => boolean,
    returnValue: (sourceItem: T) => R
  ): R[] {
    return sourceArray
      .filter((sourceItem) =>
        compareArray.some((compareItem) => matcher(sourceItem, compareItem))
      )
      .map(returnValue);
  }

  static getMatchingIds<T>(firstArray: any[], secondArray: T[]): string[] {
    return firstArray
      .filter((item) => secondArray.includes(item.name))
      .map((item) => item._id);
  }

  /**
   * Extracts a value from the first object in an array that matches a condition.
   *
   * @param data - Array of objects to search
   * @param conditionKey - Object key to check the condition against
   * @param conditionValue - Value that the conditionKey must match
   * @param returnKey - Key of the object whose value you want to return
   */
  static extractValueFromArray<
    T extends Record<string, any>,
    K extends keyof T,
    R extends keyof T
  >(
    data: T[],
    conditionKey: K,
    conditionValue: T[K],
    returnKey: R
  ): T[R] | null {
    if (!data || data.length === 0) {
      toast("Data is empty");
      return null;
    }

    const item = data.find((obj) => obj[conditionKey] === conditionValue);
    return item ? item[returnKey] : null;
  }

  static findMissingItemsInArray<T extends ItemWithId>(
    array1: T[],
    array2: T[]
  ): T[] {
    if (!Array.isArray(array1)) {
      console.warn("One or both inputs are not arrays.");
      toast.error("Array 1 inputs are not arrays.");
      return [];
    }

    if (!Array.isArray(array2)) {
      console.warn("One or both inputs are not arrays.");
      toast.error("Array 2 inputs are not arrays.");
      return [];
    }

    return array1.filter((item1) => {
      if (!item1 || typeof item1 !== "object" || item1._id === undefined) {
        console.warn("Invalid item in array1:", item1);
        toast.error(`Invalid item in first array: ${item1}`);
        return false;
      }

      return !array2.some(
        (item2) =>
          item2 &&
          typeof item2 === "object" &&
          item2._id !== undefined &&
          item2._id === item1._id
      );
    });
  }

  static minAge(age: number): string {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - age);
    const minDate = currentDate.toISOString().split("T")[0];
    return minDate;
  }

  static stringToBoolean(str: string): boolean {
    return str.toLowerCase() === "true";
  }

  static normalizeBusiness(entity: Business | Recommendation): BusinessLike {
    return {
      id: entity.id,
      name: entity.name,
      ownerId: entity?.ownerId,
      description: entity.description ?? "",
      type: entity.type,
      cuisines: entity.cuisines ?? [],
      website: entity.website,
      phoneNumber: entity.phoneNumber,
      location: {
        address: entity.location?.address,
        city: entity.location?.city,
        state: entity.location?.state,
      },
      openingHours: "openingHours" in entity ? entity.openingHours : undefined,
      averageRating: "averageRating" in entity ? entity.averageRating : 0,
      reviewCount: "reviewCount" in entity ? entity.reviewCount : 0,
    };
  }

  static transformPlaceToBusinessUniversal(
    apiData: any,
    recommenderId: number,
    categoryId: number,
    provider: PlaceProviderEnum
  ): TransformedBusiness {
    let name = "Unnamed Business";
    let address = "";
    let city = "";
    let state = "";
    let country = "";
    let latitude = 0;
    let longitude = 0;
    let zipCode = null;
    let openingHours: z.infer<typeof openingHoursSchema> = null;
    let phoneNumber = null;
    let email = null;
    let website = null;
    let description = null;
    let cuisines: string[] = [];
    let socialLinks = {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      tiktok: "",
    };

    switch (provider) {
      case PlaceProviderEnum.GOOGLE:
        name = apiData.name ?? name;
        address = apiData.formatted_address ?? "";
        city =
          apiData.address_components?.find((c: any) =>
            c.types.includes("locality")
          )?.long_name ?? "";
        state =
          apiData.address_components?.find((c: any) =>
            c.types.includes("administrative_area_level_1")
          )?.long_name ?? "";
        country =
          apiData.address_components?.find((c: any) =>
            c.types.includes("country")
          )?.long_name ?? "";
        zipCode =
          apiData.address_components?.find((c: any) =>
            c.types.includes("postal_code")
          )?.long_name ?? null;
        latitude = apiData.geometry?.location?.lat ?? 0;
        longitude = apiData.geometry?.location?.lng ?? 0;
        phoneNumber = apiData.formatted_phone_number ?? null;
        website = apiData.website ?? null;
        description = apiData.description ?? null;
        cuisines = apiData.types ?? [];
        if (apiData.opening_hours) {
          openingHours = {
            periods:
              apiData.opening_hours.periods?.map((p: any) => ({
                day: p?.open?.day,
                openTime: p?.open?.time?.match(timeRegex)?.[0],
                closeTime: p?.close?.time?.match(timeRegex)?.[0],
              })) ?? [],
            weekdayText: apiData.opening_hours.weekday_text ?? [],
          };
        }
        break;

      case PlaceProviderEnum.GEOAPIFY:
        name = apiData.name ?? name;
        address = apiData.formatted ?? "";
        city = apiData.city ?? "";
        state = apiData.state ?? "";
        country = apiData.country ?? "";
        zipCode = apiData.postcode ?? null;
        latitude = apiData.lat ?? 0;
        longitude = apiData.lon ?? 0;
        description = apiData.description ?? null;
        phoneNumber = apiData.phone ?? null;
        website = apiData.website ?? null;
        cuisines = apiData.categories?.map((c: any) => c) ?? [];
        if (apiData.hours) {
          openingHours = {
            periods:
              apiData.hours?.map((p: any) => ({
                day: weekdayNames.findIndex(
                  (d) => d.toLowerCase() === p.day?.toLowerCase()
                ),
                openTime: p.openTime?.match(timeRegex)?.[0],
                closeTime: p.closeTime?.match(timeRegex)?.[0],
              })) ?? [],
            weekdayText: apiData.hours_text ?? [],
          };
        }
        break;
    }

    const location = {
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      placeId: apiData.place_id,

      zipCode,
    };

    return {
      recommenderId,
      name,
      categoryId,
      description,
      phoneNumber,
      email,
      website,
      registrationNo: null,
      openingHours,
      cuisines,
      socialLinks,
      location,
    };
  }
}
