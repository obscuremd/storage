"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "lucide-react";

interface Props {
  menuItems: menuItemProps[];
}

interface menuItemProps{
  name:string,
  path?:string,
  anchor?: string,
  icon?: React.ReactNode;
}

const NavMenu:React.FC<Props> = ({menuItems}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {
          menuItems?.map((item, index) => (
          <NavigationMenuItem key={index} className={navigationMenuTriggerStyle()}>
            {item.path && <Link to={item.path}>{item.name}</Link>}
            {item.anchor && <a href={item.anchor}>{item.name}</a>}
          </NavigationMenuItem>

          ))
        }
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
