"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BukkaButton } from "@/components/ui";

import { CheckCheck, CircleX, Loader2, Trash, View } from "lucide-react";

import { BusinessClaim } from "@/data/interfaces/BusinessClaim";
import { User } from "@/data/interfaces/User";

import { ClaimStatusEnum, UserRoleEnum } from "@/data/enums";
import { cn } from "@/lib/utils";
import { TextHelper } from "@/helpers";

export const claimColumns = (
  user: User | null,
  onDelete: (id: number) => void,
  onApprove: (id: number) => void,
  onReject: (id: number) => void,
  isDeleting: boolean,
  currentDeletingId: number | null,
  isApproving: boolean,
  currentApprovingId: number | null,
  isRejecting: boolean,
  currentRejectingId: number | null,
  parentPath: "business-claims"
): ColumnDef<BusinessClaim>[] => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const c = row.original;
      const colors = {
        PENDING: "text-amber-500 dark:text-amber-400",
        APPROVED: "text-green-600 dark:text-green-400",
        REJECTED: "text-red-600 dark:text-red-400",
      };

      return (
        <div className={cn(colors[c.status], "font-bold uppercase")}>
          {TextHelper.capitalize(c.status)}
        </div>
      );
    },
  },

  {
    accessorKey: "business.name",
    header: "Business",
    cell: ({ row }) => {
      const c = row.original;
      return <div className="font-semibold">{c.business?.name}</div>;
    },
  },

  {
    accessorKey: "claimer.email",
    header: "Claimer Email",
    cell: ({ row }) => row.original.claimer?.email ?? "-",
  },

  {
    accessorKey: "claimer.phoneNumber",
    header: "Claimer Phone",
    cell: ({ row }) => row.original.claimer?.phoneNumber ?? "-",
  },

  {
    accessorKey: "claimer.fullName",
    header: "Claimer",
    cell: ({ row }) => {
      const c = row.original;
      return (
        <span className="capitalize">
          {c.claimer?.firstName} {c.claimer?.lastName}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <div className="flex gap-2">
          <Link href={`${parentPath}/${claim.id}`}>
            <Button variant="outline" size="sm">
              <View size={16} />
            </Button>
          </Link>

          {user?.role === UserRoleEnum.ADMIN && (
            <>
              <BukkaButton
                variant="success"
                size="sm"
                disabled={
                  (isApproving && currentApprovingId === claim.id) ||
                  claim.status !== ClaimStatusEnum.PENDING
                }
                onClick={() => onApprove(claim.id)}
              >
                {isApproving && currentApprovingId === claim.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
              </BukkaButton>

              <BukkaButton
                variant="warning"
                size="sm"
                disabled={
                  (isRejecting && currentRejectingId === claim.id) ||
                  claim.status !== ClaimStatusEnum.PENDING
                }
                onClick={() => onReject(claim.id)}
              >
                {isRejecting && currentRejectingId === claim.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CircleX size={16} />
                )}
              </BukkaButton>
            </>
          )}

          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting && currentDeletingId === claim.id}
            onClick={() => onDelete(claim.id)}
          >
            {isDeleting && currentDeletingId === claim.id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash size={16} />
            )}
          </Button>
        </div>
      );
    },
  },
];
