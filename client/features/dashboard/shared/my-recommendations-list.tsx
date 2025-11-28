"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { BusinessTypeEnum } from "@/data/enums/BusinessTypeEnum";
import { QueryKeyEnum, RecommendationStatusEnum } from "@/data/enums";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { useDeleteRecommendation } from "@/data/mutations/recommendation/use-recommendation-mutation";
import { useAuth } from "@/providers";
import { useMyRecommendationsQuery } from "@/data/queries";
import { myRecommendationColumns } from "./components/my-recommendation-columns";

export function MyRecommendationsList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );

  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  const deleteRecommendationMutation = useDeleteRecommendation({
    onSuccess: () => {
      setCurrentItemDeleting(null);
    },
  });

  const { data: recommendationData, isLoading } = useMyRecommendationsQuery({
    userId: user?.id as number,
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = recommendationData?.responseData?.total ?? 0;
  const currentPagedData = React.useMemo(() => {
    return recommendationData?.responseData?.data ?? [];
  }, [recommendationData]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: [QueryKeyEnum.MY_RECOMMENDATIONS],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.MY_RECOMMENDATIONS] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.MY_RECOMMENDATIONS] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.MY_RECOMMENDATIONS] });
    setPage(1);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      setCurrentItemDeleting(id);
      deleteRecommendationMutation.mutate(id);
    },
    [deleteRecommendationMutation]
  );

  const columns = React.useMemo(
    () =>
      myRecommendationColumns(
        handleDelete,
        deleteRecommendationMutation.isPending,
        currentItemDeleting
      ),
    [currentItemDeleting, deleteRecommendationMutation.isPending, handleDelete]
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Recommendations</h1>
          <p className="text-sm text-muted-foreground">
            Manage All My Recommendations
          </p>
        </div>
      </header>

      <div>
        <DataTable
          columns={columns}
          data={currentPagedData}
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
                {
                  label: "ALL",
                  value: undefined,
                },
                {
                  label: BusinessTypeEnum.RESTAURANT,
                  value: BusinessTypeEnum.RESTAURANT,
                },
                {
                  label: BusinessTypeEnum.BAR,
                  value: BusinessTypeEnum.BAR,
                },
                {
                  label: BusinessTypeEnum.LOUNGE,
                  value: BusinessTypeEnum.LOUNGE,
                },
                {
                  label: BusinessTypeEnum.CATERING,
                  value: BusinessTypeEnum.CATERING,
                },
                {
                  label: BusinessTypeEnum.BAKERY,
                  value: BusinessTypeEnum.BAKERY,
                },
                {
                  label: "FOOD VENDOR",
                  value: BusinessTypeEnum.FOOD_VENDOR,
                },
                {
                  label: "FAST FOOD",
                  value: BusinessTypeEnum.FAST_FOOD,
                },
                {
                  label: "STREET EATRY",
                  value: BusinessTypeEnum.STREET_EATRY,
                },
                {
                  label: BusinessTypeEnum.GROCERY,
                  value: BusinessTypeEnum.GROCERY,
                },
                {
                  label: "DELIVERY SERVICE",
                  value: BusinessTypeEnum.DELIVERY_SERVICE,
                },
                {
                  label: BusinessTypeEnum.OTHER,
                  value: BusinessTypeEnum.OTHER,
                },
              ],
            },
            {
              key: "status",
              label: "Status",
              options: [
                { label: "All", value: undefined },
                {
                  label: RecommendationStatusEnum.PENDING,
                  value: RecommendationStatusEnum.PENDING,
                },
                {
                  label: RecommendationStatusEnum.APPROVED,
                  value: RecommendationStatusEnum.APPROVED,
                },
                {
                  label: RecommendationStatusEnum.REJECTED,
                  value: RecommendationStatusEnum.REJECTED,
                },
              ],
            },
          ]}
          isLoading={isLoading}
          selectable
          enableDateFilter
          idAccessor={(r) => (r as Recommendation).id}
        />
      </div>
    </div>
  );
}
