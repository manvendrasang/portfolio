import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <header className="page-head" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <p className="crumbs">
          <Link href="/">Launchpad</Link> / <Link href={href}>{label}</Link> / {p.title}
        </p>
        <p className="status">{p.status}</p>
        <h1>{p.title}</h1>
        <p className="lede">{p.summary}</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        {p.metric && (
          <p>
            <span className="metric">{p.metric.value}</span> <span className="meta">{p.metric.label}</span>
          </p>
        )}
        <h2>What it does</h2>
        <ul>
          {p.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h2 style={{ marginTop: 32 }}>Built with</h2>
        <div>
          {p.stack.map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>
        {p.links && p.links.length > 0 && (
          <>
            <h2 style={{ marginTop: 32 }}>Links</h2>
            <div className="row">
              {p.links.map((l) => (
                <a className="btn ghost" key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              ))}
            </div>
          </>
        )}
        <p style={{ marginTop: 40 }}>
          <Link className="btn ghost" href={href}>Back to {label}</Link>
        </p>
      </section>
    </article>
  );
}
