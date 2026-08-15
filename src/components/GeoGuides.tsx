import { Link } from "react-router-dom";
import { findBlogPost, readTimeOf } from "@/data/blogs";

interface GeoGuidesProps {
  heading: string;
  intro: string;
  /**
   * Post slugs, most relevant first. Unknown slugs are dropped rather than
   * rendered, so deleting or renaming a post can't leave a dead link on a
   * commercial page — the geo pages are the ones that must never 404.
   */
  slugs: string[];
}

/**
 * Market-specific reading list for a geo landing page.
 *
 * An Aug 2026 audit found each geo page linked exactly ONE blog post while
 * the archive held several for that market. The geo pages are the strongest
 * commercial pages on the site, so that's both wasted link equity and a
 * reader who has just decided they want pricing detail being shown only one
 * of the four articles that answer them.
 *
 * Titles and read times are read from BLOG_POSTS rather than duplicated
 * here, so editing a post title updates every geo page automatically.
 */
export const GeoGuides = ({ heading, intro, slugs }: GeoGuidesProps) => {
  const posts = slugs
    .map((slug) => findBlogPost(slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  if (posts.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">{intro}</p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blogs/${post.slug}`}
                className="group block h-full p-4 rounded-xl border border-border/50
                  hover:border-primary/50 hover:bg-muted/40 transition-colors"
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {post.category}
                </span>
                <span className="block font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </span>
                <span className="block text-xs text-muted-foreground mt-1">
                  {readTimeOf(post)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
