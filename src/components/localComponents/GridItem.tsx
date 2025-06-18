"use client";

import { Activity, BarChart, Clock, Folders, Lock} from "lucide-react";
import { GlowingEffect } from "./GlowingEffect";

export function GlowingEffectDemo() {
  return (
    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-12 xl:grid-rows-2">
      {/* Top Left */}
      <GridItem
        area="xl:col-span-6 xl:row-span-1"
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Secure Record Keeping"
        description="Your data is protected with end-to-end encryption and stored securely—accessible only to you."
      />

      {/* Top Right */}
      <GridItem
        area="xl:col-span-6 xl:row-span-1"
        icon={<BarChart className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Descriptive Charts"
        description="Visual insights to easily analyze your data."
      />

      {/* Bottom Left */}
      <GridItem
        area="xl:col-span-4 xl:row-span-1"
        icon={<Activity className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Realtime"
        description="Track asset value over time using live market data."
      />

      {/* Bottom Middle */}
      <GridItem
        area="xl:col-span-4 xl:row-span-1"
        icon={<Clock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Reminders"
        description="Get smart notifications so you don’t miss another trade."
      />

      {/* Bottom Right */}
      <GridItem
        area="xl:col-span-4 xl:row-span-1"
        icon={<Folders className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Organization"
        description="Easy asset categorization by type and class."
      />
    </ul>
  );
}



interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[1rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
