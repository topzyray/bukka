interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface IPlace {
  geometry?: {
    location?: {
      lat: number | (() => number);
      lng: number | (() => number);
    };
  };
  formatted_address?: string;
  place_id?: string;
  address_components?: IAddressComponent[];
}

type TSetValueFunction = (field: string, value: string | number) => void;

export class FormInputHelper {
  static handlePlaceSelect(place: IPlace, setValue: TSetValueFunction) {
    if (!place.geometry || !place.geometry.location) return;

    const lat =
      typeof place.geometry.location.lat === "function"
        ? place.geometry.location.lat()
        : place.geometry.location.lat;
    const lng =
      typeof place.geometry.location.lng === "function"
        ? place.geometry.location.lng()
        : place.geometry.location.lng;

    let country = "";
    let city = "";
    let state = "";

    if (place.address_components) {
      place.address_components.forEach((component) => {
        if (component.types.includes("country")) country = component.long_name;
        if (component.types.includes("locality")) city = component.long_name;
        if (component.types.includes("administrative_area_level_1"))
          state = component.long_name;
      });
    }

    setValue("address", place.formatted_address || "");
    setValue("countryOfResidence", country || "");
    setValue("stateOfResidence", state || "");
    setValue("cityOfResidence", city || "");
    setValue("coordinates.lat", lat);
    setValue("coordinates.long", lng);
    setValue("coordinates.placeId", place.place_id || "");
  }
}
