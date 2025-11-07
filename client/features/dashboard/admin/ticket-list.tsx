"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { useDeleteBusiness } from "@/data/mutations/business/use-business-mutation";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { useSupportsQuery } from "@/data/queries/use-support-query";
import { Support } from "@/data/interfaces/Support";
import { supportColumns } from "../shared/components/support-columns";
import { SupportStatusEnum } from "@/data/enums/SupportStatusEnum";

export function AdminSupportTicketList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Support> | undefined>(
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

  const { data: supportData, isLoading } = useSupportsQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = supportData?.responseData?.total ?? 0;
  const currentPagedData = React.useMemo(() => {
    return supportData?.responseData?.data ?? [];
  }, [supportData]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: ["businesses"],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: ["businesses"] });
    setPage(1);
  };

  const handleCreate = () => {
    setMode("create");
    setInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (row: Support) => {
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
      supportColumns(
        handleEdit,
        handleDelete,
        deleteBusinessMutation.isPending,
        currentItemDeleting
      ),
    [currentItemDeleting, deleteBusinessMutation.isPending, handleDelete]
  );

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Manage all support tickets
          </p>
        </div>

        {/* <div className="flex items-center gap-2">
                <Button onClick={handleCreate}>Add Support</Button>
                <CreateUpdateBusinessModal
                  open={isModalOpen}
                  onOpenChange={handleOpenChange}
                  mode={mode}
                  initialData={mode === "edit" ? initialData : undefined}
                  onSuccess={() => {
                    queryClient.removeQueries({ queryKey: ["businesses"] });
                    setPage(1);
                    setIsModalOpen(false);
                  }}
                />
              </div> */}
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
              key: "status",
              label: "Status",
              options: [
                {
                  label: "ALL",
                  value: undefined,
                },
                {
                  label: SupportStatusEnum.SUBMITTED,
                  value: SupportStatusEnum.SUBMITTED,
                },
                {
                  label: SupportStatusEnum.PENDING,
                  value: SupportStatusEnum.PENDING,
                },
                {
                  label: SupportStatusEnum.RESOLVED,
                  value: SupportStatusEnum.RESOLVED,
                },
              ],
            },
          ]}
          isLoading={isLoading}
          selectable
          enableDateFilter
          idAccessor={(r) => (r as Support).id}
        />
      </div>
    </section>
  );
}
