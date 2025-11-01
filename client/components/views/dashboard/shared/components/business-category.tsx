"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BusinessCategory } from "@/server/interfaces/BusinessCategory";
import { DataTable } from "../../../base/data-table";
import { businessCategoryColumns } from "../../../../atoms/columns/business-category-columns";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
} from "../../../../ui/page-wrapper";
import { useCategoriesQuery } from "@/server/queries/use-businesses-category-query";
import { CreateUpdateCategoryModal } from "@/components/forms/business/create-update-category-modal";
import { Button } from "@/components/ui/button";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { useDeleteCategory } from "@/server/mutations/category/use-category-mutation";
import { BusinessTypeEnum } from "@/server/enums/BusinessTypeEnum";

export default function BusinessCategoryList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<
    Partial<BusinessCategory> | undefined
  >(undefined);
  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );

  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: () => {
      setCurrentItemDeleting(null);
    },
  });

  const { data: categoriesData, isLoading } = useCategoriesQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = categoriesData?.responseData?.total ?? 0;
  const currentPagedData = React.useMemo(() => {
    return categoriesData?.responseData?.data ?? [];
  }, [categoriesData]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: ["business-categories"],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: ["business-categories"] });
    setPage(1);
  };

  const handleCreate = () => {
    setMode("create");
    setInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (row: BusinessCategory) => {
    setMode("edit");
    setInitialData(row);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      setCurrentItemDeleting(id);
      deleteCategoryMutation.mutate(id);
    },
    [deleteCategoryMutation]
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
      businessCategoryColumns(
        handleEdit,
        handleDelete,
        deleteCategoryMutation.isPending,
        currentItemDeleting
      ),
    [currentItemDeleting, deleteCategoryMutation.isPending, handleDelete]
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
                <Button onClick={handleCreate}>Add Category</Button>
                <CreateUpdateCategoryModal
                  open={isModalOpen}
                  onOpenChange={handleOpenChange}
                  mode={mode}
                  initialData={mode === "edit" ? initialData : undefined}
                  onSuccess={() => {
                    queryClient.removeQueries({
                      queryKey: ["business-categories"],
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
                ]}
                isLoading={isLoading}
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
