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
    question: "Do you work with businesses based in Cyprus?",
    answer:
      "Yes. I'm a remote frontend/MERN stack developer based in Pakistan, working with clients across Cyprus, the wider EU, and the UK. All collaboration happens online — video calls, Slack/email, and shared project boards — so location is never a blocker.",
  },
  {
    question: "How much time zone overlap do we get for live calls?",
    answer:
      "Cyprus (EET/EEST) is roughly 2–3 hours behind Pakistan Standard Time, giving us a comfortable working overlap most afternoons for stand-ups, demos, and planning calls — closer real-time collaboration than most offshore arrangements.",
  },
  {
    question: "Can you support EU/GDPR-conscious projects?",
    answer:
      "Yes. I build with data-protection best practices in mind — minimal data collection, secure auth, and clear separation of personal data — and I'm happy to follow your organisation's specific GDPR and compliance requirements as part of the project brief.",
  },
  {
    question: "What currency and payment methods do you accept?",
    answer:
      "I invoice in EUR or USD via bank transfer, Wise, or PayPal. Rates and scope are agreed upfront so there are no surprises mid-project.",
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
    title: "Real Working-Hours Overlap",
    description:
      "A 2–3 hour time zone gap means genuine live collaboration each day — not just async hand-offs.",
  },
  {
    icon: Coins,
    title: "Transparent EUR/USD Pricing",
    description:
      "Fixed-price or hourly quotes without the overhead of a local EU agency — senior-level React/MERN craftsmanship at a fair rate.",
  },
  {
    icon: MessagesSquare,
    title: "Clear English Communication",
    description:
      "Daily written updates and scheduled calls in the shared afternoon window, so nothing gets lost in translation.",
  },
  {
    icon: ShieldCheck,
    title: "GDPR-Conscious Development",
    description:
      "Security and data-protection best practices built in from the start, aligned to EU compliance expectations.",
  },
];

const industries = ["Fintech & Forex", "iGaming & Betting Platforms", "Shipping & Logistics", "E-commerce", "Professional Services"];

const WebDevelopmentCyprus = () => {
  useSEO({
    title: "Web Developer for Cyprus Businesses | React & MERN Stack — WebDevStudio",
    description:
      "Remote React.js & MERN stack developer serving Cyprus businesses — Limassol, Nicosia, Larnaca & beyond. 5+ years experience, EUR/USD pricing, real-time overlap, GDPR-conscious builds.",
    keywords:
      "web developer Cyprus, hire React developer Cyprus, MERN stack developer Cyprus, remote web developer Limassol, web development Nicosia, freelance developer Cyprus, fintech web development Cyprus",
    canonical: canonicalPath("/web-development-cyprus"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Web Development Services for Cyprus Businesses",
        description:
          "Remote React.js, MERN stack, and full-stack web development for businesses in Cyprus, delivered by WebDevStudio.",
        url: canonicalPath("/web-development-cyprus"),
        provider: { "@type": "Organization", name: "WebDevStudio" },
        areaServed: { "@type": "Country", name: "Cyprus" },
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
        { name: "Web Development Cyprus", path: "/web-development-cyprus" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Development for"
          highlight="Cyprus"
          description="Remote React.js & MERN stack development for Cyprus businesses — senior-level execution, real-time working overlap, and EUR/USD pricing."
          breadcrumbs={[{ label: "Web Development Cyprus" }]}
        />
        <LocationHighlights
          countryName="Cyprus"
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

export default WebDevelopmentCyprus;
