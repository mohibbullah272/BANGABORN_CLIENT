import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/actions/product.action';
import { DetailHero } from '@/components/DetailHero';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { DetailSticky } from '@/components/DetailSticky';
import { ProductStory } from '@/components/ProductStory';
import { ProductSpecs } from '@/components/ProductSpace';
import { ProductDetailSkeleton } from '@/components/ProductDetailSkeleton';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { StickyCartBar } from '@/components/StickyCartBar';



interface ProductDetailsProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: ProductDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await fetchProductBySlug(slug);
    return {
      title: `${product.name} | Bangaborn`,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.slice(0, 160),
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: 'Product | Bangaborn' };
  }
}

async function ProductDetailContent({ slug }: { slug: string }) {
  let product;
  try {
    const res = await fetchProductBySlug(slug);
    product = res.product;
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <>
      {/* 1. Full-viewport parallax hero */}
      <DetailHero product={product} />

      {/* 2. Marquee strip */}
      <MarqueeStrip tags={product.tags} category={product.category} gender={product.gender} />

      {/* 3. Sticky image + info section */}
      <DetailSticky product={product} />

      {/* 4. Marquee strip (second) */}
      <MarqueeStrip tags={product.tags} category={product.category} gender={product.gender} />

      {/* 5. Word-by-word story / description reveal */}
      <ProductStory product={product} />

      {/* 6. Specifications table */}
      <ProductSpecs product={product} />

 

    </>
  );
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { slug } = await params;

  return (
    <AnimatedBackground>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent slug={slug} />
      </Suspense>
    </AnimatedBackground>
  );
}