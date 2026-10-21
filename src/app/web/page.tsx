import type { Metadata } from "next";
import { byCategory, roles, skills } from "@/lib/content";
import { PageHead, ProjectCard, Timeline } from "@/components/Parts";

export const metadata: Metadata = {
  title: "Web Development",
  description: "MERN apps, TypeScript migrations, and full-stack work by Manvendra Sang.",
};

export default function WebPage() {
  const webSkills = skills[0].items.concat(skills[1].items.filter((i) => ["MongoDB", "MySQL", "REST APIs"].includes(i)));
  return (
    <>
      <PageHead
        eyebrow="Pixel Midway"
        title="Web development"
        lede="Full-stack applications on the MERN stack, plus production frontend work at IIT Bombay's Spoken Tutorial project."
      />
      <section className="section wrap" aria-labelledby="web-work">
        <h2 id="web-work">Professional work</h2>
        <Timeline roles={roles.filter((r) => r.category === "web")} />
      </section>
      <section className="section wrap" aria-labelledby="web-stack">
        <h2 id="web-stack">Stack</h2>
        <div className="stack-chips">
          {webSkills.map((s) => (
            <span className="chip stack-chip" key={s}>{s}</span>
          ))}
        </div>
      </section>
    </>
  );
}
