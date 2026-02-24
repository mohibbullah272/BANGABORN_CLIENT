import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Orders & Delivery",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Delivery usually takes 2–5 business days depending on your location in Bangladesh. You will receive a confirmation call before dispatch.",
      },
      {
        question: "Do you offer Cash on Delivery?",
        answer:
          "Yes, we offer Cash on Delivery nationwide. You can pay when the product reaches your doorstep.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes. Once your order is shipped, our team will provide tracking details via phone or SMS.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    questions: [
      {
        question: "What is your refund policy?",
        answer:
          "If you receive a damaged or incorrect product, you can request a return within 3 days of delivery. Our team will guide you through the process.",
      },
      {
        question: "How long does it take to receive a refund?",
        answer:
          "Refunds are processed after product verification and are usually completed within 5–7 business days.",
      },
    ],
  },
  {
    title: "Products & Sizing",
    questions: [
      {
        question: "How do I choose the right size?",
        answer:
          "Each product includes a detailed size chart. Please check measurements carefully before placing your order.",
      },
      {
        question: "Are your fabrics premium quality?",
        answer:
          "Yes. We carefully select comfortable, breathable, and durable fabrics to ensure long-lasting wear.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
             Need Help? We've Got Answers.
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
             Need Help? We've Got Answers.
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
            Have more questions about orders, delivery, or returns? 
Get in touch with our support team.
        
          
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
