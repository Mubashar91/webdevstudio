import { LucideIcon, HelpCircle } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface LocationValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LocationFAQ {
  question: string;
  answer: string;
}

interface LocationHighlightsProps {
  countryName: string;
  valueProps: LocationValueProp[];
  industries: string[];
  faqs: LocationFAQ[];
}

export const LocationHighlights = ({
  countryName,
  valueProps,
  industries,
  faqs,
}: LocationHighlightsProps) => {
  const [valuesRef, valuesVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [faqRef, faqVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <>
      {/* Value props */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
        <div
          ref={valuesRef}
          className={`container mx-auto px-6 relative z-10 transition-all duration-700 ${
            valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Why {countryName} Businesses{" "}
              <span className="gradient-text">Work With Me</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              A remote React &amp; MERN stack developer, working entirely online with
              clients around the world — including {countryName}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {valueProps.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-card
                  hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/30
                  transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          {industries.length > 0 && (
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground/50 mb-5">
                Industries I Build For
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-primary/8 border border-primary/15 text-primary"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border/40">
        <div
          ref={faqRef}
          className={`container mx-auto px-6 max-w-3xl transition-all duration-700 ${
            faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="section-label mb-6 mx-auto w-fit">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-center">
            Common Questions from {countryName} Clients
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
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
    </>
  );
};
