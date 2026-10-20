import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap hero">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)" }}>This ride is closed</h1>
        <p className="lede">That page does not exist. The park map will get you back on track.</p>
        <Link className="btn" href="/">Back to the Launchpad</Link>
      </div>
    </section>
  );
}
