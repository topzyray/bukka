"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCheck, CircleX, Edit, Loader2, Trash, View } from "lucide-react";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { User } from "@/data/interfaces/User";
import { UserRoleEnum } from "@/data/enums";

export const myRecommendationColumns = (
  onDelete: (id: number) => void,
  isdeleting: boolean,
  currentItemDeleting: number | null
): ColumnDef<Recommendation>[] => [
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
          <Link href={`recommendations/${recommendation.id}`}>
            <Button variant="outline" size="sm" title="View Details">
              <View size={16} />
            </Button>
          </Link>

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
