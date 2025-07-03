"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Box, FilePlus, FolderPlus, RefreshCcw, Search } from "lucide-react";
import {
  findFileByName,
  recoverDeletedFile,
  createNewFile,
  addFileToFolder,
} from "@/lib/ai-actions";

interface Props {
  search?: boolean;
}

type OptionType = "find" | "recover" | "create" | "add";

export default function AiChat({ search }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<OptionType | null>(null);

  const options = [
    { icon: <Search />, text: "Find a File", type: "find" },
    { icon: <RefreshCcw />, text: "Recover a File", type: "recover" },
    { icon: <FilePlus />, text: "Create a new File", type: "create" },
    { icon: <FolderPlus />, text: "Add a File to a Folder", type: "add" },
  ] as const;

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      if (selected === "find") await findFileByName(input);
      else if (selected === "recover") await recoverDeletedFile(input);
      else if (selected === "create") await createNewFile(input);
      else if (selected === "add") {
        const folderName = prompt("Enter folder name:");
        if (folderName) await addFileToFolder(input, folderName);
      }

      setOpenDrawer(false);
      setInput("");
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {search ? "What can Assetive do for you" : <Box />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="center">
          <DropdownMenuLabel>What should Assetive do</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                setSelected(item.type);
                setOpenDrawer(true);
              }}
              className="flex items-center gap-2"
            >
              {item.icon}
              <span>{item.text}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selected === "find" && "Find a File"}
              {selected === "recover" && "Recover a File"}
              {selected === "create" && "Create a New File"}
              {selected === "add" && "Add a File to a Folder"}
            </DrawerTitle>
            <DrawerDescription>
              Enter the file name {selected === "add" ? "to move" : ""}.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2">
            <Input
              placeholder="Enter file name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
