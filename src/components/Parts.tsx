import type { Role } from "@/lib/content";

export function PageHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="page-head wrap">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
    </header>
  );
}

export { default as ProjectCard } from "./ProjectCard";

export function Timeline({ roles }: { roles: Role[] }) {
  return (
    <div className="timeline">
      {roles.map((r) => (
        <article key={r.title + r.dates}>
          <p className="meta">{r.dates}</p>
          <h3>{r.title}</h3>
          <p className="meta" style={{ color: "var(--muted)" }}>{r.org}, {r.place}</p>
          <ul>
            {r.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
