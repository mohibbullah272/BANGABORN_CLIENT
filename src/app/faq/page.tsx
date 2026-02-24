import React from "react";

import { FAQ } from "@/components/blocks/faq";

import { DashedLine } from "@/components/dashed-line";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Page = () => {
  return (
    <AnimatedBackground>
      <FAQ
        className="py-28 text-center lg:pt-44 lg:pb-32"
        className2="max-w-xl lg:grid-cols-1"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-xl" />
  
    </AnimatedBackground>
  );
};

export default Page;
