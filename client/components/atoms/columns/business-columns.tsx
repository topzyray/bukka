"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Business } from "@/server/interfaces/Business";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash } from "lucide-react";

export const businessColumns = (
  onEdit: (data: Business) => void,
  onDelete: (id: number) => void
): ColumnDef<Business>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold">{r.name}</div>
          <div className="text-xs text-muted-foreground">
            {r.email || r.phoneNumber}
          </div>
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorFn: (row) => row.location?.city ?? row.location?.address ?? "-",
    id: "location",
    header: "Location",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => <span>{getValue() ? "Yes" : "No"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const business = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(business)}>
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(business.id)}
          >
            <Trash size={16} />
          </Button>
        </div>
      );
    },
  },
];
