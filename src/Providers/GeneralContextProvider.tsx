"use client"
import React, { createContext, PropsWithChildren, useContext, useState } from "react";

interface generalProps {
    files : DBFile[],
    setFiles : React.Dispatch<React.SetStateAction<DBFile[]>>
}

const GeneralContext = createContext<generalProps | undefined>(undefined)

export const GeneralProvider=({children}:PropsWithChildren)=>{

    const [files,setFiles] = useState<DBFile[]>([])
    

    return(
        <GeneralContext.Provider value={{files,setFiles}}>
            {children}
        </GeneralContext.Provider>
    )
}

export const useGen = (): generalProps => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};