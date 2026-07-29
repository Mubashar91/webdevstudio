import { Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { LocationHighlights } from "@/components/LocationHighlights";
import { Services as ServicesSection } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath, faqSchema } from "@/lib/seo";

const faqs = [
  {
    question: "Do you work with businesses based in New Zealand?",
    answer:
      "Yes. I'm a remote frontend/MERN stack developer based in Pakistan, currently working with clients across New Zealand, Australia, the UK and beyond. All collaboration happens online — video calls, Slack/email, and shared project boards — so location is never a blocker.",
  },
  {
    question: "How do we handle the time zone difference?",
    answer:
      "Pakistan Standard Time is roughly 7–8 hours behind New Zealand. In practice this works in your favour: I typically work while it's evening/overnight in NZ, so tasks logged today are often progressed or completed by the time your team starts the next business day. We agree on a short overlap window (early NZ morning) for calls when needed.",
  },
  {
    question: "What currency and payment methods do you accept?",
    answer:
      "I invoice in USD or NZD via bank transfer, Wise, or PayPal — whichever is easiest on your end. Rates are quoted upfront with a clear scope, so there are no surprises.",
  },
  {
    question: "Can you match New Zealand business hours for calls?",
    answer:
      "Yes — I keep flexible hours specifically to overlap with NZ mornings (NZST/NZDT) for stand-ups, demos, or planning sessions when live discussion is useful.",
  },
  {
    question: "Do you sign contracts and NDAs?",
    answer:
      "Absolutely. I'm happy to work under your standard contract, NDA, or IP assignment terms before any project details are shared.",
  },
];

const valueProps = [
  {
    icon: Clock,
    title: "Overnight Delivery Workflow",
    description:
      "The time zone gap becomes an advantage — hand off tasks before you log off, review progress the next NZ morning.",
  },
  {
    icon: Coins,
    title: "Transparent, Competitive Rates",
    description:
      "Fixed-price or hourly quotes in USD/NZD, without the overhead of a local NZ agency — same senior-level React/MERN craftsmanship.",
  },
  {
    icon: MessagesSquare,
    title: "Clear English Communication",
    description:
      "Daily written updates, async-friendly reporting, and scheduled calls in your morning so nothing gets lost in translation.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable, Contract-Based Delivery",
    description:
      "NDAs, fixed milestones, and unlimited revisions within scope — built for teams who need dependable remote execution.",
  },
];

const industries = ["SaaS & Startups", "E-commerce", "Tourism & Hospitality", "Agritech", "Professional Services"];

const WebDevelopmentNewZealand = () => {
  useSEO({
    title: "Web Developer for New Zealand Businesses | React & MERN Stack — WebDevStudio",
    description:
      "Remote React.js & MERN stack developer serving New Zealand businesses — Auckland, Wellington, Christchurch & beyond. 5+ years experience, transparent NZD/USD pricing, overnight delivery workflow.",
    keywords:
      "web developer New Zealand, hire React developer New Zealand, MERN stack developer NZ, remote web developer Auckland, web development Wellington, freelance developer New Zealand",
    canonical: canonicalPath("/web-development-new-zealand"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Web Development Services for New Zealand Businesses",
        description:
          "Remote React.js, MERN stack, and full-stack web development for businesses in New Zealand, delivered by WebDevStudio.",
        url: canonicalPath("/web-development-new-zealand"),
        provider: { "@type": "Organization", name: "WebDevStudio" },
        areaServed: { "@type": "Country", name: "New Zealand" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web Development Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full-Stack MERN Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "React.js Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Node.js Backend Development" } },
          ],
        },
      },
      faqSchema(faqs),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Web Development New Zealand", path: "/web-development-new-zealand" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Development for"
          highlight="New Zealand"
          description="Remote React.js & MERN stack development for New Zealand businesses — senior-level execution, transparent pricing, and a workflow built around your time zone."
          breadcrumbs={[{ label: "Web Development New Zealand" }]}
        />
        <LocationHighlights
          countryName="New Zealand"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        />
        <ServicesSection compactHeader />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentNewZealand;
