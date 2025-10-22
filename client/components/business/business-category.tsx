"use client";

import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BusinessCategory } from "@/server/interfaces/BusinessCategory";
import { DataTable } from "../views/base/data-table";
import { businessCategoryColumns } from "../atoms/columns/business-category-columns";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
} from "../ui/page-wrapper";
import { CreateUpdateBusinessCategoryModal } from "../forms/business/create-update-business-category-form";
import { useAuth } from "@/providers";
import { User } from "@/server/interfaces/User";
import { useInfiniteBusinessCategories } from "@/server/queries/use-businesses-category-query";

/**
 * This component:
 * - uses useCustomInfiniteQuery to fetch pages
 * - maintains a pageNumber state (1-based)
 * - when user asks to navigate to a page we don't have yet, we fetchNextPage until we have it
 * - uses the normal DataTable props (data is the current-page rows)
 */

export default function BusinessCategoryList() {
  const PAGE_SIZE = 10;
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteBusinessCategories({
    user: user as User,
    limit: PAGE_SIZE,
    searchQuery: search,
    type: filters.type,
  });

  // Helper: find page object (NormalizedPagedData) for a page number
  const findPage = useCallback(
    (pn: number) => {
      return infiniteData?.pages?.find((p) => p.pageNumber === pn);
    },
    [infiniteData?.pages]
  );

  // When user clicks to go to a page:
  const goToPage = async (pn: number) => {
    if (pn <= 0) return;
    // if page already loaded, simply set local state
    if (findPage(pn)) {
      setPage(pn);
      return;
    }
    // otherwise, fetch next pages until we reach it (note: this will sequentially call fetchNextPage)
    // guard to avoid infinite loop
    let safety = 0;
    while (!findPage(pn) && safety < 20) {
      await fetchNextPage();
      safety++;
      // if no more pages to fetch, break
      const last = infiniteData?.pages?.[infiniteData.pages.length - 1];
      if (last && last.pageNumber >= pn) break;
    }
    // finally set page (if found fallback to last available)
    setPage(
      findPage(pn)
        ? pn
        : infiniteData?.pages?.[infiniteData.pages.length - 1]?.pageNumber ?? 1
    );
  };

  // Flattened data for the page (or empty)
  const currentPageData = React.useMemo(() => {
    const pageObj = findPage(page) ?? infiniteData?.pages?.[0];
    return pageObj?.data ?? [];
  }, [findPage, infiniteData?.pages, page]);

  // total records (from first page meta if available)
  const total = infiniteData?.pages?.[0]?.totalRecords ?? 0;

  // sorting handler (emit to refetch with sort params)
  const onSortChange = (sorting: any) => {
    // react to sorting state change: call refetch with appropriate params if you want server-side sort
    // for example: extract first sorted column
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    // update filters or call refetch via queryClient if required
    // Here we set filters and refetch
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    // clear existing pages and refetch from page 1
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    // clear cache and refetch
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  // edit/delete callbacks
  const handleEdit = (row: BusinessCategory) => {
    // open modal with row (you wire BusinessFormModal)
    // ...
  };

  const handleDelete = async (id: number) => {
    // implement with your delete mutation hook
    // await deleteMutation.mutateAsync(id)
    // then refetch or invalidate queries
  };

  // build columns
  const columns = React.useMemo(
    () => businessCategoryColumns(handleEdit, handleDelete),
    []
  );

  return (
    <PageWrapper>
      <PageWrapperContent>
        <PageWrapperContentWithFramer>
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Business Categories</h1>
                <p className="text-sm text-muted-foreground">
                  Manage business categories
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CreateUpdateBusinessCategoryModal
                  mode="create"
                  onSuccess={() => {
                    queryClient.removeQueries({
                      queryKey: ["business-categories"],
                    });
                    setPage(1);
                  }}
                />
              </div>
            </header>

            <div>
              <DataTable
                columns={columns}
                data={currentPageData}
                totalRecords={total}
                pageNumber={page}
                pageSize={PAGE_SIZE}
                onPageChange={(pn) => goToPage(pn)}
                onSortChange={onSortChange}
                onSearchChange={onSearchChange}
                onFilterChange={onFilterChange}
                filters={[
                  {
                    key: "type",
                    label: "Type",
                    options: [
                      { label: "ALL", value: undefined },
                      { label: "RESTAURANT", value: "RESTAURANT" },
                      { label: "BAR", value: "BAR" },
                      { label: "LOUNGE", value: "LOUNGE" },
                      { label: "CATERING", value: "CATERING" },
                      { label: "BAKERY", value: "BAKERY" },
                      { label: "FOOD VENDOR", value: "FOOD_VENDOR" },
                      { label: "STREET EATRY", value: "STREET_EATRY" },
                      { label: "GROCERY", value: "GROCERY" },
                      {
                        label: "DELIVERY SERVICE",
                        value: "DELIVERY_SERVICE",
                      },
                      { label: "OTHER", value: "OTHER" },
                    ] /* fetch and populate dynamically */,
                  },
                ]}
                isLoading={isLoading || isFetchingNextPage}
                selectable
                enableDateFilter
                idAccessor={(r) => (r as BusinessCategory).id}
              />
            </div>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
    </PageWrapper>
  );
}
