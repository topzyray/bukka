"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Business } from "@/data/interfaces/Business";
import { CreateUpdateBusinessModal } from "./modals/create-update-business-modal";
import { DataTable } from "@/components/ui/data-table";
import { businessColumns } from "../shared/components/business-columns";
import { useBusinessesQuery } from "@/data/queries/use-businesses-query";
import { Button } from "@/components/ui/button";
import { useDeleteBusiness } from "@/data/mutations/business/use-business-mutation";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { BusinessTypeEnum } from "@/data/enums/BusinessTypeEnum";
import { QueryKeyEnum } from "@/data/enums";

export function BusinessList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Business> | undefined>(
    undefined
  );
  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );

  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  const deleteBusinessMutation = useDeleteBusiness({
    onSuccess: () => {
      setCurrentItemDeleting(null);
    },
  });

  const { data: businessesData, isLoading } = useBusinessesQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = businessesData?.responseData?.total ?? 0;
  const currentPagedData = React.useMemo(() => {
    return businessesData?.responseData?.data ?? [];
  }, [businessesData]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: [QueryKeyEnum.BUSINESSES],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESSES] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESSES] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESSES] });
    setPage(1);
  };

  const handleCreate = () => {
    setMode("create");
    setInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (row: Business) => {
    setMode("edit");
    setInitialData(row);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      setCurrentItemDeleting(id);
      deleteBusinessMutation.mutate(id);
    },
    [deleteBusinessMutation]
  );

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setMode("create");
      setInitialData(undefined);
    }
  };

  const columns = React.useMemo(
    () =>
      businessColumns(
        handleEdit,
        handleDelete,
        deleteBusinessMutation.isPending,
        currentItemDeleting,
        QueryKeyEnum.BUSINESSES
      ),
    [currentItemDeleting, deleteBusinessMutation.isPending, handleDelete]
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Businesses</h1>
          <p className="text-sm text-muted-foreground">
            Manage vendor businesses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleCreate}>Add Business</Button>
          <CreateUpdateBusinessModal
            open={isModalOpen}
            onOpenChange={handleOpenChange}
            mode={mode}
            initialData={mode === "edit" ? initialData : undefined}
            onSuccess={() => {
              queryClient.removeQueries({
                queryKey: [QueryKeyEnum.BUSINESSES],
              });
              setPage(1);
              setIsModalOpen(false);
            }}
          />
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
              key: "isVerified",
              label: "Verified",
              options: [
                { label: "All", value: undefined },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ],
            },
          ]}
          isLoading={isLoading}
          selectable
          enableDateFilter
          idAccessor={(r) => (r as Business).id}
        />
      </div>
    </div>
  );
}
