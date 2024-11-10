"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Session } from "@/lib/types";
import { SquarePlay } from "lucide-react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface DataTableProps<TData, TValue> {
  
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const handleDelete = async () => {
    const selectedRowIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as { id: string }).id);


    if (selectedRowIds.length === 0) return;

    try {
      const response = await fetch("/api/delete-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedRowIds }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to delete rows");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const handleAdd = async () => {
    router.push('/session/form/new');
  };

  const handleWatchSession = (row: TData) => {
    router.push(`/session/${(row as any).id}`);
  };

  return (
    <div>
      <div className="bg-white rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                <TableHead/>
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleWatchSession(row.original)}
                      >
                        <SquarePlay />
                      </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                    No sessions.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAdd()}
            >
              Create
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* test code */}
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )} */}
    </div>
  )
}
