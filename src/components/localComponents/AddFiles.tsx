"use client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { storage } from "@/services/firebaseconfig";

import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useGen } from "@/Providers/GeneralContextProvider";

// Default values shown

export function AddFiles() {

  const { user } = useUser();
  const {setFiles} = useGen()

  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("a picture of my dog...");
  const [type, setType] = useState<string>("image");
  const [size, setSize] = useState<number>(0); // Size in bytes
  const [description, setDescription] = useState<string>("an image"); // Default description

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Upload image to Firebase Storage
  const uploadPic = async (): Promise<string | undefined> => {
    if (!image) return;

    setLoading(true);
    const imageRef = ref(storage, `files/${Date.now()}-${image.name}`);

    try {
      const upload = await uploadBytes(imageRef, image as Blob);
      setTitle(upload.metadata.name || "Untitled");
      setType(upload.metadata.contentType || "image");
      setSize(upload.metadata.size || 0); // Size in bytes

      const url = await getDownloadURL(upload.ref);
      setImage(undefined);
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const uploadToDb = async () => {
    const downloadUrl = await uploadPic();
    if (!downloadUrl) return;

    try {
      const response = await axios.post("/api/files", {
        title,
        email: user?.emailAddresses[0].emailAddress,
        url: downloadUrl,
        type,
        size,
        description,
      });

      console.log("File uploaded to database:", response.data);
      const data:DBFile = {title, email: user?.emailAddresses[0].emailAddress, url: downloadUrl, type, size, description, createdAt: new Date()};
      setFiles((prevFiles) => [...prevFiles, data]); // Update local state with
    } catch (error) {
      console.error("Error uploading file to database:", error);
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
          <DialogHeader>
            <DialogTitle>Upload a file</DialogTitle>
            <DialogDescription>
              Safely and securely upload your files. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleImageChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Description</Label>
              <Input
                id="username-1"
                name="username"
                onChange={(e) => setDescription(e.target.value)}
                defaultValue="a picture of my dog..."
              />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <LoaderIcon className="animate-spin"/>
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
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
