"use client";

import { STORE_KEYS } from "@/configs";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface CachedLocation {
  coords: Coordinate;
  timestamp: number;
}

interface IUserLocationContext {
  userCoordinates: Coordinate | null;
  setUserCoordinates: React.Dispatch<React.SetStateAction<Coordinate | null>>;
  loading: boolean;
  error: string | null;
  refreshUserLocation: () => void;
}

const UserLocationContext = createContext<IUserLocationContext>(
  {} as IUserLocationContext
);

interface IUserLocationProvider {
  children: React.ReactNode;
  cacheDurationMs?: number;
}

export const UserLocationProvider = ({
  children,
  cacheDurationMs = 60 * 60 * 1000, // 1 hour default
}: IUserLocationProvider) => {
  const [userCoordinates, setUserCoordinates] = useState<Coordinate | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(
    (forceRefresh = false) => {
      setLoading(true);
      setError(null);

      if (!forceRefresh) {
        const cached = localStorage.getItem(STORE_KEYS.USER_LAST_LOCATION);
        if (cached) {
          try {
            const parsed: CachedLocation = JSON.parse(cached);
            const isExpired = Date.now() - parsed.timestamp > cacheDurationMs;

            if (!isExpired && parsed.coords?.lat && parsed.coords?.lng) {
              setUserCoordinates(parsed.coords);
              setLoading(false);
              return;
            } else {
              localStorage.removeItem(STORE_KEYS.USER_LAST_LOCATION);
            }
          } catch {}
        }
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const data: CachedLocation = {
              coords: newCoords,
              timestamp: Date.now(),
            };
            localStorage.setItem(
              STORE_KEYS.USER_LAST_LOCATION,
              JSON.stringify(data)
            );

            setUserCoordinates(newCoords);
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
      }
    },
    [cacheDurationMs]
  );

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const refreshUserLocation = () => fetchLocation(true);

  const value = {
    userCoordinates,
    setUserCoordinates,
    loading,
    error,
    refreshUserLocation,
  };
  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const ctx = useContext(UserLocationContext);
  if (!ctx)
    throw new Error("useUserLocation must be used within UseLocationProvider");
  return ctx;
};

// "use client";

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { STORE_KEYS } from "@/configs";
// import { StorageUtilsHelper } from "@/utils";
// import { LocationPermissionEnum } from "@/enums/LocationPermissionEnum";

// export interface Coordinate {
//   lat: number;
//   lng: number;
// }

// interface CachedLocation {
//   coords: Coordinate;
//   timestamp: number;
// }

// interface IUserLocationContext {
//   userCoordinates: Coordinate | null;
//   setUserCoordinates: React.Dispatch<React.SetStateAction<Coordinate | null>>;
//   loading: boolean;
//   error: string | null;
//   refreshUserLocation: () => void;
//   manualSetLocation: (coords: Coordinate) => void;
// }

// const UserLocationContext = createContext<IUserLocationContext | undefined>(
//   undefined
// );

// interface IUserLocationProvider {
//   children: React.ReactNode;
//   cacheDurationMs?: number;
// }

// export const UserLocationProvider = ({
//   children,
//   cacheDurationMs = 60 * 60 * 1000, // 1 hour default
// }: IUserLocationProvider) => {
//   const [userCoordinates, setUserCoordinates] = useState<Coordinate | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const persistLocation = useCallback((coords: Coordinate) => {
//     try {
//       const data: CachedLocation = { coords, timestamp: Date.now() };
//       if (typeof window !== "undefined") {
//         StorageUtilsHelper.saveToLocalStorage([
//           STORE_KEYS.USER_LAST_LOCATION,
//           data,
//         ]);
//       }
//     } catch (e) {
//       console.warn("Persist Location failed", e);
//     }
//   }, []);

//   const manualSetLocation = useCallback(
//     (coords: Coordinate) => {
//       setUserCoordinates(coords);
//       persistLocation(coords);
//     },
//     [persistLocation]
//   );

//   const fetchLocation = useCallback(
//     (forceRefresh = false) => {
//       if (typeof window === "undefined") return;
//       setLoading(true);
//       setError(null);

//       if (!forceRefresh) {
//         const cachedUserLocation = StorageUtilsHelper.getItemFromLocalStorage(
//           STORE_KEYS.USER_LAST_LOCATION
//         ) as CachedLocation;
//         if (cachedUserLocation) {
//           try {
//             const isExpired =
//               Date.now() - cachedUserLocation.timestamp > cacheDurationMs;

//             if (
//               !isExpired &&
//               cachedUserLocation.coords?.lat &&
//               cachedUserLocation.coords?.lng
//             ) {
//               setUserCoordinates(cachedUserLocation.coords);
//               setLoading(false);
//               return;
//             } else {
//               localStorage.removeItem(STORE_KEYS.USER_LAST_LOCATION);
//             }
//           } catch (e) {
//             console.warn("Failed to read cached location", e);
//           }
//         }
//       }

//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const newCoords = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             };

//             persistLocation(newCoords);

//             setUserCoordinates(newCoords);
//             setLoading(false);
//           },
//           (err) => {
//             setError(err.message ?? "Failed to retrieve location.");
//             setLoading(false);
//           },
//           { enableHighAccuracy: true }
//         );
//       } else {
//         setError("Geolocation is not supported by your browser.");
//         setLoading(false);
//       }
//     },
//     [cacheDurationMs, persistLocation]
//   );

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     try {
//       const permission = StorageUtilsHelper.getItemFromLocalStorage(
//         STORE_KEYS.USER_LOCATION_PERMISSION
//       );
//       if (permission === LocationPermissionEnum.GRANTED) {
//         fetchLocation();
//       } else {
//         setLoading(false);
//       }
//     } catch (e) {
//       console.warn("UserLocationProvider init error", e);
//       setLoading(false);
//     }
//   }, [fetchLocation]);

//   const refreshUserLocation = () => fetchLocation(true);

//   const value = {
//     userCoordinates,
//     setUserCoordinates,
//     loading,
//     error,
//     refreshUserLocation,
//     manualSetLocation,
//   };
//   return (
//     <UserLocationContext.Provider value={value}>
//       {children}
//     </UserLocationContext.Provider>
//   );
// };

// export const useUserLocation = () => {
//   const ctx = useContext(UserLocationContext);
//   if (!ctx)
//     throw new Error("useUserLocation must be used within UseLocationProvider");
//   return ctx;
// };
