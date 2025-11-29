"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCheck, CircleX, Edit, Loader2, Trash, View } from "lucide-react";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { User } from "@/data/interfaces/User";
import { RecommendationStatusEnum, UserRoleEnum } from "@/data/enums";
import { BukkaButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { TextHelper } from "@/helpers";

export const recommendationColumns = (
  user: User | null,
  onDelete: (id: number) => void,
  onApprove: (id: number) => void,
  onReject: (id: number) => void,
  isdeleting: boolean,
  currentItemDeleting: number | null,
  isApproving: boolean,
  currentItemApproving: number | null,
  isRejecting: boolean,
  currentItemRejecting: number | null,
  parentPath: "recommendations"
): ColumnDef<Recommendation>[] => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const r = row.original;
      const statusColor = {
        light: {
          PENDING: "text-amber-500",
          APPROVED: "text-green-600",
          REJECTED: "text-red-600",
        },
        dark: {
          PENDING: "text-amber-400",
          APPROVED: "text-green-400",
          REJECTED: "text-red-400",
        },
      };
      return (
        <div
          className={cn(
            statusColor.light[r?.status],
            `dark:${statusColor.dark[r?.status]}`,
            "font-bold uppercase"
          )}
        >
          {TextHelper.capitalize(r?.status)}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold">{r.name}</div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.category?.name ?? "-",
    id: "category",
    header: "Category",
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "location.address",
    header: "Address",
  },
  {
    accessorFn: (row) => row.location?.city ?? row.location?.address ?? "-",
    id: "location.city",
    header: "Location",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => <span>{getValue() ? "Yes" : "No"}</span>,
  },
  {
    accessorKey: "recommender",
    header: "Recommended By",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold capitalize">
            {r.recommender?.firstName} {r.recommender?.lastName}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const recommendation = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`${parentPath}/${recommendation.id}`}>
            <Button variant="outline" size="sm" title="View Details">
              <View size={16} />
            </Button>
          </Link>
          {user && user?.role === UserRoleEnum.ADMIN && (
            <>
              <BukkaButton
                variant="success"
                size="sm"
                onClick={() => onApprove(recommendation.id)}
                disabled={
                  (isApproving && currentItemApproving === recommendation.id) ||
                  recommendation.status === RecommendationStatusEnum.APPROVED ||
                  recommendation.status === RecommendationStatusEnum.REJECTED
                }
                title="Approve"
              >
                {isApproving && currentItemApproving === recommendation.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
              </BukkaButton>
              <BukkaButton
                variant="warning"
                size="sm"
                onClick={() => onReject(recommendation.id)}
                disabled={
                  (isRejecting && currentItemRejecting === recommendation.id) ||
                  recommendation.status === RecommendationStatusEnum.APPROVED ||
                  recommendation.status === RecommendationStatusEnum.REJECTED
                }
                title="Reject"
              >
                {isRejecting && currentItemRejecting === recommendation.id ? (
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
            onClick={() => onDelete(recommendation.id)}
            title="Delete"
          >
            {isdeleting && currentItemDeleting === recommendation.id ? (
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
