import { Star, Quote } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const testimonials = [
  { name: "Sarah Johnson",  role: "CEO, TechStart Inc.",        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", content: "Outstanding work! The MERN stack application was delivered on time and exceeded our expectations. The attention to detail and code quality is exceptional.", rating: 5 },
  { name: "Michael Chen",   role: "Product Manager, InnovateCo",image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", content: "Working with Mubashar was a game-changer for our project. The React dashboard is fast, responsive, and our users love it. Highly recommend!", rating: 5 },
  { name: "Emily Rodriguez", role: "Founder, Digital Solutions", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", content: "Professional, responsive, and incredibly talented. The Node.js backend architecture is solid and scalable. Will definitely work together again!", rating: 5 },
  { name: "David Thompson", role: "CTO, CloudSystems",          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", content: "The best developer I've worked with. Clean code, excellent communication, and a deep understanding of modern web technologies. A true professional.", rating: 5 },
  { name: "Lisa Anderson",  role: "Marketing Director, GrowthHub",image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", content: "Our e-commerce platform is now lightning fast and conversion rates have doubled. The Stripe integration was seamless. Couldn't be happier!", rating: 5 },
  { name: "James Wilson",   role: "VP Engineering, DataFlow",   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", content: "Exceptional technical skills combined with great problem-solving abilities. The real-time features using Socket.io work perfectly. Highly skilled!", rating: 5 },
];

export const Testimonials = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-section-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-violet-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="section-label bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 mb-5">
            <Star className="h-4 w-4 fill-current" />
            Client Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            What Clients{" "}
            <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take my word for it — hear from clients who've experienced the difference
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`tilt-card group relative flex flex-col rounded-2xl border border-border/50 bg-card p-6
                hover:border-primary/30 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Large quote mark */}
              <Quote className="absolute top-4 right-4 h-12 w-12 text-primary/6 group-hover:text-primary/12 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6 relative z-10">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-border/40">
                <div className="relative flex-shrink-0">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-border/60
                      group-hover:ring-primary/40 transition-all duration-300"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full
                    bg-green-500 border-2 border-card" />
                </div>
                <div>
                  <p className="font-bold text-sm group-hover:text-primary transition-colors">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>

              {/* Hover gradient wash */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/3 to-violet-500/3
                opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
