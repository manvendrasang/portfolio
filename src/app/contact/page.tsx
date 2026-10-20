import type { Metadata } from "next";
import { person } from "@/lib/content";
import { PageHead } from "@/components/Parts";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, phone, and LinkedIn for Manvendra Sang.",
};

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="Portal Garden"
        title="Contact"
        lede="I'm looking for roles building web applications and AI-powered products. Email is the fastest route."
      />
      <section className="section wrap" aria-labelledby="links">
        <h2 id="links">Direct links</h2>
        <ul className="list-plain" style={{ maxWidth: 560 }}>
          <li>Email: <a href={`mailto:${person.email}`}>{person.email}</a></li>
          <li>Phone: <a href={`tel:${person.phone.replace(/\s/g, "")}`}>{person.phone}</a></li>
          <li>LinkedIn: <a href={person.linkedin} target="_blank" rel="noopener noreferrer">{person.linkedinLabel}</a></li>
          <li>GitHub: <a href={person.github} target="_blank" rel="noopener noreferrer">{person.githubLabel}</a></li>
          <li>Résumé: <a href={asset(person.resume)} download>Download PDF</a></li>
        </ul>
      </section>
    </>
  );
}
