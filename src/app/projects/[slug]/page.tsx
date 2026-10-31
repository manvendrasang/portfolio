import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArchitecturePreview from "@/components/ArchitecturePreview";
import { bySlug, projects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

const back = { ai: ["/ai/", "AI Projects"], web: ["/web/", "Web Development"], "3d": ["/3d/", "3D Projects"] } as const;

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const [href, label] = back[p.category];

  return (
    <article className="wrap detail">
      <header className="page-head">
        <p className="crumbs">
          <Link href="/">Launchpad</Link> / <Link href={href}>{label}</Link> / {p.title}
        </p>
        <p className="status">{p.status}</p>
        <h1>{p.title}</h1>
        <p className="lede">{p.summary}</p>
        <div className="row">
          {p.preview && <ArchitecturePreview label={p.preview.label} title={p.title} src={p.preview.src} alt={p.preview.alt} />}
          <Link className="btn ghost" href={href}>Back to {label}</Link>
        </div>
      </header>

      {p.video && (
        <section className="detail-block">
          <video className="detail-video" src={p.video} controls muted loop playsInline preload="metadata" />
        </section>
      )}

      <section className="detail-block" aria-labelledby="what">
        {p.metric && (
          <p className="detail-metric">
            <span className="metric">{p.metric.value}</span> <span className="meta">{p.metric.label}</span>
          </p>
        )}
        <h2 id="what">What it does</h2>
        <ul className="feature-grid">
          {p.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="detail-block" aria-labelledby="stack">
        <h2 id="stack">Built with</h2>
        <div>
          {p.stack.map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>
      </section>
    </article>
  );
}
