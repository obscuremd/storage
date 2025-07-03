"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import AiChat from "@/components/PageComponents/GeneralComponents/AIChat";
import axios from "axios";
import FileTable from "@/components/PageComponents/GeneralComponents/FileTable";
import { Button } from "@/components/ui/button";
import { items } from "@/lib/exports";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function FolderPage() {
  const params = useParams();
  const title = params.title; // ✅ "Photos"
  const { user } = useUser();
  const [folder, setFolder] = useState<DBFolder>();

  const [type, setType] = useState<string>("Images");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFolder = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/api/folder?email=${user.emailAddresses[0].emailAddress}&title=${title}`
        );

        if (res.status === 200) {
          setFolder(res.data.folders[0]);
          console.log("single folder: ", res.data.folders[0]);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [user?.emailAddresses, title]);

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

      {/* Files Table */}
      {loading ? (
        <>
          <Skeleton className="w-full h-16" />
        </>
      ) : (
        <FileTable limit={5} title="Suggested Files" folder={folder?._id} />
      )}
    </main>
  );
}
