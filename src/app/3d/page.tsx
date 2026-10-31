import type { Metadata } from "next";
import { byCategory } from "@/lib/content";
import { PageHead } from "@/components/Parts";
import RenderCarousel from "@/components/RenderCarousel";

export const metadata: Metadata = {
  title: "3D Projects",
  description: "Blender and Godot work by Manvendra Sang.",
};

export default function ThreeDPage() {
  return (
    <>
      <PageHead
        eyebrow="Render Dimension"
        title="3D projects"
        lede="Blender for modeling and renders, Godot for interactive scenes. Use the arrows, swipe, or the up and down keys to move through the renders."
      />
      <section className="section wrap" aria-labelledby="three-d-work">
        <h2 id="three-d-work">Renders</h2>
        <RenderCarousel items={byCategory("3d")} />
      </section>
    </>
  );
}
