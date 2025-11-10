"use client";

import { cn } from "@/lib/utils";
import { TextHelper } from "@/helpers";
import { Loader2, Trash, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Support } from "@/data/interfaces/Support";
import { SupportTicketDetailsModal } from "../modals/support-ticket-details-modal";
import { useAuth } from "@/providers";
import { UserRoleEnum } from "@/data/enums";

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
    accessorKey: "ticketId",
    header: "Ticket ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const r = row.original;
      return <div>{r.name}</div>;
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
        <div className="max-w-[10rem] truncate" title={r.message}>
          {r.message}
        </div>
      );
    },
  },
  {
    accessorKey: "assignee.firstName",
    header: "Assigned To",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div
          className="max-w-[10rem] truncate"
          title={
            r.assignee
              ? `${r.assignee?.firstName} ${r.assignee?.lastName}`
              : "Not assinged"
          }
        >
          {r.assignee
            ? `${r.assignee?.firstName} ${r.assignee?.lastName}`
            : "Not assinged"}
        </div>
      );
    },
  },
  {
    accessorKey: "resolvedAt",
    header: "Resoved At",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div
          className="max-w-[10rem] truncate"
          title={
            r.resolvedAt
              ? TextHelper.getFormattedDate(r.resolvedAt)
              : "Not resolved"
          }
        >
          {r.resolvedAt ? (
            <span>
              {TextHelper.getFormattedDate(r.resolvedAt)} <br />
              {TextHelper.getFormattedTime(r.resolvedAt)}
            </span>
          ) : (
            "Not resolved"
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const support = row.original;
      return (
        <ActionCell
          isdeleting={isdeleting}
          currentItemDeleting={currentItemDeleting}
          support={support}
          onDelete={onDelete}
        />
      );
    },
  },
];

function ActionCell({
  support,
  isdeleting,
  onDelete,
  currentItemDeleting,
}: {
  support: Support;
  isdeleting: boolean;
  currentItemDeleting: number | null;
  onDelete: (id: number) => void;
}) {
  const { user } = useAuth();
  return (
    <div className="flex gap-2">
      <SupportTicketDetailsModal
        ticketId={support?.ticketId}
        trigger={
          <Button variant="outline" size="sm" title="View Details">
            <View size={16} />
          </Button>
        }
      />

      {/* <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(support)}
            title="Edit"
          >
            <Edit size={16} />
          </Button> */}
      {user?.role === UserRoleEnum.ADMIN && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(support?.id)}
          title="Delete"
        >
          {isdeleting && currentItemDeleting === support.id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash size={16} />
          )}
        </Button>
      )}

      {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <BukkaButton
                variant="ghost"
                className="h-8 w-8 p-0"
                title="More Actions"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </BukkaButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(support.ticketId)}
                className="cursor-copy"
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                Assign to Staff
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Mark as Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
    </div>
  );
}
