"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { envConfig, HttpClient } from "@/configs";
import { EnvironmentTypeEnum } from "@/server/enums";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false,
  //       staleTime: 1000 * 60 * 5,
  //       retry: 1,
  //     },
  //   },
  // });
  const [queryClient] = React.useState(() => {
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

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
