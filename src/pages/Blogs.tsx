import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Blogs as BlogsSection } from "@/components/Blogs";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbNodeFor, canonicalPath, pageGraph, routeMeta } from "@/lib/seo";
import { BLOG_POSTS } from "@/data/blogs";

const meta = routeMeta("/blogs")!;

const Blogs = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/blogs"),
    structuredData: pageGraph("/blogs", [
      {
        "@type": "Blog",
        "@id": `${canonicalPath("/blogs")}#blog`,
        name: "WebDevStudio — Developer Blog",
        description: "Articles on React, TypeScript, and MERN stack development.",
        url: canonicalPath("/blogs"),
        publisher: { "@id": `${canonicalPath("/")}#organization` },
        blogPost: BLOG_POSTS.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${canonicalPath(`/blogs/${post.slug}`)}#article`,
          headline: post.title,
          description: post.excerpt,
          url: canonicalPath(`/blogs/${post.slug}`),
          // image, dateModified and publisher are all required for Article
          // rich-result eligibility; without them these entries could never
          // qualify no matter how good the content was.
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          keywords: post.tags.join(", "),
          author: { "@id": `${canonicalPath("/")}#founder` },
          publisher: { "@id": `${canonicalPath("/")}#organization` },
        })),
      },
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blogs" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Developer"
          highlight="Blog"
          description="Practical notes on React, TypeScript, and building scalable MERN applications."
          breadcrumbs={[{ label: "Blog" }]}
        />
        <BlogsSection compactHeader />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
