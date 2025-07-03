"use client";
import { useState } from "react";
import AiChat from "@/components/PageComponents/GeneralComponents/AIChat";
import FileTable from "@/components/PageComponents/GeneralComponents/FileTable";
import { Button } from "@/components/ui/button";
import { items } from "@/lib/exports";

export default function RecycleBin() {
  const [type, setType] = useState<string>("Images");

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
      <FileTable limit={3} title="Today" pagination={false} status="inactive" />
      <FileTable
        limit={3}
        title="This Week"
        pagination={false}
        status="inactive"
      />
      <FileTable
        limit={3}
        title="This Month"
        pagination={false}
        status="inactive"
      />
    </main>
  );
}
