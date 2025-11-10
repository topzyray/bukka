"use client";

import { useAuth } from "@/providers";
import { BukkaButton } from "@/components/ui";
import { UserRoleEnum } from "@/data/enums";
import { Support } from "@/data/interfaces/Support";
import { DataTable } from "@/components/ui/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { supportColumns } from "./components/support-columns";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { SupportStatusEnum } from "@/data/enums/SupportStatusEnum";
import { useSupportsQuery } from "@/data/queries/use-support-query";
import { CreateUpdateTicketModal } from "./modals/create-update-ticket-modal";
import { useDeleteTicket } from "@/data/mutations/support/use-support-ticket-mutation";

export function SupportTicketList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Support> | undefined>(
    undefined
  );
  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const deleteTicketMutation = useDeleteTicket({
    onSuccess: () => {
      setCurrentItemDeleting(null);
    },
  });

  const effectiveFilters = useMemo(() => {
    const baseFilters = { ...filters };
    if (user?.role !== UserRoleEnum.ADMIN) {
      baseFilters.email = user?.email;
    }
    return baseFilters;
  }, [filters, user]);

  const { data: supportData, isLoading } = useSupportsQuery({
    search,
    filters: effectiveFilters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    user: user ?? null,
  });

  const total = supportData?.responseData?.total ?? 0;
  const currentPagedData = useMemo(() => {
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
      deleteTicketMutation.mutate(id);
    },
    [deleteTicketMutation]
  );

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setMode("create");
      setInitialData(undefined);
    }
  };

  const columns = useMemo(
    () =>
      supportColumns(
        handleEdit,
        handleDelete,
        deleteTicketMutation.isPending,
        currentItemDeleting
      ),
    [currentItemDeleting, deleteTicketMutation.isPending, handleDelete]
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

        <div className="flex items-center gap-2">
          <BukkaButton variant="hero" onClick={handleCreate}>
            Create Ticket
          </BukkaButton>
          <CreateUpdateTicketModal
            open={isModalOpen}
            onOpenChange={handleOpenChange}
            mode={mode}
            user={user}
            initialData={mode === "edit" ? initialData : undefined}
            onSuccess={() => {
              queryClient.removeQueries({ queryKey: ["supports"] });
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
