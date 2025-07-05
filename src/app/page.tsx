import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavMenu from "@/components/localComponents/NavMenu";
import GradientButton from "@/components/localComponents/GradientButton";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  LandingPageMenuItems,
  testimonials,
  TimelineData,
} from "@/Exports/data";
import { GlowingEffectDemo } from "@/components/localComponents/GridItem";
import { Timeline } from "@/components/localComponents/Timeline";
import { AnimatedTestimonials } from "@/components/localComponents/AnimatedTestimonials";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Redirect if signed in
    if (isSignedIn) {
      router.push("/main/home");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    // Function to check screen width and update state
    function handleResize() {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's 'sm' breakpoint
    }

    // Initial check
    handleResize();

    // Listen to resize events
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen relative w-full p-4 md:p-16 md:gap-32 gap-16">
      <nav className="flex z-10 justify-between items-center w-full sm:items-start">
        <p className="text-xl font-bold">Assetive</p>

        {isMobile ? (
          <>
            {/* Burger button on mobile */}
            <button
              className="p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200"></span>
                <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200"></span>
                <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200"></span>
              </div>
            </button>

            {/* Show menu dropdown if burger is clicked */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-md z-20">
                <NavMenu menuItems={LandingPageMenuItems} />
              </div>
            )}
          </>
        ) : (
          // Full NavMenu on desktop
          <NavMenu menuItems={LandingPageMenuItems} />
        )}

        <SignUpButton mode="modal">
          <GradientButton text="Get Started" />
        </SignUpButton>
      </nav>

      {/* Rest of your page content here */}
      <header className="flex flex-col justify-center items-center gap-8 z-10">
        <GradientButton
          variant="ghost"
          text="🌟 your number #1 cloud storage solution"
        />
        <div className="md:w-[60%] flex flex-col gap-3">
          <p className="text-4xl font-bold gradient-text text-center">
            Your Files, Smarter & Safer Than Ever.
          </p>
          <p className="text-center">
            Store, organize, and instantly recover your files with cutting-edge
            AI technology—designed for speed, security, and simplicity.
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
