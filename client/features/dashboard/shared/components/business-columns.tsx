"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Business } from "@/data/interfaces/Business";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash, View } from "lucide-react";

export const businessColumns = (
  onEdit: (data: Business) => void,
  onDelete: (id: number) => void,
  isdeleting: boolean,
  currentItemDeleting: number | null,
  parentPath: "businesses" | "my-businesses"
): ColumnDef<Business>[] => [
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
    accessorKey: "owner",
    header: "Owned By",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold capitalize">
            {r.ownerId ? (
              <>
                {" "}
                {r.owner?.firstName} {r.owner?.lastName}
              </>
            ) : (
              "Not yet claimed"
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "recomender",
    header: "Recommended By",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold capitalize">
            {r.recommenderId ? (
              <>
                {r.recommender?.firstName} {r.recommender?.lastName}
              </>
            ) : (
              "Not Applicable"
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const business = row.original;
      return (
        <div className="flex gap-2">
          <Link href={`${parentPath}/${business.id}`}>
            <Button variant="outline" size="sm" title="View Details">
              <View size={16} />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(business)}
            title="Edit"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(business.id)}
            title="Delete"
          >
            {isdeleting && currentItemDeleting === business.id ? (
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
