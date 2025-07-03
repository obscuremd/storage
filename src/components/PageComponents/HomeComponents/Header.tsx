import AiChat from "@/components/PageComponents/GeneralComponents/AIChat";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { items } from "@/lib/exports";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import React from "react";

interface Props {
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ type, setType }: Props) {
  const { user } = useUser();

  return (
    <header className="flex flex-col justify-center items-center gap-8 z-10">
      <div className="md:w-[60%]  flex flex-col justify-center gap-3">
        <p className="text-center">Hi, {user?.fullName}</p>
        <p className="text-4xl font-bold gradient-text text-center">
          Welcome to Assetive
        </p>
      </div>
      <div className="flex w-full max-w-[70%] items-center justify-center gap-2">
        {/* <Input type="email" placeholder="What can Assetive do for you" /> */}
        <AiChat search />

        <Button type="submit" variant="outline">
          <Search />
        </Button>
      </div>
      <div className="w-full flex overflow-x-auto whitespace-nowrap md:justify-center gap-3 px-2 scroll-smooth overscroll-x-contain">
        {items.map((item, index) => (
          <Button
            key={index}
            variant={type === item.label ? "default" : "outline"}
            onClick={() => setType(item.label)}
            className="flex-shrink-0"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </header>
  );
}
