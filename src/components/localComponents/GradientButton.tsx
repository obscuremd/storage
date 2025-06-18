import React from 'react'
import { Button } from '../ui/button'

interface Props {
  text: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "gradientTransparent";
}

const GradientButton:React.FC<Props> = ({text,onClick, variant= "gradientTransparent"}) => {
  return (
    <div className="p-[2px] rounded-md bg-[linear-gradient(284deg,_rgba(1,49,161,1)_-59.18%,_rgba(43,211,198,1)_139.23%)] inline-block cursor-pointer">
        <Button onClick={onClick} variant={variant} size="default" className="rounded-md bg-background/80 backdrop-blur-md">
            {text}
        </Button>
    </div>
  )
}

export default GradientButton