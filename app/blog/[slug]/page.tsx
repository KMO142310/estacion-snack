import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StaticLayout from '@/components/StaticLayout';
import { safeJsonLd } from '@/lib/json-ld';
import { absoluteUrl, buildMetaDescription } from '@/lib/site';
import { buildBlogPostingJsonLd, formatBlogDate, getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { getProducts } from '@/lib/products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Blog' };
  }

  const description = buildMetaDescription(post.description);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} · Estación Snack`,
      description,
    },
    twitter: {
      title: `${post.title} · Estación Snack`,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const products = getProducts();
  const relatedProducts = post.relatedProductSlugs
    .map((productSlug) => products.find((product) => product.slug === productSlug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const relatedLinks = post.relatedLinks ?? [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  const articleJsonLd = buildBlogPostingJsonLd(post);

  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <main style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <article className="wrap" style={{ maxWidth: 840 }}>
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: '0.8125rem', color: '#5E6B3E', marginBottom: '2rem', display: 'flex', gap: '0.375rem', fontFamily: 'var(--font-body)', flexWrap: 'wrap' }}
          >
            <Link href="/" style={{ color: '#5E6B3E' }}>Inicio</Link>
            <span>›</span>
            <Link href="/blog" style={{ color: '#5E6B3E' }}>Blog</Link>
            <span>›</span>
            <span style={{ color: '#5A1F1A', fontWeight: 600 }}>{post.title}</span>
          </nav>

          <header style={{ marginBottom: '2.5rem' }}>
            <p style={{ margin: '0 0 0.8rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A8411A' }}>
              {post.category}
            </p>
            <h1 style={{ margin: '0 0 1rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem, 6vw, 3.5rem)', lineHeight: 1.04, letterSpacing: '-0.03em', color: '#5A1F1A' }}>
              {post.title}
            </h1>
            <p style={{ margin: '0 0 1rem', fontSize: '1.03rem', lineHeight: 1.8, color: '#5E6B3E' }}>
              {post.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.84rem', fontWeight: 700, color: '#A8411A' }}>
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className="blog-article">
            {post.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {post.sections.map((section) => (
              <section key={section.heading} className="blog-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          {(relatedProducts.length > 0 || relatedLinks.length > 0) && (
            <section className="blog-box">
              <p className="blog-box-kicker">Qué mirar también</p>
              <div className="blog-chip-row">
                {relatedProducts.map((product) => (
                  <Link key={product.slug} href={`/producto/${product.slug}`} className="blog-chip">
                    {product.name}
                  </Link>
                ))}
                {relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="blog-chip">
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="blog-box">
            <p className="blog-box-kicker">Siguiente paso</p>
            <h2 className="blog-box-title">Si ya sabes qué mirar, puedes armar el pedido desde el catálogo.</h2>
            <p className="blog-box-copy">
              Ves precios reales, sumas bolsas o packs y lo confirmamos por WhatsApp para Santa Cruz y comunas cercanas.
            </p>
            <div className="blog-action-row">
              <Link href="/#productos" className="blog-primary-link">Ver productos</Link>
              <a href="https://wa.me/56953743338?text=Hola%20Estaci%C3%B3n%20Snack,%20tengo%20una%20consulta" target="_blank" rel="noopener noreferrer" className="blog-secondary-link">Hacer una consulta</a>
            </div>
          </section>
        </article>

        <style>{`
          .blog-article p {
            margin: 0 0 1rem;
            font-size: 1rem;
            line-height: 1.85;
            color: #5E6B3E;
          }
          .blog-section {
            margin-top: 2rem;
          }
          .blog-section h2 {
            margin: 0 0 0.85rem;
            font-size: clamp(1.35rem, 4vw, 2rem);
            line-height: 1.12;
            color: #5A1F1A;
          }
          .blog-box {
            margin-top: 2.25rem;
            padding: 1.4rem;
            border-radius: 24px;
            background: rgba(255,255,255,0.88);
            border: 1px solid rgba(90,31,26,0.08);
            box-shadow: 0 16px 36px -30px rgba(90,31,26,0.18);
          }
          .blog-box-kicker {
            margin: 0 0 0.7rem;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #A8411A;
          }
          .blog-box-title {
            margin: 0 0 0.75rem;
            font-size: clamp(1.4rem, 4vw, 2rem);
            line-height: 1.12;
            color: #5A1F1A;
          }
          .blog-box-copy {
            margin: 0;
            font-size: 0.96rem;
            line-height: 1.75;
            color: #5E6B3E;
          }
          .blog-chip-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem;
          }
          .blog-chip {
            min-height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 0.95rem;
            border-radius: 999px;
            border: 1px solid rgba(90,31,26,0.12);
            background: rgba(255,255,255,0.82);
            color: #5A1F1A;
            font-size: 0.9rem;
            font-weight: 700;
            text-decoration: none;
          }
          .blog-action-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-top: 1rem;
          }
          .blog-primary-link,
          .blog-secondary-link {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            border-radius: 999px;
            font-size: 0.9rem;
            font-weight: 700;
            text-decoration: none;
          }
          .blog-primary-link {
            background: #5A1F1A;
            color: #F4EADB;
          }
          .blog-secondary-link {
            border: 1px solid rgba(90,31,26,0.14);
            color: #5A1F1A;
            background: rgba(255,255,255,0.7);
          }
        `}</style>
      </main>
    </StaticLayout>
  );
}
