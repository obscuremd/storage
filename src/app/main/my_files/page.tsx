"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useGen } from "@/Providers/GeneralContextProvider";
import AiChat from "@/components/PageComponents/GeneralComponents/AIChat";
import FolderUi from "@/components/localComponents/FolderUi";
import CollapsableButton from "@/components/localComponents/CollapsableButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import axios from "axios";
import FileTable from "@/components/PageComponents/GeneralComponents/FileTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { items } from "@/lib/exports";

export default function MyFiles() {
  const { user } = useUser();
  const { folders, setFolders } = useGen();

  const [type, setType] = useState<string>("Images");
  const [loading, setLoading] = useState<boolean>(false);

  const [folderIsOpen, setFolderIsOpen] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/api/folder?email=${user.emailAddresses[0].emailAddress}`
        );

        if (res.status === 200) {
          setFolders(res.data.folders);
          console.log("folders: ", res.data);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user?.emailAddresses, setFolders]);

  return (
    <main className="flex flex-col min-h-screen relative w-full md:gap-10 gap-8">
      <div className="fixed bottom-3 right-10">
        <AiChat />
      </div>

      <div className="w-full flex gap-3">
        {items.map((item, index) => (
          <Button
            key={index}
            variant={type === item.label ? "default" : "outline"}
            onClick={() => setType(item.label)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>

      {/* Folders */}
      <Collapsible
        open={folderIsOpen}
        onOpenChange={setFolderIsOpen}
        className="flex flex-col gap-5"
      >
        <CollapsibleTrigger>
          <CollapsableButton title="Folders" />
        </CollapsibleTrigger>
        <CollapsibleContent className="flex gap-3 flex-wrap">
          {loading ? (
            <>
              <Skeleton className="w-[256px] h-14" />
              <Skeleton className="w-[256px] h-14" />
              <Skeleton className="w-[256px] h-14" />
            </>
          ) : folders?.length === 0 ? (
            <div className="text-zinc-400 text-sm">No Folders Found</div>
          ) : (
            folders.map((item, index) => (
              <FolderUi
                key={index}
                title={item.title}
                files={item.files.length}
              />
            ))
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Files Table */}
      <FileTable limit={3} title="Files" />
    </main>
  );
}
