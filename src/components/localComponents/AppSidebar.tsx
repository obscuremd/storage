// components/AppSidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  Home,
  Folder,
  Clock,
  Trash2,
  Star,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export function AppSidebar() {
  const { user } = useUser();
  const [folders, setFolders] = useState<DBFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [myFilesOpen, setMyFilesOpen] = useState(true);

  useEffect(() => {
    const fetchFolder = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/api/folder?email=${user.emailAddresses[0].emailAddress}`
        );

        if (res.status === 200) {
          setFolders(res.data.folders);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [user?.emailAddresses]);

  return (
    <Sidebar
      collapsible="icon"
      className="w-72 bg-black text-white min-h-screen"
    >
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <SidebarHeader className="flex items-center gap-3 px-4 py-5">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/main/home">
                <div className="bg-white text-black p-2 rounded-md">
                  <Folder className="h-5 w-5" />
                </div>
                <span className="text-base font-semibold">Assetive</span>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>

          {/* Search */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search"
                className="bg-transparent outline-none text-sm w-full text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Getting Started Label */}
          <SidebarGroup>
            <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/main/home">
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* My Files */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setMyFilesOpen(!myFilesOpen)}
                  >
                    <Folder className="w-4 h-4" />
                    <Link href="/main/my_files">My Files</Link>
                    {myFilesOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {myFilesOpen && (
                  <div className="ml-6 flex flex-col gap-1 text-sm text-muted-foreground">
                    {loading ? (
                      <>
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                      </>
                    ) : (
                      folders.map((item) => (
                        <Link
                          href={`/main/my_files/${item.title}`}
                          key={item._id}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md"
                        >
                          <Folder className="w-3.5 h-3.5" />
                          {item.title}
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {/* Recents */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/main/recents">
                      <Clock className="w-4 h-4" />
                      <span>Recents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Trash */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/main/recycle_bin">
                      <Trash2 className="w-4 h-4" />
                      <span>Recycle Bin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* quick Access */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/main/quick_access">
                      <Star className="w-4 h-4" />
                      <span>Quick Access</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom User Info */}
        <div className="p-4 border-t border-muted">
          <div className="flex items-center gap-3">
            <Image
              src="/avatar.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-md"
            />
            <div className="text-sm">
              <p className="font-medium text-white">Shadcn</p>
              <p className="text-muted-foreground">m@example.com</p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
