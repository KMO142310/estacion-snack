import type { Metadata } from 'next';
import Link from 'next/link';
import StaticLayout from '@/components/StaticLayout';
import { getBlogPosts } from '@/lib/blog';
import { safeJsonLd } from '@/lib/json-ld';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guías cortas sobre frutos secos, dulces por kilo, conservación y combinaciones para pedir mejor desde Santa Cruz.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · Estación Snack',
    description: 'Guías cortas para elegir mejor, guardar bien y pedir con más claridad en Santa Cruz.',
  },
  twitter: {
    title: 'Blog · Estación Snack',
    description: 'Guías cortas para elegir mejor, guardar bien y pedir con más claridad en Santa Cruz.',
  },
};

const posts = getBlogPosts();

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
  ],
};

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Blog de Estación Snack',
  url: absoluteUrl('/blog'),
  hasPart: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt,
  })),
};

export default function BlogIndexPage() {
  return (
    <StaticLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionJsonLd) }} />
      <main style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="wrap">
          <nav
            aria-label="Ruta de navegación"
            style={{ fontSize: '0.8125rem', color: '#5E6B3E', marginBottom: '2rem', display: 'flex', gap: '0.375rem', fontFamily: 'var(--font-body)' }}
          >
            <Link href="/" style={{ color: '#5E6B3E' }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: '#5A1F1A', fontWeight: 600 }}>Blog</span>
          </nav>

          <header style={{ maxWidth: 720, marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#A8411A', marginBottom: '0.75rem' }}>
              Blog
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', lineHeight: 1.06, fontWeight: 600, color: '#5A1F1A', marginBottom: '1rem' }}>
              Notas útiles para elegir mejor y pedir sin vueltas.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75, color: '#5E6B3E' }}>
              Guías cortas sobre frutos secos, dulces por kilo, conservación y combinaciones simples para casa, oficina o cumpleaños.
            </p>
          </header>

          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <p className="blog-card-kicker">{post.category}</p>
                <h2 className="blog-card-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-copy">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.readTime}</span>
                  <Link href={`/blog/${post.slug}`}>Leer nota</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <style>{`
          .blog-grid {
            display: grid;
            gap: 1rem;
          }
          .blog-card {
            padding: 1.4rem;
            border-radius: 24px;
            background: rgba(255,255,255,0.88);
            border: 1px solid rgba(90,31,26,0.08);
            box-shadow: 0 16px 36px -30px rgba(90,31,26,0.22);
          }
          .blog-card-kicker {
            margin: 0 0 0.7rem;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #A8411A;
          }
          .blog-card-title {
            margin: 0 0 0.8rem;
            font-size: 1.3rem;
            line-height: 1.12;
            color: #5A1F1A;
          }
          .blog-card-title a {
            color: inherit;
            text-decoration: none;
          }
          .blog-card-copy {
            margin: 0;
            font-size: 0.94rem;
            line-height: 1.72;
            color: #5E6B3E;
          }
          .blog-card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(90,31,26,0.08);
            font-size: 0.84rem;
            font-weight: 700;
            color: #A8411A;
          }
          .blog-card-meta a {
            color: #A8411A;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          @media (min-width: 768px) {
            .blog-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 1.25rem;
            }
          }
        `}</style>
      </main>
    </StaticLayout>
  );
}
