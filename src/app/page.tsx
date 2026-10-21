import Link from "next/link";
import { certifications, destinations, education, person, projects, roles, skills } from "@/lib/content";
import { ProjectCard, Timeline } from "@/components/Parts";
import Hobbies from "@/components/Hobbies";
import { asset } from "@/lib/asset";

const portalColor: Record<string, string> = {
  nebula: "#3dffc0",
  midway: "#ff4d6d",
  render: "#ff7a1a",
  portal: "#c58bff",
  observatory: "#ffc857",
};

export default function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div>
          <p className="name">{person.name}</p>
          <h1 id="hero-title">{person.headline}</h1>
          <p className="hero-sub">
            {person.role}. I build web apps and AI systems, from MERN products to reservoir computing research.
          </p>
          <div className="row">
            <Link className="btn" href="/ai/">Enter the park</Link>
            <a className="btn ghost" href={asset(person.resume)} download>Download résumé</a>
          </div>
          <p className="hint">Move your pointer to steer the scene.</p>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="map-title">
        <p className="eyebrow">Park map</p>
        <h2 id="map-title">Pick a world</h2>
        <div className="grid">
          {destinations
            .slice(1)
            .filter((d) => d.theme !== "portal")
            .map((d) => (
            <Link key={d.href} href={d.href} className="portal" style={{ ["--pc" as string]: portalColor[d.theme] }}>
              <small>{d.world}</small>
              <h3>{d.label}</h3>
              <p>{d.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" id="about" aria-labelledby="about-title">
        <p className="eyebrow">About</p>
        <h2 id="about-title">Who is behind the ride</h2>
        <p className="lede">
          Full-stack developer and AI/ML builder based in New Delhi. I split my time between MERN web
          products, Reservoir-Computing research and 3D graphics. I'm here to build things that work,
          and to make them myself.
        </p>
      </section>

      <section className="section wrap" id="work" aria-labelledby="work-title">
        <p className="eyebrow">Featured work</p>
        <h2 id="work-title">Projects</h2>
        <div className="grid">
          {projects.filter((p) => p.category !== "3d" && !["agentic-it-ticket-manager", "mern-team-task-manager"].includes(p.slug)).map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="section wrap" id="experience" aria-labelledby="exp-title">
        <p className="eyebrow">Experience</p>
        <h2 id="exp-title">Research and internships</h2>
        <Timeline roles={roles} />
      </section>

      <section className="section wrap" id="skills" aria-labelledby="skills-title">
        <p className="eyebrow">Skills</p>
        <h2 id="skills-title">Toolbox</h2>
        <div className="skill-grid">
          {skills.map((g) => (
            <div className="card" key={g.group}>
              <h3>{g.group}</h3>
              <div>
                {g.items.map((i) => (
                  <span className="chip" key={i}>{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Hobbies />

      <section className="section wrap" id="certifications" aria-labelledby="cert-title">
        <p className="eyebrow">Certifications</p>
        <h2 id="cert-title">Certifications and publication</h2>
        <ul className="list-plain">
          {certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="section wrap" id="education" aria-labelledby="edu-title">
        <p className="eyebrow">Education</p>
        <h2 id="edu-title">Education</h2>
        <ul className="list-plain">
          {education.map((e) => (
            <li key={e.degree}>
              <strong>{e.degree}</strong>
              <br />
              {e.school}
              <br />
              <span className="meta">{e.dates}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section wrap" id="resume" aria-labelledby="resume-title">
        <p className="eyebrow">Résumé</p>
        <h2 id="resume-title">The short version, on paper</h2>
        <div className="row">
          <a className="btn" href={asset(person.resume)} download>Download PDF</a>
          <Link className="btn ghost" href="/contact/">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
