"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash } from "lucide-react";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";
import { TextHelper } from "@/helpers";

export const categoryColumns = (
  onEdit: (data: BusinessCategory) => void,
  onDelete: (id: number) => void,
  isdeleting: boolean,
  currentItemDeleting: number | null
): ColumnDef<BusinessCategory>[] => [
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
    accessorKey: "slug",
    header: "Category Slug",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold">{r.slug}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Category Type",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold">
            {TextHelper.capitalizeWords(r.type.replace("_", " ").toLowerCase())}
          </div>
        </div>
      );
    },
  },

  {
    id: "dateCreated",
    accessorFn: (row) => row.createdAt,
    header: "Date Created",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="font-semibold">
            {TextHelper.getFormattedDate(row.getValue("dateCreated"))}
          </div>
        </div>
      );
    },
  },
  {
    id: "timeCreated",
    accessorFn: (row) => row.createdAt,
    header: "Time Created",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="font-semibold">
            {TextHelper.getFormattedTime(row.getValue("timeCreated"))}
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Edit size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(category.id)}
          >
            {isdeleting && currentItemDeleting === category.id ? (
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
