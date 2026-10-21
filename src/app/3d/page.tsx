import type { Metadata } from "next";
import Link from "next/link";
import { byCategory } from "@/lib/content";
import { PageHead, ProjectCard } from "@/components/Parts";

export const metadata: Metadata = {
  title: "3D Projects",
  description: "Blender and Godot work by Manvendra Sang.",
};

export default function ThreeDPage() {
  const items = byCategory("3d");
  return (
    <>
      <PageHead
        eyebrow="Render Dimension"
        title="3D projects"
        lede="Blender for modeling and renders, Godot for interactive scenes. Finished pieces will appear here with breakdowns."
      />
      <section className="section wrap" aria-labelledby="three-d-work">
        <h2 id="three-d-work">Renders and scenes (preview only)</h2>
        {items.length > 0 ? (
          <div className="grid">
            {items.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>The render queue is loading</h3>
            <p>No 3D pieces are published yet. The scene behind this page is rendered live in your browser while you wait.</p>
            <p>
              Tools in the pipeline: <span className="chip">Blender</span> <span className="chip">Godot</span>
            </p>
            <Link className="btn ghost" href="/contact/">Ask about 3D work</Link>
          </div>
        )}
      </section>
    </>
  );
}
