// @ts-nocheck
import Image from "next/image";

import { DashedLine } from "../dashed-line";

import { cn } from "@/lib/utils";

const topItems = [
  {
    title: "Trending Collections.",
    description:
      "Explore the latest fashion trends curated for modern style lovers.",
    images: [
      {
        src: "https://i.pinimg.com/1200x/db/93/1f/db931ff95faace4c29e58299ebe88e83.jpg",
        alt: "Trending dresses",
        width: 495,
        height: 400,
      },
    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8",
    fade: [],
  },
  {
    title: "Cash on Delivery.",
    description:
      "Shop confidently and pay only when your order reaches your doorstep.",
    images: [
      { src: "https://i.pinimg.com/736x/3e/35/15/3e3515428abe4843bb69cf936e404090.jpg", alt: "Cash on delivery", width: 320, height: 250 },

    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8",
    fade: [],
  },
];

const bottomItems = [
  {
    title: "Fast Nationwide Delivery.",
    description:
      "Quick shipping across Bangladesh with reliable courier service.",
    images: [
      {
        src: "https://i.pinimg.com/736x/53/be/54/53be544b0496381ff2a96b4e2b6ed570.jpg",
        alt: "Fast delivery service",
        width: 320,
        height: 250,
      },
    ],
    className: "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8",
    fade: [],
  },
  {
    title: "Premium Fabric Quality.",
    description:
      "Comfortable, breathable, and durable fabrics for everyday wear.",
    images: [
      {
        src: "https://i.pinimg.com/736x/5b/36/d3/5b36d3fce42a2506c0d6ac8979c316fb.jpg",
        alt: "Premium fabric",
        width: 320,
        height: 250,
      },
    ],
    className: "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8",
    fade: [],
  },
  {
    title: "Easy Refund Policy.",
    description:
      "Not satisfied? Enjoy a smooth and transparent return process.",
    images: [
      {
        src: "https://i.pinimg.com/1200x/59/08/75/590875e878e98b829841285263f7a571.jpg",
        alt: "Refund policy",
        width: 320,
        height: 250,
      },
    ],
    className: "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8",
    fade: [],
  },
];

export const ResourceAllocation = () => {
  return (
    <section
      id="resource-allocation"
      className="overflow-hidden pb-28 lg:pb-32"
    >
      <div className="">
        <h2 className="container text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
        Style That Defines You
        </h2>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <DashedLine
            orientation="horizontal"
            className="container scale-x-105"
          />

          {/* Top Features Grid - 2 items */}
          <div className="relative container flex max-md:flex-col">
            {topItems.map((item, i) => (
              <Item key={i} item={item} isLast={i === topItems.length - 1} />
            ))}
          </div>
          <DashedLine
            orientation="horizontal"
            className="container max-w-7xl scale-x-110"
          />

          {/* Bottom Features Grid - 3 items */}
          <div className="relative container grid max-w-7xl md:grid-cols-3">
            {bottomItems.map((item, i) => (
              <Item
                key={i}
                item={item}
                isLast={i === bottomItems.length - 1}
                className="md:pb-0"
              />
            ))}
          </div>
        </div>
        <DashedLine
          orientation="horizontal"
          className="container max-w-7xl scale-x-110"
        />
      </div>
    </section>
  );
};

interface ItemProps {
  item: (typeof topItems)[number] | (typeof bottomItems)[number];
  isLast?: boolean;
  className?: string;
}

const Item = ({ item, isLast, className }: ItemProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8",
        className,
        item.className,
      )}
    >
      <div className="title-container text-balance">
        <h3 className="inline font-semibold">{item.title} </h3>
        <span className="text-muted-foreground"> {item.description}</span>
      </div>

      {item.fade.includes("bottom") && (
        <div className="from-muted/80 absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent md:hidden" />
      )}
      {item.images.length > 4 ? (
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-5">
            {/* First row - right aligned */}
            <div className="flex translate-x-4 justify-end gap-5">
              {item.images.slice(0, 4).map((image, j) => (
                <div
                  key={j}
                  className="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-contain object-left-top"
                  />
                  <div className="from-muted/80 absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l to-transparent" />
                </div>
              ))}
            </div>
            {/* Second row - left aligned */}
            <div className="flex -translate-x-4 gap-5">
              {item.images.slice(4).map((image, j) => (
                <div
                  key={j}
                  className="bg-background grid aspect-square size-16 place-items-center rounded-2xl lg:size-20"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-contain object-left-top"
                  />
                  <div className="from-muted absolute inset-y-0 bottom-0 left-0 z-10 w-14 bg-linear-to-r to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="image-container grid grid-cols-1 gap-4">
          {item.images.map((image, j) => (
            <Image
              key={j}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="object-contain object-left-top"
            />
          ))}
        </div>
      )}

      {!isLast && (
        <>
          <DashedLine
            orientation="vertical"
            className="absolute top-0 right-0 max-md:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute inset-x-0 bottom-0 md:hidden"
          />
        </>
      )}
    </div>
  );
};
