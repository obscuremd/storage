import {
  EllipsisVertical,
  Folder,
  Pencil,
  PlusCircle,
  Trash,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface props {
  title: string;
  files: number;
}

export default function FolderUi({ title, files }: props) {
  return (
    <div className="relative w-fit">
      <Link href={`/main/my_files/${title}`}>
        <div className="p-2 flex items-center border-[1px] border-sidebar-border gap-2 rounded-lg bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer pr-8">
          <div className="text-foreground p-2 rounded-md">
            <Folder className="h-5 w-5" />
          </div>
          <div className="w-44">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs">{files} files</p>
          </div>
        </div>
      </Link>

      {/* Dropdown menu positioned absolutely */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-muted">
              <EllipsisVertical className="w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add A File
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
