"use client";

import { AddFiles } from "@/components/localComponents/AddFiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function HomeNav() {
  const { user } = useClerk();
  const pathname = usePathname();

  // Get all path segments, ignore empty ones
  const allSegments = pathname.split("/").filter(Boolean);

  // Remove "main" if it's the first or second segment
  const mainIndex = allSegments.indexOf("main");
  const pathSegments =
    mainIndex > -1 ? allSegments.slice(mainIndex + 1) : allSegments;

  // Generate breadcrumb crumbs from pathSegments
  const crumbs = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = decodeURIComponent(segment.replace(/-/g, " "));
    return { href, label };
  });

  return (
    <div className="w-full flex flex-col pb-6">
      <div className="justify-end flex gap-2.5">
        <AddFiles />
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {pathname !== "/main/home" && (
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {idx === crumbs.length - 1 ? (
                    <BreadcrumbPage className="text-lg">
                      {formatLabel(crumb.label)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="text-lg" asChild>
                      <Link href={`/${crumb.href}`}>
                        {formatLabel(crumb.label)}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
}

function formatLabel(label: string) {
  return label
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
