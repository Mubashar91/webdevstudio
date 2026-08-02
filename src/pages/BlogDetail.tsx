import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  pageGraph,
  SITE_NAME,
} from "@/lib/seo";
import { findBlogPost, readTimeOf } from "@/data/blogs";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { CARD_IMAGE, optimizedImage } from "@/lib/images";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? findBlogPost(slug) : undefined;

  useSEO({
    title: post
      ? `${post.title} | ${SITE_NAME}`
      : `Article Not Found | ${SITE_NAME}`,
    description: post?.excerpt ?? "The requested blog article could not be found.",
    canonical: slug ? canonicalPath(`/blogs/${slug}`) : undefined,
    ogImage: post?.coverImage,
    ogType: "article",
    noindex: !post,
    structuredData: post
      ? pageGraph("/blogs", [
          {
            "@type": "BlogPosting",
            "@id": `${canonicalPath(`/blogs/${post.slug}`)}#article`,
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            // Google treats a missing dateModified as "never updated".
            // Falling back to publish date is accurate and avoids the gap.
            dateModified: post.updatedAt ?? post.publishedAt,
            url: canonicalPath(`/blogs/${post.slug}`),
            mainEntityOfPage: canonicalPath(`/blogs/${post.slug}`),
            // A named human author, not the Organization. Google's guidance
            // for E-E-A-T expects articles to be attributed to a person with
            // a resolvable identity — which the Person node in the graph
            // provides via sameAs links.
            author: { "@id": `${canonicalPath("/")}#founder` },
            publisher: { "@id": `${canonicalPath("/")}#organization` },
            keywords: post.tags.join(", "),
            articleSection: post.category,
            wordCount: post.content.join(" ").split(/\s+/).length,
            inLanguage: "en",
          },
          breadcrumbNodeFor([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
            { name: post.title, path: `/blogs/${post.slug}` },
          ]),
        ])
      : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main id="main-content" className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Button onClick={() => navigate("/blogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <article className="container mx-auto px-6 py-12 max-w-3xl">
          <Button variant="ghost" onClick={() => navigate("/blogs")} className="mb-8 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <Badge>{post.category}</Badge>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTimeOf(post)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>

          {/* Visible byline. The BlogPosting schema already names an author,
              but nothing on the rendered page did — so a human (or an AI
              summarising the page) had no attribution to read. E-E-A-T is
              judged on what's visible, not only on markup. */}
          <div className="flex items-center gap-3 pb-8 mb-10 border-b border-border/40">
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-violet-600
                flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            >
              MS
            </div>
            <div className="text-sm">
              <p className="font-bold">
                <Link to="/about" className="hover:text-primary transition-colors">
                  Muhammad Mubashar Shahzad
                </Link>
              </p>
              <p className="text-muted-foreground">
                Founder &amp; lead developer at WebDevStudio — React, TypeScript and MERN
              </p>
            </div>
          </div>

          <img
            src={optimizedImage(post.coverImage)}
            alt={post.title}
            width={CARD_IMAGE.width}
            height={CARD_IMAGE.height}
            loading="eager"
            fetchPriority="high"
            className="w-full aspect-video object-cover rounded-2xl mb-10 border border-border/50 shadow-card"
          />

          {/* Structured blocks rather than plain paragraphs, so posts can carry
              headings, lists and code. Headings render as h2 — the page h1 is
              the title above, so this keeps the outline correct. */}
          <div className="max-w-none">
            {post.content.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return (
                    <h2
                      key={i}
                      className="text-2xl md:text-3xl font-extrabold tracking-tight mt-12 mb-4 scroll-mt-24"
                    >
                      {block.text}
                    </h2>
                  );
                case "p":
                  return (
                    <p key={i} className="text-foreground/90 leading-relaxed mb-5">
                      {block.text}
                    </p>
                  );
                case "list":
                  return (
                    <ul key={i} className="mb-6 space-y-2.5">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-foreground/90 leading-relaxed">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case "code":
                  return (
                    <div key={i} className="mb-6 rounded-xl border border-border/50 overflow-hidden bg-[hsl(224,32%,10%)]">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                          {block.lang}
                        </span>
                      </div>
                      {/* overflow-x-auto on the pre keeps long lines scrollable
                          inside the block instead of widening the page. */}
                      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
                        <code className="font-mono text-white/85 whitespace-pre">{block.code}</code>
                      </pre>
                    </div>
                  );
              }
            })}
          </div>

          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/40">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Contextual internal links. An audit found zero in-body links
              connecting posts to the commercial pages — so a reader who
              finished an article had nowhere to go, and no link equity flowed
              to /services or the case studies. */}
          <nav aria-label="Related pages" className="mt-10 pt-8 border-t border-border/40">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground mb-4">
              Related
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-primary hover:underline font-medium">
                  Web development services &amp; pricing
                </Link>
                <span className="text-muted-foreground"> — fixed quotes from $900</span>
              </li>
              <li>
                <Link to="/projects" className="text-primary hover:underline font-medium">
                  Recent {post.category} work
                </Link>
                <span className="text-muted-foreground"> — case studies and the stacks behind them</span>
              </li>
              <li>
                <Link to="/blogs" className="text-primary hover:underline font-medium">
                  More articles on React, TypeScript and MERN
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-10 p-6 rounded-2xl bg-muted/40 border border-border/50">
            <p className="text-muted-foreground mb-4">
              Interested in working together on a React or MERN project?
            </p>
            <Button asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
