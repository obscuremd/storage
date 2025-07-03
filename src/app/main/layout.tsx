"use client";
import { AppSidebar } from "@/components/localComponents/AppSidebar";
import HomeNav from "@/components/PageComponents/GeneralComponents/HomeNav";
import Aurora from "@/components/reactBits/Aurora";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider className="relative w-full flex">
      <AppSidebar />
      <div className="fixed w-screen right-0 z-0">
        <Aurora
          colorStops={["#26ba81", "#2bd3c6", "#2bd4b4"]}
          blend={0.9}
          amplitude={0.3}
          speed={1}
        />
      </div>
      <main className="px-8 md:px-16 py-8 z-10 gap-6 w-full">
        <HomeNav />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
