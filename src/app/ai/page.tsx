import type { Metadata } from "next";
import { byCategory } from "@/lib/content";
import { PageHead, ProjectCard } from "@/components/Parts";

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
          {byCategory("ai").filter((p) => p.slug !== "agentic-it-ticket-manager").map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
      <section className="section wrap" aria-labelledby="ai-insights">
        <h2 id="ai-insights">Key focus areas</h2>
        <ul className="list-plain">
          <li>Agentic AI workflows & ticket triage logic</li>
          <li>Echo State Networks & reservoir computing models</li>
          <li>LLM fine-tuning & RAG pipelines</li>
          <li>RLHF for alignment & retrieval quality</li>
          <li>Edge computing & neuromorphic engineering</li>
        </ul>
      </section>
    </>
  );
}
