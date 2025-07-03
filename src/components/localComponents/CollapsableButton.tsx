import { ChevronDown, Folder } from "lucide-react";
import React from "react";

interface props {
  title: string;
}

export default function CollapsableButton({ title }: props) {
  return (
    <div className="p-2 flex items-center w-fit gap-2 rounded-lg shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50 cursor-pointer">
      <div className="bg-white text-black p-2 rounded-md">
        <Folder className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold w-44 text-start">{title}</p>
      <ChevronDown />
    </div>
  );
}
