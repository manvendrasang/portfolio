"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import type { Project } from "@/lib/content";

/** Card that leans toward the pointer. Mouse only, capped at a few degrees. */
export default function ProjectCard({ p }: { p: Project }) {
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const leave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  };

  return (
    <article className="card tilt link" onPointerMove={move} onPointerLeave={leave}>
      <p className="status">{p.status}</p>
      <h3>
        <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
      </h3>
      {p.metric && (
        <p>
          <span className="metric">{p.metric.value}</span> <small>{p.metric.label}</small>
        </p>
      )}
      <p>{p.summary}</p>
      <div>
        {p.stack.map((s) => (
          <span className="tag" key={s}>{s}</span>
        ))}
      </div>
    </article>
  );
}
