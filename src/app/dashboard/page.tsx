"use client";
import { AddFiles } from "@/components/localComponents/AddFiles";
import Files from "@/components/localComponents/Files";
import GlassIcons from "@/components/localComponents/GlassIcon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { Box, ChevronLeft, ChevronRight, FileText, Image, LoaderIcon, Trash, Video } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios"
import { useGen } from "@/Providers/GeneralContextProvider";
import { AiChat } from "@/components/localComponents/AIChat";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useUser();
  const {files,setFiles} = useGen()

  const items = [
    { icon: <Image/>, color: 'blue', label: 'Images'},
    { icon: <Video />, color: 'purple', label: 'Videos'},
    { icon: <FileText />, color: 'indigo', label: 'Documents'},
    { icon: <Box />, color: 'orange', label: 'Others'},
    { icon: <Trash />, color: 'red', label: 'Recycle Bin'},
  ];

  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);

  const [active, setActive] = useState<string>('Images');
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(()=>{
    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/files?email=${user?.emailAddresses[0].emailAddress}&page=${page}&limit=10&status=active`);
            if(response.status === 200) {
                const files = response.data.files;
                setPages(response.data.totalPages);
                setFiles(files);
                setLoading(false);
            }
            else{
                setLoading(false);
                return;
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching files:", error);
            return;
        }
  }
  fetchFiles();
  },[page, user?.emailAddresses[0].emailAddress, active])

  

  console.log(files)

  return (
        <main className="flex flex-col min-h-screen relative w-full p-16 md:gap-10 gap-8">
            <div className="fixed bottom-3 right-3"><AiChat/></div>
            
            <header className="flex gap-5 w-full">
                <Card className=" flex flex-col w-[50%]">
                    <CardHeader className="items-center pb-0 flex w-full justify-between">
                        <div>
                            <CardTitle>Hi {user?.fullName}</CardTitle>
                            <CardDescription>Storage</CardDescription>
                        </div>
                        <AddFiles/>
                    </CardHeader>
                    <CardContent className=" flex w-full gap-5">
                        <div className="flex flex-col gap-2 w-full">
                            <p>Images</p>
                            <Progress value={33} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <p>Videos</p>
                            <Progress value={33} />
                        </div>
                    </CardContent>
                    <CardContent className=" flex w-full gap-5">
                        <div className="flex flex-col gap-2 w-full">
                            <p>Docs</p>
                            <Progress value={33} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <p>Others</p>
                            <Progress value={33} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex flex-row w-[50%]">
                    <CardContent className="items-center w-fit">
                        <img src="https://i.pinimg.com/736x/45/1a/01/451a01ba0e8dfaecc3a96153b96c3c30.jpg" alt="Logo" className="w-[55%] mb-4 rounded-md" />
                    </CardContent>
                    <CardContent className="flex flex-col gap-2 w-full">
                        <CardTitle>My FIrst Porject</CardTitle>
                        <CardDescription>PNG image</CardDescription>
                        <CardDescription className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Solutulpa?</CardDescription>
                    </CardContent>
                    <CardContent className="flex flex-col gap-5">
                        <CardTitle>Info</CardTitle>
                        <div className="flex gap-10">
                            <CardDescription>Size</CardDescription>
                            <CardTitle>45.78kb</CardTitle>
                        </div>
                        <div className="flex gap-10">
                            <CardDescription>Date</CardDescription>
                            <CardTitle className="text-nowrap">27 Jun 2019</CardTitle>
                        </div>
                    </CardContent>
                    </Card>
            </header>
            <div className="flex gap-10">
                {
                    items.map((item, index) => (
                        <GlassIcons
                            key={index}
                            onclick={() => setActive(item.label)}
                            label={item.label}
                            color={active === item.label ?item.color : "grey"}
                            icon={item.icon}
                        />
                    ))
                }
            </div>
            <div className="flex flex-wrap gap-2 w-full">
                <p className="text-2xl font-bold">{active}</p>
                <div>
                    <Button variant={"outline"} onClick={()=>setPage(page - 1)} disabled={page ===1}><ChevronLeft/></Button>
                    <span className="mx-2">{page} of {pages}</span>
                    <Button variant={"outline"} onClick={()=>setPage(page + 1)} disabled={page ===pages}><ChevronRight/></Button>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                    {loading 
                    ? <LoaderIcon className="animate-spin w-10 h-10"/>
                    :
                        (files.length > 0 ? (
                            files.map((file, index) => (
                                <Files
                                    key={index}
                                    id={file._id || ""}
                                    title={file.title || "Untitled"}
                                    date={file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ""}
                                />
                            ))
                        ): <p className="text-gray-500">No files found</p>)
                    }
                </div>
            </div>
        </main>
  );
}
