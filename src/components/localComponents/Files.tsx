import React from "react";
import { Image, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { useGen } from "@/Providers/GeneralContextProvider";

interface props {
  id: string;
  title: string;
  date: string;
}
const Files:React.FC<props> = ({id, title,date}) => {

    const {setFiles} = useGen()

  const deleteFile =async()=>{
    try {
      const response = await axios.put(`/api/files?id=${id}`,{status:"inactive"} );
      console.log(response);

      // Remove the file from local state
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));

    } catch (error) {
      console.error("Error deleting file:", error);
    }
      
  }  
  return (

    <Label className="hover:bg-accent/50  rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 w-[45%] flex justify-between">
      <div className="flex items-start gap-3">
          <Checkbox
            id="toggle-2"
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <Image />
          <div className="grid gap-1.5 font-normal">
            <p className="text-sm leading-none font-medium">
              {title}
            </p>
            <p className="text-muted-foreground text-sm">
              {date}
            </p>
          </div>
      </div>
        <Button variant={"outline"} onClick={deleteFile}><Trash/></Button>
      </Label>
    
    // <Card className="flex flex-row items-center w-[48%]">
    //   <CardContent className="flex gap-10 items-center w-full">
    //     <Checkbox id="file"/>
    //     <Image />
    //     <CardTitle>My FIrst Porject</CardTitle>
    //     <CardTitle className="text-nowrap">27 Jun 2019</CardTitle>
    //   </CardContent>
    // </Card>
  );
};

export default Files;
