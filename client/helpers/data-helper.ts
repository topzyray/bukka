import { Business } from "@/data/interfaces/Business";
import { BusinessLike } from "@/data/interfaces/BusinessLike";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { toast } from "sonner";

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

  static processNewClassLevel(level: string): string {
    if (typeof level === "string") {
      if (level === "JSS 3") {
        return "SSS 1";
      } else if (level === "SSS 3") {
        return "";
      } else {
        const levelArr = level.split(" ");
        return (levelArr[0] + " " + (Number(levelArr[1]) + 1)).toString();
      }
    } else {
      throw Error("Only strings are allowed");
    }
  }

  static normalizeBusiness(entity: Business | Recommendation): BusinessLike {
    return {
      id: entity.id,
      name: entity.name,
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
}
