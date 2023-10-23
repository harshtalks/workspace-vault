"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { DotsHorizontalIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { SecretFiles } from "./data";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<SecretFiles>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-right"
      >
        <Button variant="ghost">
          <>
            Created At
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          </>
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const secret = row.original;
      const createdAt = secret.created_at;
      const date = new Date(createdAt);
      const formatted = date.toDateString();
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const env = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(env.name)}
            >
              Copy Variables
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Erase Variables</DropdownMenuItem>
            <DropdownMenuItem color="#f0f0f0">Delete File</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
