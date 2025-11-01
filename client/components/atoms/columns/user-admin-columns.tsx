"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/server/interfaces/User";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash } from "lucide-react";

export const userColumnsAdmin = (
  onEdit: (data: User) => void,
  onDelete: (id: number) => void,
  isdeleting?: boolean,
  currentItemDeleting?: number | null
): ColumnDef<User>[] => [
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold">{r.role}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
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
