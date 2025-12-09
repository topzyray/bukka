"use client";

import React, { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/providers";
import { PaginationHelper } from "@/helpers/pagination-helper";

import { claimColumns } from "./components/claim-columns";
import { useBusinessClaimsQuery } from "@/data/queries/use-business-claims-query";

import {
  useApproveClaim,
  useRejectClaim,
  useDeleteClaim,
} from "@/data/mutations/claim/use-claim-mutation";

import { QueryKeyEnum, ClaimStatusEnum } from "@/data/enums";
import { BusinessClaim } from "@/data/interfaces/BusinessClaim";

export function BusinessClaimsList() {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const [currentItemDeleting, setCurrentItemDeleting] = useState<number | null>(
    null
  );
  const [currentItemApproving, setCurrentItemApproving] = useState<
    number | null
  >(null);
  const [currentItemRejecting, setCurrentItemRejecting] = useState<
    number | null
  >(null);

  // QUERIES
  const { data: claimsData, isLoading } = useBusinessClaimsQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = claimsData?.responseData?.total ?? 0;
  const currentPagedData = claimsData?.responseData?.data ?? [];

  // MUTATIONS
  const deleteClaimMutation = useDeleteClaim({
    onSuccess: () => setCurrentItemDeleting(null),
  });

  const approveClaimMutation = useApproveClaim({
    onSuccess: () => setCurrentItemApproving(null),
  });

  const rejectClaimMutation = useRejectClaim({
    onSuccess: () => setCurrentItemRejecting(null),
  });

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn,
      total,
      pageSize: PAGE_SIZE,
      queryClient,
      queryKey: [QueryKeyEnum.BUSINESS_CLAIMS],
      setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";

    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESS_CLAIMS] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESS_CLAIMS] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.BUSINESS_CLAIMS] });
    setPage(1);
  };

  // ACTION HANDLERS
  const handleDelete = useCallback(
    (id: number) => {
      setCurrentItemDeleting(id);
      deleteClaimMutation.mutate(id);
    },
    [deleteClaimMutation]
  );

  const handleApproval = useCallback(
    (id: number) => {
      setCurrentItemApproving(id);
      approveClaimMutation.mutate(id);
    },
    [approveClaimMutation]
  );

  const handleRejection = useCallback(
    (id: number) => {
      setCurrentItemRejecting(id);
      rejectClaimMutation.mutate(id);
    },
    [rejectClaimMutation]
  );

  const columns = React.useMemo(
    () =>
      claimColumns(
        user,
        handleDelete,
        handleApproval,
        handleRejection,
        deleteClaimMutation.isPending,
        currentItemDeleting,
        approveClaimMutation.isPending,
        currentItemApproving,
        rejectClaimMutation.isPending,
        currentItemRejecting,
        QueryKeyEnum.BUSINESS_CLAIMS
      ),
    [
      user,
      handleDelete,
      handleApproval,
      handleRejection,
      deleteClaimMutation.isPending,
      currentItemDeleting,
      approveClaimMutation.isPending,
      currentItemApproving,
      rejectClaimMutation.isPending,
      currentItemRejecting,
    ]
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Claims</h1>
          <p className="text-sm text-muted-foreground">
            Manage all claim requests
          </p>
        </div>
      </header>

      <DataTable
        columns={columns}
        data={currentPagedData}
        totalRecords={total}
        pageNumber={page}
        pageSize={PAGE_SIZE}
        onPageChange={goToPage}
        onSortChange={onSortChange}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All", value: undefined },
              {
                label: ClaimStatusEnum.PENDING,
                value: ClaimStatusEnum.PENDING,
              },
              {
                label: ClaimStatusEnum.APPROVED,
                value: ClaimStatusEnum.APPROVED,
              },
              {
                label: ClaimStatusEnum.REJECTED,
                value: ClaimStatusEnum.REJECTED,
              },
            ],
          },
        ]}
        isLoading={isLoading}
        selectable
        enableDateFilter
        idAccessor={(r) => (r as BusinessClaim).id}
      />
    </div>
  );
}
