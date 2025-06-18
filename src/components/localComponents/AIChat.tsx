"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useGen } from "@/Providers/GeneralContextProvider";

export function AiChat() {
  const { user } = useUser();
  const { setFiles } = useGen();

  const [option, setOption] = useState("Ask Assetive anything ");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const options = [
    "Find a file: ",
    "Recover a lost File: ",
    "find and recover file by date: ",
    "sort files by date: ",
  ];

  const findFile = async (query: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: "What is the name of your file?" },
    ]);

    if (!query.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: "I don't know the name of the file." },
      ]);
      return;
    }

    try {
      const response = await axios.get(
        `/api/files?email=${user?.emailAddresses[0].emailAddress}&title=${query}`
      );

      const files = response.data.files || [];
      setFiles((prev) => [...prev, ...files]);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Found ${files.length} file(s) related to "${query}".`,
        },
      ]);
    } catch (error) {
      console.error("Error finding file:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't find your file." },
      ]);
    }
  };

  const chat = async () => {
    const currentQuery = option.trim();

    if (!currentQuery) return;

    setMessages((prev) => [...prev, { role: "user", content: currentQuery }]);

    if (currentQuery.toLowerCase() === "find a file") {
      await findFile(currentQuery);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I'm still learning how to help with that!" },
      ]);
    }

    setOption(""); // Clear input after processing
  };

  return (
    <Dialog>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MessageCircle /> Chat with Assetive AI
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] gap-20 flex flex-col justify-center">
          <DialogHeader>
            <DialogTitle>Chat with Assetive</DialogTitle>
          </DialogHeader>

          {messages.length > 0 && (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-auto pr-2">
              {messages.map((message, index) => (
                <Card
                  key={index}
                  className={`py-2 px-3 w-[85%] rounded-md ${
                    message.role === "user"&& "bg-blue-950 text-white self-end"}`}
                >
                  <CardContent className="px-2 py-1">
                    {message.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {options.map((item, index) => (
                <Badge
                  className="cursor-pointer"
                  key={index}
                  onClick={() => setOption(item)}
                  variant={"secondary"}
                >
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4">
              <Input
                value={option}
                onChange={(e) => setOption(e.target.value)}
                placeholder="Ask Assetive something..."
              />
              <Button variant="outline" onClick={chat}>
                <Send />
              </Button>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
