"use client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "@/services/firebaseconfig";

import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useGen } from "@/Providers/GeneralContextProvider";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";

// Default values shown

export function AddFiles() {
  const { user } = useUser();
  const { setFiles, setFolders } = useGen();
  const [selectFilesData, setSelectedFilesData] = useState<DBFile[]>([]);

  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([""]);

  const [description, setDescription] = useState<string>(""); // Default description
  const [folderTitle, setFolderTitle] = useState(""); // Default description

  useEffect(() => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    const fetchFiles = async () => {
      setFileLoading(true);
      try {
        const res = await axios.get(
          `/api/files?email=${user.emailAddresses[0].emailAddress}`
        );
        if (res.status === 200) {
          const filteredFiles = res.data.files.filter(
            (file: DBFile) => file.folder === ""
          );
          setSelectedFilesData(filteredFiles);
          console.log("Filtered files where folder is empty:", filteredFiles);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setFileLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Upload image to Firebase Storage
  const uploadPic = async (): Promise<
    { url: string; size: number; type: string; title: string } | undefined
  > => {
    if (!image) {
      toast.error("please select a file to upload");
      setLoading(false);
      return;
    }

    const imageRef = ref(storage, `assetive/${Date.now()}-${image.name}`);

    try {
      const upload = await uploadBytes(imageRef, image as Blob);
      const fullName = upload.metadata.name || "Untitled";
      const originalName = fullName.substring(fullName.indexOf("-") + 1);

      const size = upload.metadata.size || 0;
      const type = upload.metadata.contentType || "image";
      const url = await getDownloadURL(upload.ref);

      setImage(undefined); // clear image from UI state

      return {
        url,
        size,
        type,
        title: originalName,
      };
    } catch (error) {
      toast.error("error uploading file");
      setLoading(false);
      console.error("Upload failed:", error);
      return undefined;
    }
  };

  const uploadToDb = async () => {
    setLoading(true);

    const uploaded = await uploadPic();
    if (!uploaded) return;

    const { url, size, type, title } = uploaded;

    // Normalize MIME type
    let normalizedType = "other";
    switch (true) {
      case /^image\//.test(type):
        normalizedType = "image";
        break;
      case /^video\//.test(type):
        normalizedType = "video";
        break;
      case /^application\/pdf$/.test(type):
      case /^application\/msword$/.test(type):
      case /^application\/vnd.openxmlformats-officedocument/.test(type):
        normalizedType = "document";
        break;
      case /^audio\//.test(type):
        normalizedType = "audio";
        break;
    }

    try {
      const response = await axios.post("/api/files", {
        title,
        email: user?.emailAddresses[0].emailAddress,
        url,
        type: normalizedType,
        size,
        description,
      });

      console.log("File uploaded to database:", response.data);
      toast.success("File uploaded to database");

      const data: DBFile = {
        title,
        email: user?.emailAddresses[0].emailAddress,
        url,
        type: normalizedType,
        size,
        description,
        createdAt: new Date(),
      };
      setFiles((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error uploading file to database:", error);
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderUpload = async () => {
    setLoading(true);

    // Validate
    if (!folderTitle.trim()) {
      toast.error("Folder name is required");
      setLoading(false);
      return;
    }

    if (selectedFiles.some((file) => !file.trim())) {
      toast.error("Each selected file must not be empty");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/folder", {
        title: folderTitle,
        email: user?.emailAddresses[0].emailAddress,
        files: selectedFiles,
      });

      toast.success("Folder created");
      console.log("Folder created:", response.data);
      setFolders((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle />
            Add File
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs>
            <TabsList>
              <TabsTrigger value="Add File">Add File</TabsTrigger>
              <TabsTrigger value="Add Folder">Add Folder</TabsTrigger>
            </TabsList>
            <TabsContent value="Add File">
              <Card>
                <CardHeader>
                  <CardTitle>Upload a file</CardTitle>
                  <CardDescription>
                    Safely and securely upload your files. Click save when
                    you&apos;re done.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="picture">Fle</Label>
                      <Input
                        id="picture"
                        type="file"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Description</Label>
                      <Input
                        id="username-1"
                        name="username"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="a picture of my dog..."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="self-end flex gap-2">
                  {loading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" onClick={uploadToDb}>
                        Save changes
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Add Folder">
              <Card>
                <CardHeader>
                  <CardTitle>Create A Folder</CardTitle>
                  <CardDescription>
                    Create a folder to store different types of files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="folderName">Folder name</Label>
                      <Input
                        id="folderName"
                        value={folderTitle}
                        onChange={(e) => setFolderTitle(e.target.value)}
                        placeholder="e.g. My Project Files"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label>Select files to include</Label>
                      <div className="h-32 overflow-y-scroll">
                        {selectedFiles.map((value, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select
                              value={value}
                              onValueChange={(newValue) => {
                                const updated = [...selectedFiles];
                                updated[index] = newValue;
                                setSelectedFiles(updated);
                              }}
                            >
                              <SelectTrigger className="w-[240px]">
                                <SelectValue placeholder="Select a file" />
                              </SelectTrigger>
                              <SelectContent>
                                {fileLoading ? (
                                  <Skeleton className="w-full h-2" />
                                ) : (
                                  selectFilesData.map((item) => (
                                    <SelectItem
                                      key={item._id}
                                      value={item._id || ""}
                                    >
                                      {item.title}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updated = selectedFiles.filter(
                                  (_, i) => i !== index
                                );
                                setSelectedFiles(updated);
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedFiles([...selectedFiles, ""])}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add File
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="self-end flex gap-2">
                  {loading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleFolderUpload}>
                        Save changes
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </form>
    </Dialog>
  );
}
