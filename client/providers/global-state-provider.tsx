"use client";

import { createContext, useContext, useState } from "react";
import { useTheme } from "next-themes";
import { UserRoleEnum } from "@/data/enums";
import Cookies from "js-cookie";
import ServiceWorkderRegistrar from "./service-worker";

export type TCoordinates = {
  lng: number;
  lat: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

interface IGlobalContext {
  signupAs: UserRoleEnum | null;
  setSignUpAs: React.Dispatch<React.SetStateAction<UserRoleEnum | null>>;
  coordinates: TCoordinates | null;
  setCoordinates: React.Dispatch<React.SetStateAction<TCoordinates | null>>;
}

export const GlobalContext = createContext({} as IGlobalContext);

export const GlobalStateProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [signupAs, setSignUpAs] = useState<UserRoleEnum | null>(null);
  const [coordinates, setCoordinates] = useState<any | null>(null);

  const { theme } = useTheme();
  if (theme) {
    Cookies.set("theme", theme);
  }

  const value = {
    signupAs,
    setSignUpAs,
    coordinates,
    setCoordinates,
  };

  return (
    <GlobalContext.Provider value={value}>
      <ServiceWorkderRegistrar />
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx)
    throw new Error("useGlobalState must be used within GlobalStateProvider");
  return ctx;
};
