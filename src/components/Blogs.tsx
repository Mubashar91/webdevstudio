import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { BLOG_POSTS, readTimeOf } from "@/data/blogs";
import { CARD_IMAGE, optimizedImage } from "@/lib/images";

interface BlogsProps {
  compactHeader?: boolean;
}

export const Blogs = ({ compactHeader = false }: BlogsProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });
  const posts = BLOG_POSTS.slice(0, compactHeader ? BLOG_POSTS.length : 3);

  return (
    <section id="blog" className={`relative overflow-hidden ${compactHeader ? "py-20" : "py-28"}`}>
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute -top-48 right-1/4 w-[700px] h-[700px] bg-violet-500/8 rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {compactHeader && (
          /* Keeps the heading outline intact when the visible section
             heading is hidden — the card <h3>s would otherwise follow
             the page <h1> directly and skip a level. */
          <h2 className="sr-only">Latest articles</h2>
        )}

        {!compactHeader && (
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="section-label mb-8">
              <BookOpen className="h-5 w-5" />
              Insights
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Latest{" "}
              <span className="gradient-text">Blog Posts</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Notes on React, TypeScript, and MERN stack development from real project work.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={`tilt-card group flex flex-col rounded-2xl overflow-hidden border border-border/50 bg-card shadow-card
                hover:border-primary/40 hover:shadow-card-hover
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link to={`/blogs/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                <img
                  src={optimizedImage(post.coverImage)}
                  alt={post.title}
                  width={CARD_IMAGE.width}
                  height={CARD_IMAGE.height}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/90 text-white">
                  {post.category}
                </span>
              </Link>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readTimeOf(post)}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                  <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                <Button size="sm" variant="ghost" className="w-fit h-11 md:h-9 text-xs font-bold gap-1.5 rounded-xl" asChild>
                  <Link to={`/blogs/${post.slug}`}>
                    Read article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {!compactHeader && (
          <div
            className={`text-center mt-14 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link to="/blogs">
              <Button
                variant="outline"
                size="lg"
                className="px-10 h-12 border-border/55 hover:border-primary/45 hover:bg-primary/5 font-bold gap-2.5 rounded-2xl"
              >
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
