"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

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
  },
  {
    accessorKey: "time",
    header: "Time",
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
