export interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number | null;
  priceLevel: number;
  types: string[];
  photos: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  isSaved: boolean;
  distanceMeters: number;
  phone?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  reviews?: Array<{
    user: string;
    rating: number;
    text: string;
    createdAt: string;
  }>;
}
