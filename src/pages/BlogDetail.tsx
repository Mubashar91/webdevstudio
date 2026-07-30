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
import { findBlogPost } from "@/data/blogs";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

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
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{post.excerpt}</p>

          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl mb-10 border border-border/50 shadow-card"
          />

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-5">
            {post.content.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/40">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-muted/40 border border-border/50">
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
