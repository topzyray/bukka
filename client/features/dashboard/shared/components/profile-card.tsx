import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  UserIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { TextHelper } from "@/helpers";
import { useEffect, useState } from "react";
import type { User } from "@/data/interfaces/User";
import { Coordinate, useUserLocation } from "@/providers";
import { Button, Card, Separator } from "@/components/ui";
import { UserRoleEnum } from "@/data/enums";

interface IUserProfileCard {
  user: User;
  setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UserProfileCard({ user, setEditProfile }: IUserProfileCard) {
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const {
    userCoordinates,
    loading: loadingUserLocation,
    error: userLocationError,
    refreshUserLocation,
  } = useUserLocation();

  useEffect(() => {
    if (loadingUserLocation) {
      toast.info("Fetching your location...");
      return;
    }

    if (userLocationError) {
      toast.error("Failed to fetch location", {
        description: userLocationError,
      });
      return;
    }

    if (userCoordinates) {
      setUserLocation(userCoordinates);
    } else {
      refreshUserLocation();
    }
  }, [
    loadingUserLocation,
    refreshUserLocation,
    userCoordinates,
    userLocationError,
  ]);

  return (
    <Card className="p-6 space-y-5 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <span className="truncate">{user?.email}</span>
          {user?.emailConfirmed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <span>{user?.phoneNumber || "N/A"}</span>
          {user?.phoneNumberConfirmed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
      </div>

      {user?.bio && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Bio</h4>
          <p className="text-sm text-muted-foreground">{user?.bio}</p>
        </div>
      )}

      <div>
        {loadingUserLocation && (
          <div className="flex items-center gap-2 hover:cursor-pointer hover:underline">
            <Loader2 size={16} className="animate-spin" />
            <span className="animate-pulse text-sm">Loading your location</span>
          </div>
        )}
        {!loadingUserLocation && userLocation !== null && (
          <div
            className="flex items-center gap-2 hover:cursor-pointer hover:underline"
            onClick={() => {
              window.location.href = userLocation
                ? `/dashboard/${user?.role?.toLowerCase()}/maps?q=${
                    userLocation?.lat
                  },${userLocation?.lng}`
                : "#";
            }}
          >
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">
              Lat: {userLocation?.lat} | Lng: {userLocation?.lng}
            </span>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-1">
          Onboarding Progress
        </h4>
        <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-3">
          <div
            className="bg-primary dark:bg-muted-foreground h-3 rounded-full transition-all"
            style={{
              width: `${
                (user?.onboardingProgress /
                  (user?.role === UserRoleEnum.ADMIN ? 2 : 3)) *
                  100 || 0
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {(user?.onboardingProgress /
            (user?.role === UserRoleEnum.ADMIN ? 2 : 3)) *
            100 || 0}
          % completed
        </p>
      </div>

      {/* Stats & Dates */}
      <div className="flex flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span>
            Last login: {TextHelper.getFormattedDate(user?.lastLoginAt)} at{" "}
            {TextHelper.getFormattedTime(user?.lastLoginAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
          <span>Joined: {TextHelper.getFormattedDate(user?.createdAt)}</span>
        </div>
      </div>
      <Separator className="border dark:border-sidebar-accent" />
      <div className="flex justify-end">
        <Button onClick={() => setEditProfile(true)}>Edit Profile</Button>
      </div>
    </Card>
  );
}
