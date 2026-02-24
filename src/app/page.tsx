// @ts-nocheck

import { fetchFeaturedProducts } from "@/actions/Featured.action";
import { AnimatedBackground } from "@/components/AnimatedBackground";

import { FAQ } from "@/components/blocks/faq";

import { Hero } from "@/components/blocks/hero";

import { ResourceAllocation } from "@/components/blocks/resource-allocation";
import { FeaturedSection } from "@/components/FeatureSection";
import { TopChoice } from "@/components/TopChoice";
import { EasyCatch } from "@/components/ui/EasyCatch";
import { WavyBackground } from "@/components/ui/Wave_Background";


export default async function Home() {
const data = await fetchFeaturedProducts(6)

  return (
    <>
      <AnimatedBackground>
        <Hero />
        <FeaturedSection></FeaturedSection>
      <EasyCatch product={data}></EasyCatch>
        <ResourceAllocation />

        <TopChoice product={data.products}></TopChoice>
          
        <FAQ />
      </AnimatedBackground>




    </>
  );
}
