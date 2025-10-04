"use client";

import { useState, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
// import RestaurantDetailsDrawer from "../drawers/RestaurantDetailsDrawer";
// import { RecommendedBy } from "@/api/interfaces/RecommendedBy";
// import { Location } from "@/api/interfaces/Location";

interface Restaurant {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  rating: number;
  placeId?: string;
  priceLevel?: number;
  photos?: string[];
  cuisine?: string;
  // recommendedBy?: RecommendedBy;
  location?: Location;
  website?: string;
  isPinnedByMe?: boolean;
  isWishlistedByMe?: boolean;
  reviews?: {
    username: string;
    text: string;
    avatar: string;
    daysAgo: number;
  }[];
}

interface RestaurantMapViewProps {
  location?: { lat: number; lng: number };
  hideUI?: boolean;
}

const defaultCenter = { lat: 51.5074, lng: -0.1278 }; // Default to London

export default function RestaurantMapView({
  location = defaultCenter,
  hideUI = true,
}: Readonly<RestaurantMapViewProps>) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [mapCenter, setMapCenter] = useState(location); // Track map center
  const mapRef = useRef<google.maps.Map | null>(null);
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);
  const hasFetched = useRef(false); // Prevent duplicate fetches

  // ✅ Function to fetch restaurants when map center changes
  const fetchRestaurants = useCallback(
    (newLocation: google.maps.LatLngLiteral) => {
      if (!serviceRef.current) return;

      serviceRef.current.nearbySearch(
        {
          location: newLocation,
          radius: 5000,
          type: "restaurant",
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const places = results.map((place) => ({
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0,
              name: place.name || "Unknown Restaurant",
              address: place.vicinity || "No address available",
              rating: place.rating || 0,
              placeId: place.place_id,
            }));
            setRestaurants(places);
          }
        }
      );
    },
    []
  );

  const fetchRestaurantDetails = (placeId: string) => {
    if (!serviceRef.current) return;

    serviceRef.current.getDetails(
      {
        placeId,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "rating",
          "price_level",
          "photos",
          "reviews",
          "types",
          "geometry",
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log("Place Details: ", place);

          setSelectedRestaurant({
            placeId: place.place_id || "",
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
            name: place.name || "Unknown Restaurant",
            address: place.formatted_address || "No address available",
            rating: place.rating || 0,
            priceLevel: place.price_level,
            photos: place.photos
              ? place.photos.map((photo) => photo.getUrl({ maxWidth: 400 }))
              : [],
            cuisine: place.types?.join(", ") || "Not specified",
            reviews: place.reviews
              ? place.reviews.map((review) => ({
                  username: review.author_name,
                  text: review.text,
                  avatar: review.profile_photo_url,
                  daysAgo: Math.floor(review.time / (60 * 60 * 24)),
                }))
              : [],
          });
        } else {
          console.error("Failed to fetch place details:", status);
        }
      }
    );
  };

  // ✅ Called once when the map loads
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    serviceRef.current = new google.maps.places.PlacesService(map);

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRestaurants(map.getCenter()!.toJSON());
    }
  };

  // ✅ Called whenever the user moves the map
  const handleMapIdle = () => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter()!.toJSON();

    // Avoid excessive calls if the center hasn’t moved much
    if (
      Math.abs(newCenter.lat - mapCenter.lat) > 0.001 ||
      Math.abs(newCenter.lng - mapCenter.lng) > 0.001
    ) {
      setMapCenter(newCenter);
      fetchRestaurants(newCenter);
    }
  };

  return (
    <section className="w-full relative h-[calc(100vh - 100px)]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={14}
        options={{
          disableDefaultUI: hideUI,
          zoomControl: true,
        }}
        onLoad={handleMapLoad}
        onIdle={handleMapIdle}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.placeId}
            position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            onClick={() => {
              if (restaurant.placeId) {
                fetchRestaurantDetails(restaurant.placeId);
              }
            }}
            {...(restaurant.placeId ? { placeId: restaurant.placeId } : {})}
          />
        ))}
      </GoogleMap>

      {/* {selectedRestaurant && (
        <RestaurantDetailsDrawer
          onClose={() => setSelectedRestaurant(null)}
          restaurant={{
            ...selectedRestaurant,
            image: selectedRestaurant.photos?.[0] || "",
            comments: selectedRestaurant.reviews || [],
            latitude: selectedRestaurant.latitude,
            longitude: selectedRestaurant.longitude,
            placeId:
              selectedRestaurant.location?.placeId ??
              selectedRestaurant.placeId ??
              "",
            recommendedBy: selectedRestaurant?.recommendedBy ?? undefined,
            website: selectedRestaurant?.website ?? "",
            isPinnedByMe: selectedRestaurant?.isPinnedByMe ?? false,
            isWishlistedByMe: selectedRestaurant?.isWishlistedByMe ?? false,
          }}
        />
      )} */}
    </section>
  );
}
