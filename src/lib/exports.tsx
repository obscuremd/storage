import { Box, FileText, Image, Trash, Video } from "lucide-react";

export const items = [
  { icon: <Image />, color: "blue", label: "Images" },
  { icon: <Video />, color: "purple", label: "Videos" },
  { icon: <FileText />, color: "indigo", label: "Documents" },
  { icon: <Box />, color: "orange", label: "Others" },
  { icon: <Trash />, color: "red", label: "Recycle Bin" },
];
