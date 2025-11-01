/**
 * Provides reusable pagination helpers for both infinite scroll and numbered pagination.
 *
 * Includes:
 *  - goToPageSequential → Sequential infinite fetching (useInfiniteQuery)
 *  - goToPageDirect → Direct page fetching with cache injection
 *  - refreshPage → Re-fetch and update a specific cached page
 */

import { InfiniteData, QueryClient } from "@tanstack/react-query";

export interface IPaginatedPage<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export class PaginationHelper {
  /**
   * Sequentially loads pages using fetchNextPage() until the desired page is loaded.
   *
   * Use for: Infinite scroll, "Load More" buttons, feeds, or lists.
   * await PaginationHelper.goToPageSequential(
   *   targetPage,
   *   queryClient,
   *   ["businesses"],
   *   fetchNextPage,
   *   findPage, // (pageNumber) => currentData?.pages.find(p => p.pageNumber === pageNumber)
   *   setPage
   * );
   */
  static async goToPageSequential<T>(
    pn: number,
    queryClient: QueryClient,
    dynamicQueryKey: unknown[],
    fetchNextPage: () => Promise<unknown>,
    findPage: (pageNumber: number) => IPaginatedPage<T> | undefined,
    setPage: (page: number) => void
  ): Promise<void> {
    if (pn <= 0) return;

    if (findPage(pn)) {
      setPage(pn);
      return;
    }

    try {
      let safety = 0;
      const getCached = () =>
        queryClient.getQueryData<InfiniteData<IPaginatedPage<T>>>(
          dynamicQueryKey
        );

      let cached = getCached();
      let lastLoaded =
        cached?.pages?.[cached.pages.length - 1]?.pageNumber ?? 0;

      if (lastLoaded === 0) {
        await fetchNextPage();
        cached = getCached();
        lastLoaded = cached?.pages?.[cached.pages.length - 1]?.pageNumber ?? 0;
      }

      while (lastLoaded < pn && safety < 50) {
        await fetchNextPage();
        cached = getCached();
        lastLoaded =
          cached?.pages?.[cached.pages.length - 1]?.pageNumber ?? lastLoaded;

        if (cached?.pages?.some((p) => p.pageNumber === pn)) {
          setPage(pn);
          return;
        }

        safety++;
        const lastPage = cached?.pages?.[cached.pages.length - 1];
        if (!lastPage || lastPage.pageNumber >= lastPage.totalPages) break;
      }

      if (safety >= 50) {
        console.warn(
          "[goToPageSequential] Safety limit reached (50 iterations)."
        );
      }

      const final = getCached();
      setPage(
        final?.pages?.[final.pages.length - 1]?.pageNumber ??
          final?.pages?.[0]?.pageNumber ??
          1
      );
    } catch (err) {
      console.error("[goToPageSequential] Failed to fetch next pages:", err);
    }
  }

  static async goToPage({
    pn,
    total,
    pageSize,
    queryClient,
    queryKey,
    setPage,
  }: {
    pn: number;
    total: number;
    pageSize: number;
    queryClient: QueryClient;
    queryKey: string[];
    setPage: (page: number) => void;
  }): Promise<void> {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (pn < 1 || pn > totalPages) return;
    setPage(pn);
    // remove and refetch (server-side pagination)
    queryClient.removeQueries({ queryKey: queryKey });
  }

  /**
   * Refreshes a specific cached page by re-fetching from backend and replacing its data.
   *
   * Use for: Live updates, admin edits, after delete actions, etc.
   * await PaginationHelper.refreshPage(
   *  currentPage,
   *  queryClient,
   *  ["businesses"],
   *  BusinessCategoryApiService.getAll,
   *  { category: selectedCategory }
   * );
   */
  static async refreshPage<T>(
    pn: number,
    queryClient: QueryClient,
    dynamicQueryKey: unknown[],
    apiFetcher: (params: Record<string, any>) => Promise<any>,
    baseParams: Record<string, any> = {}
  ): Promise<void> {
    if (pn <= 0) return;

    try {
      const response = await apiFetcher({ ...baseParams, pageNumber: pn });
      const rd = response.responseData ?? response.data ?? response;

      const refreshedPage: IPaginatedPage<T> = {
        data: rd.data ?? [],
        pageNumber: rd.page ?? pn,
        pageSize: rd.pageSize ?? baseParams.pageSize ?? 10,
        totalRecords: rd.total ?? rd.totalRecords ?? 0,
        totalPages: rd.pageCount ?? rd.totalPages ?? 1,
      };

      queryClient.setQueryData<InfiniteData<IPaginatedPage<T>, any>>(
        dynamicQueryKey,
        (old) => {
          if (!old) {
            // No cache? Just store the refreshed page
            return {
              pages: [refreshedPage],
              pageParams: [pn],
            } as InfiniteData<IPaginatedPage<T>>;
          }

          const pages = old.pages.map((p) =>
            p.pageNumber === pn ? refreshedPage : p
          );

          return {
            ...old,
            pages,
          };
        }
      );

      console.info(`🔄 [refreshPage] Page ${pn} successfully refreshed.`);
    } catch (err) {
      console.error("⚠️ [refreshPage] Failed to refresh page:", err);
    }
  }
}
