"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import FilePreview from "@/components/localComponents/FilePreview";
import { useGen } from "@/Providers/GeneralContextProvider";

export default function AiChat() {
  const { user } = useUser();
  const { setFiles } = useGen();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [input, setInput] = useState("");

  const [result, setResult] = useState<DBFile | null>(null);
  const [loading, setLoading] = useState(false);

  const findFile = async () => {
    setLoading(true);
    const email = user?.emailAddresses[0].emailAddress;
    if (!email) {
      setLoading(false);
      return;
    }
    if (input === "") {
      setLoading(false);
      return toast.error("file name must not be left empty");
    }

    try {
      const response = await axios.get(
        `/api/files?email=${email}&title=${input}`
      );
      if (response.status === 404) {
        return toast.error("File not found");
      }
      if (response.data.files.length === 0) {
        return toast.error("File not found");
      }
      if (response.data.files[0].status === "active") {
        return toast.error("File still exists and cant be recovered");
      }

      setResult(response.data.files[0]);
      toast.success("file found");
      console.log(response.data.files[0]);
    } catch (error) {
      console.log(error);
      toast.error("error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const restoreFile = async () => {
    try {
      const response = await axios.put(`/api/files?id=${result?._id}`, {
        status: "active",
      });

      console.log(response);
      const data = {
        _id: response.data.file._id,
        title: response.data.file.title,
        email: response.data.file.email,
        url: response.data.file.url,
        type: response.data.file.type,
        size: response.data.file.size,
        description: response.data.file.description,
        status: response.data.file.status,
        folder: response.data.file.folder,
        createdAt: new Date(response.data.file.updatedAt),
      };

      setFiles((prev) => [data, ...prev]);
      toast.success("File recovered successfully");
      setResult(null);
    } catch (error) {
      console.log(error);
      toast.error("error recovering file");
    }
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Recover a file <RefreshCcw />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Recover a File</DrawerTitle>
          <DrawerDescription>
            {result === null
              ? "Enter the file name you want to recover."
              : "File found successfully commence restoration"}
          </DrawerDescription>
        </DrawerHeader>

        {loading ? (
          <div className="px-4 py-2 flex flex-col gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : result === null ? (
          <>
            <div className="px-4 py-2">
              <Input
                placeholder="Enter file name..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <DrawerFooter>
              <Button onClick={findFile}>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : (
          <>
            <DrawerDescription className="self-center flex flex-col justify-center items-center gap-5 p-3">
              <div className="flex justify-center">
                <FilePreview url={result.url} />
              </div>
              <div>{result.title}</div>
              <div>{result.description}</div>
            </DrawerDescription>
            <DrawerFooter>
              <Button onClick={restoreFile}>
                <RefreshCcw /> Restore File
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
