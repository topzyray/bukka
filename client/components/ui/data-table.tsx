"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SearchBox } from "@/components/ui/search-box";

export type FilterOption = {
  key: string;
  label: string;
  options: { label: string; value: string | undefined }[];
};

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  totalRecords: number;
  pageNumber: number; // 1-based
  pageSize: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sorting: SortingState) => void;
  onSearchChange?: (term: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filters?: FilterOption[];
  isLoading?: boolean;
  selectable?: boolean;
  enableDateFilter?: boolean;
  emptyMessage?: string;
  // optional CSV exporter function, else internal CSV generator used
  onExportCSV?: (rows: TData[]) => void;
  idAccessor?: (row: TData) => string | number; // used for selection keys
}

export function DataTable<TData>({
  columns,
  data,
  totalRecords,
  pageNumber,
  pageSize,
  onPageChange,
  onSortChange,
  onSearchChange,
  onFilterChange,
  filters = [],
  isLoading = false,
  selectable = true,
  enableDateFilter = false,
  emptyMessage = "No records found.",
  onExportCSV,
  idAccessor,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [filterState, setFilterState] = React.useState<Record<string, string>>(
    {}
  );
  const [dateRange, setDateRange] = React.useState<{
    from: Date;
    to: Date;
  } | null>(null);

  const debounceRef = React.useRef<number | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      onSortChange?.(next);
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // selection helpers
  const rowKey = React.useCallback(
    (row: TData, idx: number) => String(idAccessor ? idAccessor(row) : idx),
    [idAccessor]
  );

  const toggleSelectAll = () => {
    if (Object.keys(selected).length === data.length) {
      setSelected({});
    } else {
      const all = Object.fromEntries(data.map((r, i) => [rowKey(r, i), true]));
      setSelected(all);
    }
  };

  const toggleRow = (r: TData, idx: number) => {
    const k = rowKey(r, idx);
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[k]) delete copy[k];
      else copy[k] = true;
      return copy;
    });
  };

  // search debounce
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSearchChange?.(value);
    }, 450);
  };

  // filter changes
  // const updateFilter = (key: string, value: string) => {
  //   const next = { ...filterState, [key]: value };
  //   setFilterState(next);
  //   onFilterChange?.(next);
  // };
  const updateFilter = (key: string, value: string) => {
    const next = { ...filterState, [key]: value ?? "" };
    setFilterState(next);
    onFilterChange?.(next);
  };

  // date range change
  const onDateRangeSelected = (range: any) => {
    if (!range) return;
    // range expected shape depends on shadcn's Calendar; we normalize
    if (range.from && range.to) {
      const normalized = { from: range.from as Date, to: range.to as Date };
      setDateRange(normalized);
      onFilterChange?.({
        ...filterState,
        dateFrom: normalized.from.toISOString(),
        dateTo: normalized.to.toISOString(),
      });
    } else if (range.from) {
      setDateRange({ from: range.from, to: range.from });
      onFilterChange?.({
        ...filterState,
        dateFrom: range.from.toISOString(),
        dateTo: range.from.toISOString(),
      });
    }
  };

  // CSV export (basic)
  const exportCsv = (rows: TData[]) => {
    if (onExportCSV) return onExportCSV(rows);

    if (!rows?.length) return;
    const cols = table
      .getAllLeafColumns()
      .map((c: any) =>
        typeof c.header === "string" ? c.header : String(c.id)
      );
    const header = cols.join(",");
    const escape = (v: any) => {
      if (v === null || v === undefined) return "";
      const out = String(v).replace(/"/g, '""');
      return `"${out}"`;
    };
    const body = rows
      .map((r) =>
        table
          .getAllLeafColumns()
          .map((c) => {
            // try to read accessor value
            try {
              const accessor = (c as any).accessorKey;
              const val = accessor ? (r as any)[accessor] : "";
              return escape(val);
            } catch {
              return escape("");
            }
          })
          .join(",")
      )
      .join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // bulk actions' selected rows data
  const selectedRowsData = React.useMemo(() => {
    const keys = new Set(Object.keys(selected));
    return data.filter((r, i) => keys.has(rowKey(r, i)));
  }, [selected, data, rowKey]);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="h-9">
            <SearchBox
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              onSearch={(q) => console.log("Searching: ", q)}
              delay={400}
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(selectedRowsData.length ? selectedRowsData : data)
            }
          >
            <FileText className="mr-2 h-4 w-4" /> Export CSV
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              handleSearch("");
              setFilterState({});
              setDateRange(null);
              onFilterChange?.({});
            }}
          >
            Reset
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <Select
              key={f.key}
              onValueChange={(v) => updateFilter(f.key, v)}
              value={filterState[f.key] || ""}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                {f.options
                  .filter((opt) => opt?.value) // remove empty string
                  .map((opt) => (
                    <SelectItem key={opt?.value} value={opt?.value ?? ""}>
                      {opt?.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ))}

          {enableDateFilter && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />{" "}
                  {dateRange
                    ? `${format(dateRange.from, "MMM d")} - ${format(
                        dateRange.to,
                        "MMM d"
                      )}`
                    : "Date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-2">
                <Calendar
                  mode="range"
                  selected={dateRange ?? undefined}
                  onSelect={onDateRangeSelected}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {selectable && (
                  <TableHead className="w-8">
                    <Checkbox
                      checked={
                        Object.keys(selected).length === data.length &&
                        data.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                )}
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort();
                  const isSorted = h.column.getIsSorted();
                  return (
                    <TableHead
                      key={h.id}
                      onClick={
                        canSort ? h.column.getToggleSortingHandler() : undefined
                      }
                      className={cn(
                        canSort ? "cursor-pointer select-none" : "",
                        "whitespace-nowrap"
                      )}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {canSort && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {isSorted === "asc"
                            ? "▲"
                            : isSorted === "desc"
                            ? "▼"
                            : ""}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    (table.getAllLeafColumns().length || 1) +
                    (selectable ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    (table.getAllLeafColumns().length || 1) +
                    (selectable ? 1 : 0)
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, ridx) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    selected[rowKey(row.original, ridx)] ? "bg-muted/20" : ""
                  )}
                >
                  {selectable && (
                    <TableCell className="w-8">
                      <Checkbox
                        checked={!!selected[rowKey(row.original, ridx)]}
                        onCheckedChange={() => toggleRow(row.original, ridx)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page {pageNumber} of {totalPages} — {totalRecords} records
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber >= totalPages || isLoading}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Small helpers from your UI kit */
// function TableHead({ className, children, ...props }: any) {
//   return (
//     <th
//       className={cn(
//         "px-3 py-2 text-left text-sm font-medium text-muted-foreground",
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </th>
//   );
// }
