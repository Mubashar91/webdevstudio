import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  eyebrow?: string;
}

/**
 * Visible FAQ section, matching the accordion used on the location pages.
 *
 * Pair this with FAQPage schema for the same route: Google requires that every
 * question and answer in the markup is also visible on the page, so a route
 * with `faqs` in site.config.mjs must render this component.
 */
export const FAQ = ({
  items,
  title = "Frequently Asked Questions",
  eyebrow = "FAQ",
}: FAQProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  if (items.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/40">
      <div
        ref={ref}
        className={`container mx-auto px-6 max-w-3xl transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="section-label mb-6 mx-auto w-fit">
          <HelpCircle className="h-4 w-4" />
          {eyebrow}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-center">
          {title}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
