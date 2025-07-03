"use client"
import { AnimatedTestimonials } from "@/components/localComponents/AnimatedTestimonials";
import GradientButton from "@/components/localComponents/GradientButton";
import { GlowingEffectDemo } from "@/components/localComponents/GridItem";
import NavMenu from "@/components/localComponents/NavMenu";
import { Timeline } from "@/components/localComponents/Timeline";
import Squares from "@/components/reactBits/Squares";
import { Button } from "@/components/ui/button";
import {
  LandingPageMenuItems,
  testimonials,
  TimelineData,
} from "@/Exports/data";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/main/home");
    }
  }, [isSignedIn, router]);

  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen relative w-full p-16 md:gap-32 gap-16">
      <div className="absolute h-screen z-0">
        <Squares
          speed={0.5}
          squareSize={50}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#0131A130"
          hoverFillColor="#0131A160"
        />
      </div>
      <nav className="flex z-10 flex-roe justify-between items-center w-full sm:items-start">
        <p className="text-xl font-bold">Assetive</p>
        <NavMenu menuItems={LandingPageMenuItems} />
        <SignUpButton mode="modal">
          <GradientButton text="Get Started" />
        </SignUpButton>
      </nav>
      <header className="flex flex-col justify-center items-center gap-8 z-10">
        <GradientButton
          variant="ghost"
          text="🌟 your number #1 cloud storage solution"
        />
        <div className="md:w-[60%]  flex flex-col gap-3">
          <p className="text-4xl font-bold gradient-text text-center">
            Safely Manage Your Cloud Data With Confidence.
          </p>
          <p className="text-center">
            From property to precious metals, securely monitor and grow your
            tangible asset portfolio.
          </p>
        </div>
        <div className="w-full flex  justify-center gap-3">
          <SignUpButton mode="modal">
            <GradientButton text="Sign Up For Free" />
          </SignUpButton>

          <Button variant={"default"}>Read More</Button>
        </div>
      </header>
      <GlowingEffectDemo />
      <Timeline data={TimelineData} />
      <AnimatedTestimonials testimonials={testimonials} />
    </main>
  );
}
