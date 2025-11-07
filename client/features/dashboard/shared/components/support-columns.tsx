"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Support } from "@/data/interfaces/Support";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash, View } from "lucide-react";
import { cn } from "@/lib/utils";

export const supportColumns = (
  onEdit: (data: Support) => void,
  onDelete: (id: number) => void,
  isdeleting: boolean,
  currentItemDeleting: number | null
): ColumnDef<Support>[] => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const r = row.original;
      const statusColor = {
        light: {
          SUBMITTED: "text-blue-600",
          PENDING: "text-orange-600",
          RESOLVED: "text-green-600",
        },
        dark: {
          SUBMITTED: "text-blue-400",
          PENDING: "text-orange-400",
          RESOLVED: "text-green-400",
        },
      };
      return (
        <div
          className={cn(
            statusColor.light[r.status],
            `dark:${statusColor.dark[r.status]}`
          )}
        >
          {r.status}
        </div>
      );
    },
  },
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="text-ellipsis" title={r.subject}>
          {r.subject}
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="text-ellipsis" title={r.message}>
          {r.message}
        </div>
      );
    },
  },
  {
    accessorKey: "assignee.firstName",
    header: "Assigned To",
  },
  {
    accessorKey: "resolvedAt",
    header: "Resoved At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const business = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" title="View Details">
            <View size={16} />
          </Button>

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
