import { absoluteUrl, buildMetaDescription } from '@/lib/site';
import { blogPosts, type BlogPost } from '@/data/blog-posts';

const POSTS = blogPosts
  .slice()
  .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

export function getBlogPosts(): BlogPost[] {
  return POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return POSTS.find((post) => post.slug === slug) ?? null;
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function buildBlogPostingJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: buildMetaDescription(post.description),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      '@type': 'Organization',
      name: 'Estación Snack',
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Estación Snack',
      url: absoluteUrl('/'),
    },
    articleSection: post.category,
    keywords: post.relatedProductSlugs.join(', '),
  };
}
