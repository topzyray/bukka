"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { envConfig, HttpClient } from "@/configs";
import { EnvironmentTypeEnum } from "@/data/enums";

interface IReactQueryClientContext {
  isSignedIn: boolean;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReactQueryClientContext = createContext<
  IReactQueryClientContext | undefined
>(undefined);

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignedIn, setIsSignIn] = useState(false);

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 1000 * 60 * 5,
        },
      },
    });

    HttpClient.setQueryClient(client);

    return client;
  });

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (envConfig.NEXT_PUBLIC_NODE_ENV === EnvironmentTypeEnum.DEV) {
        if (event?.type === "updated") {
          console.log(
            "%c[React Query]",
            "color: #60A5FA; font-weight: bold;",
            "Query updated:",
            event.query.queryKey
          );
        }
      }
    });
    return unsubscribe;
  }, [queryClient]);

  const value = useMemo(
    () => ({
      isSignedIn,
      setIsSignIn,
    }),
    [isSignedIn]
  );

  return (
    <ReactQueryClientContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReactQueryClientContext.Provider>
  );
}

export const useReactQueryClient = () => {
  const ctx = useContext(ReactQueryClientContext);
  if (!ctx)
    throw new Error(
      "useReactQueryClient must be used within ReactQueryClientContext"
    );
  return ctx;
};
