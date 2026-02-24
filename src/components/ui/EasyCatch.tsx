// @ts-nocheck
import React, { useMemo } from "react";
import { DraggableCardBody, DraggableCardContainer } from "./Dragable_card";
import Image from "next/image";
import Link from "next/link";

export function EasyCatch(items: any) {
  // Defensive: normalize to an array of products from likely shapes
  const products = useMemo(
    () =>
      items?.product?.products ??
      items?.product ??
      items?.products ??
      (Array.isArray(items) ? items : []),
    [items]
  );

  const cardStyles = [
    "absolute top-10   left-[18%]  rotate-[-6deg]  z-10",
    "absolute top-44  left-[27%]  rotate-[-9deg]  z-20",
    "absolute top-8   left-[42%]  rotate-[9deg]   z-30",
    "absolute top-36  left-[58%]  rotate-[11deg]  z-20",
    "absolute top-28  right-[32%] rotate-[3deg]   z-30",
    "absolute top-16  left-[48%]  rotate-[-4deg]  z-10",
    "absolute top-52  left-[35%]  rotate-[6deg]   z-20",
    "absolute top-20  right-[45%] rotate-[-8deg]  z-30",
  ];


  return (
    <DraggableCardContainer
      className="
        relative flex min-h-[90vh] w-full 
        items-center justify-center 
        overflow-hidden bg-neutral-50/40 dark:bg-neutral-950/40
      "
      // hint: prevent the browser touch/gesture handling interfering with drag
      style={{ touchAction: "none" }}
    >
      <p className="absolute top-1/2 left-1/2 mx-auto max-w-md -translate-x-1/2 -translate-y-3/4 select-none text-center text-4xl font-black text-neutral-300/70 md:text-4xl lg:text-5xl dark:text-neutral-800/50 pointer-events-none">
      Easy Catch
        <br />
       Your Needs
      </p>

      {products.map((item: any, index: number) => {
        const styleIndex = index % cardStyles.length;
        const cardClass = cardStyles[styleIndex];

        return (
          <DraggableCardBody
            key={item?._id ?? index}
            // IMPORTANT: remove transition-all. Use transform-only transitions and GPU hints.
            className={`
              transform-gpu
              hover:scale-105 hover:shadow-2xl
              ${cardClass}
            `}
            // GPU optimization hint
            style={{ willChange: "transform" }}
          >
            <Link href={`/products/${item.slug}`}>        
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                width={340}
                height={340}
                src={item?.images?.[0] ?? ""}
                alt={item?.name ?? "product"}
                className="pointer-events-none h-80 w-80 object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index < 4}
              />
            </div>
            </Link>

            <h3 className="mt-4 px-2 text-center text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 md:text-2xl">
              {item?.name}
            </h3>
          </DraggableCardBody>
        );
      })}
    </DraggableCardContainer>
  );
}