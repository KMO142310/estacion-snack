import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

const posts = getBlogPosts().slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="bp">
      <div className="bp-wrap">
        <header className="bp-head">
          <p className="bp-kicker">Blog</p>
          <h2 className="bp-title">Guías cortas para elegir mejor y pedir con más claridad.</h2>
          <p className="bp-sub">
            Notas simples sobre qué conviene pedir primero, cómo guardar mejor las bolsas y qué combinaciones funcionan según la ocasión.
          </p>
        </header>

        <div className="bp-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bp-card">
              <p className="bp-card-cat">{post.category}</p>
              <h3 className="bp-card-title">{post.title}</h3>
              <p className="bp-card-copy">{post.excerpt}</p>
              <div className="bp-card-meta">
                <span>{post.readTime}</span>
                <span>Leer nota</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bp-foot">
          <Link href="/blog" className="bp-link">Ver todas las notas</Link>
        </div>
      </div>

      <style>{`
        .bp {
          padding: 4.5rem 0;
          background: linear-gradient(180deg, rgba(255,249,241,0.98) 0%, rgba(247,241,231,0.72) 100%);
          border-top: 1px solid rgba(90,31,26,0.08);
          border-bottom: 1px solid rgba(90,31,26,0.08);
        }
        .bp-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .bp-head {
          max-width: 760px;
          margin: 0 auto 2rem;
          text-align: center;
        }
        .bp-kicker {
          margin: 0 0 0.7rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8411A;
        }
        .bp-title {
          margin: 0 0 0.9rem;
          font-size: clamp(1.9rem, 5vw, 2.7rem);
          line-height: 1.05;
          color: #5A1F1A;
          letter-spacing: -0.03em;
        }
        .bp-sub {
          margin: 0 auto;
          max-width: 60ch;
          font-size: 0.97rem;
          line-height: 1.75;
          color: #5E6B3E;
        }
        .bp-grid {
          display: grid;
          gap: 1rem;
        }
        .bp-card {
          display: block;
          padding: 1.35rem;
          border-radius: 24px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(90,31,26,0.08);
          box-shadow: 0 16px 36px -30px rgba(90,31,26,0.28);
          text-decoration: none;
        }
        .bp-card-cat {
          margin: 0 0 0.65rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(168,65,26,0.85);
        }
        .bp-card-title {
          margin: 0 0 0.7rem;
          font-size: 1.22rem;
          line-height: 1.15;
          color: #5A1F1A;
        }
        .bp-card-copy {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: #5E6B3E;
        }
        .bp-card-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 0.95rem;
          border-top: 1px solid rgba(90,31,26,0.08);
          font-size: 0.82rem;
          font-weight: 700;
          color: #A8411A;
        }
        .bp-foot {
          margin-top: 1.35rem;
          text-align: center;
        }
        .bp-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 1rem;
          border-radius: 999px;
          border: 1px solid rgba(90,31,26,0.14);
          color: #5A1F1A;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          background: rgba(255,255,255,0.7);
        }
        @media (min-width: 768px) {
          .bp {
            padding: 5rem 0;
          }
          .bp-wrap {
            padding: 0 1.5rem;
          }
          .bp-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
