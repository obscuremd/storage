"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useGen } from "@/Providers/GeneralContextProvider";
import CollapsableButton from "@/components/localComponents/CollapsableButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, PlusCircle, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Props {
  limit: number;
  title: string;
  folder?: string;
  type?: string;
  pagination?: boolean;
  status?: string;
}

export default function FileTable({
  limit,
  title,
  folder,
  type,
  pagination = true,
  status = "active",
}: Props) {
  const { user } = useUser();
  const { files, setFiles } = useGen();

  const [loading, setLoading] = useState<boolean>(false);

  const [fileIsOpen, setFileIsOpen] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/api/files?email=${
            user.emailAddresses[0].emailAddress
          }&page=${page}&limit=${limit}&status=${status}${
            folder ? `&folder=${folder}` : ""
          }${type ? `&type=${type}` : ""}`
        );

        if (res.status === 200) {
          setFiles(res.data.files);
          setPages(res.data.totalPages);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [page, user?.emailAddresses, folder, limit, type]);

  const DeleteFile = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/files?id=${id}`, {
        status: "inactive",
      });

      if (res.status === 200) {
        setFiles((prev) => prev.filter((file) => file._id !== id));
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapsible
      open={fileIsOpen}
      onOpenChange={setFileIsOpen}
      className="flex flex-col gap-5"
    >
      <CollapsibleTrigger>
        <CollapsableButton title={title} />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 rounded-xl border border-zinc-800 p-2">
        <Table className="w-full text-sm text-gray-200">
          <TableHeader>
            <TableRow className="bg-zinc-900 text-xs uppercase text-zinc-400">
              <TableHead className="py-4 px-4 rounded-l-xl">Title</TableHead>
              <TableHead className="py-4 px-4">Type</TableHead>
              <TableHead className="py-4 px-4">Created</TableHead>
              <TableHead className="py-4 px-4">Size</TableHead>
              <TableHead className="py-4 px-4 rounded-r-xl"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow className="w-full">
                <Skeleton className="w-full h-12" />
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-5">
                  No files found.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file._id} className="hover:bg-zinc-800">
                  {/* Wrap the title cell with a SheetTrigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <TableCell
                        className="py-4 px-4 cursor-pointer hover:underline"
                        onClick={(e) => e.stopPropagation()} // Prevent nested trigger conflicts
                      >
                        {file.title}
                      </TableCell>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{file.title}</SheetTitle>
                        <SheetDescription>
                          Type: {file.type} <br />
                          Size: {(file.size / 1024).toFixed(2)} KB <br />
                          Created:{" "}
                          {file.createdAt
                            ? new Date(file.createdAt).toLocaleDateString()
                            : "N/A"}
                        </SheetDescription>
                      </SheetHeader>
                      {/* Add editable form or metadata here */}
                    </SheetContent>
                  </Sheet>

                  <TableCell className="py-4 px-4">{file.type}</TableCell>
                  <TableCell className="py-4 px-4">
                    {file.createdAt
                      ? new Date(file.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    {(file.size / 1024).toFixed(2)} KB
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <PlusCircle /> Add to Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => DeleteFile(file._id || "")}
                        >
                          <Trash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ✅ Pagination Controls */}
        {pagination && (
          <div className="flex items-center justify-end space-x-4 py-4 px-2">
            <p className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </p>
            <div className="space-x-2">
              <button
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                disabled={page === pages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
