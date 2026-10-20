import type { Metadata } from "next";
import { byCategory, roles } from "@/lib/content";
import { PageHead, ProjectCard, Timeline } from "@/components/Parts";

export const metadata: Metadata = {
  title: "AI Projects",
  description: "Agents, reservoir computing, RAG, RLHF, and LLM fine-tuning work by Manvendra Sang.",
};

export default function AiPage() {
  return (
    <>
      <PageHead
        eyebrow="Neural Nebula"
        title="AI projects"
        lede="Agents that triage work, reservoir networks that read brain signals, and retrieval pipelines that keep language models grounded."
      />
      <section className="section wrap" aria-labelledby="ai-projects">
        <h2 id="ai-projects">Projects</h2>
        <div className="grid">
          {byCategory("ai").map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
      <section className="section wrap" aria-labelledby="ai-research">
        <h2 id="ai-research">Research behind the projects</h2>
        <Timeline roles={roles.filter((r) => r.category === "ai")} />
      </section>
    </>
  );
}
