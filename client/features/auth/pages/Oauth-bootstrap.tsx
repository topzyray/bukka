"use client";

import { motion } from "framer-motion";
import { Skeleton, ThemeToggle } from "@/components/ui";
import { QueryKeyEnum, UserRoleEnum } from "@/data/enums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserApiService } from "@/data/services";
import { useAuthStore } from "@/stores/auth-store";
import { RoleCard } from "../components/role-card";
import { User } from "@/data/interfaces/User";
import { RouteHelper } from "@/helpers";
import { StorageUtilsHelper } from "@/utils";
import { STORE_KEYS } from "@/configs";
import { toast } from "sonner";
import { queryClient } from "@/lib";
import { FullscreenLoaderOverlay } from "@/components/loaders/full-screen-loader-overlay";

export function OAuthBootstrapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const persistDeviceId = (sessions?: any[]) => {
    if (!sessions?.length) return;

    try {
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.DEVICE_ID,
        sessions[sessions.length - 1].deviceId,
      ]);
    } catch (e) {
      toast.error("Failed to persist device ID");
      console.error("Failed to persist device ID", e);
    }
  };

  useEffect(() => {
    UserApiService.getLoggedInUser()
      .then((userResponse: User) => {
        setUser(userResponse);

        if (userResponse?.role) {
          persistDeviceId(userResponse?.authSessions);

          queryClient.setQueryData([QueryKeyEnum.CURRENT_USER], userResponse);
          useAuthStore.getState().setUser(userResponse);

          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnum.CURRENT_USER],
          });

          setRedirecting(true);
          router.replace(RouteHelper.getPostAuthPath(userResponse));
        }
      })
      .catch(() => {
        router.replace("/signin");
        return null;
      })
      .finally(() => setLoading(false));
  }, [router]);

  const assignRole = async (role: UserRoleEnum) => {
    if (!user || saving) return;

    setSaving(true);

    try {
      const updated = await UserApiService.assignMyRole({ role });

      toast.success("Success", {
        description: `${updated?.role} role assigned successfully!`,
      });

      setUser(updated);
      useAuthStore.getState().setUser(updated);

      persistDeviceId(updated?.authSessions);

      // once redirect starts, do NOT revert saving
      setRedirecting(true);
      router.replace(RouteHelper.getPostAuthPath(updated));
    } catch (error) {
      toast.error("Failed to assign role. Please try again.");
      setSaving(false);
    }
  };
  useEffect(() => {
    if (!saving) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saving]);

  if (loading || redirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Skeleton className="w-64 h-6" />
        <Skeleton className="w-96 h-32" />
        {redirecting && (
          <p className="text-muted-foreground text-sm">Redirecting…</p>
        )}
      </div>
    );
  }

  if (!user?.role) {
    return (
      <>
        <FullscreenLoaderOverlay
          show={saving || redirecting}
          label="Setting up your account..."
        />

        <section className="max-w-5xl mx-auto px-6 flex w-full justify-center items-center h-screen">
          <header className="p-4 flex justify-between items-center">
            <section className="absolute top-2 right-0 bg-white dark:bg-muted-foreground rounded-full">
              <ThemeToggle />
            </section>
          </header>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-3"
            >
              Choose how you want to use the platform
            </motion.h1>

            <p className="text-center text-muted-foreground mb-10">
              You can always upgrade or add more capabilities later.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                role={UserRoleEnum.USER}
                icon="🧑‍💼"
                description="Order food and manage your account"
                action={() => assignRole(UserRoleEnum.USER)}
              />

              <RoleCard
                role={UserRoleEnum.VENDOR}
                icon="🏪"
                description="Sell food and manage your restaurant"
                action={() => assignRole(UserRoleEnum.VENDOR)}
              />

              <RoleCard
                role={UserRoleEnum.RIDER}
                icon="🛵"
                description="Deliver orders to customers"
                action={() => {}}
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Skeleton className="w-64 h-6" />
      <Skeleton className="w-96 h-32" />
    </div>
  );
}
