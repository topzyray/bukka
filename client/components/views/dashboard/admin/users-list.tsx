"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../../base/data-table";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
} from "../../../ui/page-wrapper";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { useAdminGetUsersQuery } from "@/server/queries/admin/use-users-query";
import { userColumnsAdmin } from "@/components/atoms/columns/user-admin-columns";
import { User } from "@/server/interfaces/User";
import { UserRoleEnum } from "@/server/enums";
import { useAuth } from "@/providers";

export default function UsersList() {
  const PAGE_SIZE = 10;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<User> | undefined>(
    undefined
  );
  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );

  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  // const deleteBusinessMutation = useDeleteBusiness({
  //   onSuccess: () => {
  //     setCurrentItemDeleting(null);
  //   },
  // });

  const { data: usersData, isLoading } = useAdminGetUsersQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: user?.role === UserRoleEnum.ADMIN,
  });

  const total = usersData?.responseData?.total ?? 0;
  const currentPagedData = React.useMemo(() => {
    return usersData?.responseData?.data ?? [];
  }, [usersData]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: ["admin:all-users"],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: ["admin:all-users"] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: ["admin:all-users"] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: ["admin:all-users"] });
    setPage(1);
  };

  const handleCreate = () => {
    setMode("create");
    setInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (row: User) => {
    setMode("edit");
    setInitialData(row);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async (id: number) => {
    setCurrentItemDeleting(id);
    // deleteBusinessMutation.mutate(id);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setMode("create");
      setInitialData(undefined);
    }
  };

  const columns = React.useMemo(
    () =>
      userColumnsAdmin(
        handleEdit,
        handleDelete
        // deleteBusinessMutation.isPending,
        // currentItemDeleting
      ),
    [handleDelete]
  );

  return (
    <PageWrapper>
      <PageWrapperContent>
        <PageWrapperContentWithFramer>
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Users Account</h1>
                <p className="text-sm text-muted-foreground">
                  Manage all users
                </p>
              </div>

              {/* <div className="flex items-center gap-2">
                <Button onClick={handleCreate}>Add Business</Button>
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
                    key: "role",
                    label: "Role",
                    options: [
                      { label: "All", value: undefined },
                      { label: "Admins", value: UserRoleEnum.ADMIN },
                      { label: "Vendors", value: UserRoleEnum.VENDOR },
                      { label: "Users", value: UserRoleEnum.USER },
                      { label: "Investors", value: UserRoleEnum.INVESTOR },
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
                isLoading={isLoading}
                selectable
                enableDateFilter
                idAccessor={(r) => (r as User).id}
              />
            </div>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
    </PageWrapper>
  );
}
