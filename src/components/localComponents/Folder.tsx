"use client";
import React from "react";

interface props {
  text: string;
}

export const Folder:React.FC<props> = ({text}) => {
  return (
    <section className="relative group flex flex-col items-center justify-center w-fit h-full">
      <div className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50">
        <div
          className="work-5 bg-[#2BD3C6] w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative 
          after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-[#2BD3C6] after:rounded-t-2xl 
          before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-[#2BD3C6] before:[clip-path:polygon(0_35%,0%_100%,50%_100%)]"
        ></div>

        <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
        <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
        <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>

        <div
          className="work-1 absolute bottom-0 bg-gradient-to-t from-[#51f6ff] to-[#51f6ff] w-full h-[156px] rounded-2xl rounded-tr-none transition-all ease duration-300 origin-bottom flex items-end 
          after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-[#51f6ff] after:rounded-t-2xl 
          before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-[#51f6ff] before:[clip-path:polygon(100%_14%,50%_100%,100%_100%)] 
          group-hover:shadow-[inset_0_20px_40px_#2BD3C6,_inset_0_-20px_40px_#2BD3C6] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"
        ></div>
      </div>
      <p className="text-xl pt-4">{text}</p>
    </section>
  );
};
