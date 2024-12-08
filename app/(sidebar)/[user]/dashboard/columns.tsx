"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { formatTime, formatDate } from '@/lib/utils'

// You can use a Zod schema instead of Session here if you want.

export const columns: ColumnDef<Session>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ getValue }) => formatTime(getValue() as string),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "wave",
    header: "Wave",
  },
  {
    accessorKey: "surfer",
    header: "Surfer",
  },
  {
    accessorKey: "board",
    header: "Board",
  },
]
