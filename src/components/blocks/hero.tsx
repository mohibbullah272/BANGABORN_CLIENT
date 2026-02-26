import Image from "next/image";

import {
  ChartNoAxesColumn,
  CircleDot,
  HandCoinsIcon,
  Redo2,
  Truck,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Trending Collections",
    description: "Stay ahead with the latest fashion trends curated for modern style lovers. New arrivals updated regularly.",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Cash on Delivery",
    description: "Shop without stress. Pay only when your order arrives at your doorstep. Simple. Secure. Reliable.",
    icon: HandCoinsIcon,
  },
  {
    title: "Fast & Reliable Delivery",
    description: "Quick processing and nationwide delivery so you get your favorite outfits without the long wait.",
    icon: Truck,
  },
  {
    title: "Easy Refund Policy",
    description: "Not satisfied? No worries. Enjoy a smooth and transparent refund process designed to protect your trust.",
    icon: Redo2,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
            BANGABORN
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
            Discover the latest trending dresses with fast delivery across
            Bangladesh. Shop confidently with Cash on Delivery and an easy
            refund policy.
          </p>
          <Button
              variant="outline"
              className="from-background hidden md:block h-auto backdrop-blur-lg gap-2 my-3 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <p
      
                className="max-w-56 truncate text-start md:max-w-none"
              >
             Trusted by thousands of happy customers across Bangladesh 🇧🇩
           
              </p>
            </Button>
          <div className="mt-5 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild>
              <Link href="/products">
                Shop Now
              </Link>
            </Button>
   
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="  max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[793px] w-full">
          <Image
            src="/logos/WhatsApp Image 2026-02-20 at 1.49.22 AM.jpeg"
            alt="hero"
            fill
            className="rounded-2xl object-contain shadow-lg max-lg:rounded-tr-none"
          />
        </div>
      </div>
    </section>
  );
};
