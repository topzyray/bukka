"use client";

import React from "react";
import { useCustomInfiniteQuery } from "@/server/queries/base";
import { BusinessApiService } from "@/server/services/BusinessApiService";
import { useQueryClient } from "@tanstack/react-query";
import { Business } from "@/server/interfaces/Business";
import { CreateUpdateBusinessModal } from "../forms/business/create-update-business-modal";
import { DataTable } from "../views/base/data-table";
import { businessColumns } from "../atoms/columns/business-columns";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
} from "../ui/page-wrapper";

/**
 * This component:
 * - uses useCustomInfiniteQuery to fetch pages
 * - maintains a pageNumber state (1-based)
 * - when user asks to navigate to a page we don't have yet, we fetchNextPage until we have it
 * - uses the normal DataTable props (data is the current-page rows)
 */

export default function BusinessList() {
  const PAGE_SIZE = 10;
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  const {
    data: infiniteData,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useCustomInfiniteQuery<Business>(
    ["businesses", search, filters],
    ({ pageNumber, ...rest }) =>
      BusinessApiService.getBusinesses({
        page: pageNumber,
        limit: PAGE_SIZE,
        search: search,
        ...filters,
      }),
    {
      params: { searchParams: search, limit: PAGE_SIZE },
      initialPageParam: 1,
      enabled: true,
    }
  );

  // Helper: find page object (NormalizedPagedData) for a page number
  const findPage = (pn: number) => {
    return infiniteData?.pages?.find((p) => p.pageNumber === pn);
  };

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
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    // clear cache and refetch
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  // edit/delete callbacks
  const handleEdit = (row: Business) => {
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
    () => businessColumns(handleEdit, handleDelete),
    []
  );

  return (
    <PageWrapper>
      <PageWrapperContent>
        <PageWrapperContentWithFramer>
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Businesses</h1>
                <p className="text-sm text-muted-foreground">
                  Manage vendor businesses
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CreateUpdateBusinessModal
                  mode="create"
                  onSuccess={() => {
                    queryClient.removeQueries({ queryKey: ["businesses"] });
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
                    key: "categoryId",
                    label: "Category",
                    options: [
                      { label: "All", value: undefined },
                    ] /* fetch and populate dynamically */,
                  },
                  {
                    key: "isVerified",
                    label: "Verified",
                    options: [
                      { label: "All", value: undefined },
                      { label: "Yes", value: "true" },
                      { label: "No", value: "false" },
                    ],
                  },
                ]}
                isLoading={isLoading || isFetchingNextPage}
                selectable
                enableDateFilter
                idAccessor={(r) => (r as Business).id}
              />
            </div>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
    </PageWrapper>
  );
}
