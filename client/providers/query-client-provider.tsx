"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { envConfig } from "@/configs";
import { EnvironmentTypeEnum } from "@/data/enums";
import { queryClient } from "@/lib";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
