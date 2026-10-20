"use client";

import { useState } from "react";
import { hobbies } from "@/lib/content";

const HOBBY_FX: Record<string, { color: string }> = {
  "Watercolor painting": { color: "#ff6b6b" },
  "Glass painting": { color: "#4ecdc4" },
  Sketching: { color: "#ffe66d" },
  "Watching F1": { color: "#ff1a1a" },
  Gaming: { color: "#8e44ad" },
};

export default function Hobbies() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section wrap" id="hobbies" aria-labelledby="hobbies-title">
      <p className="eyebrow">Hobbies</p>
      <h2 id="hobbies-title">Off the screen</h2>
      <div
        className="hobby-universe"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="hobby-nucleus">
          <span className="nucleus-ring" aria-hidden="true" />
          <span className="nucleus-core" aria-hidden="true" />
          <span className="nucleus-hint">Hover</span>
        </div>
        <div className={`hobby-orbit ${expanded ? "expanded" : ""}`}>
          {hobbies.map((h, idx) => {
            const fx = HOBBY_FX[h];
            const key = h.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <div
                key={h}
                className={`hobby-planet hobby-${key}`}
                style={
                  {
                    ["--i"]: idx,
                    ["--angle"]: `${(360 / hobbies.length) * idx}deg`,
                    ["--color"]: fx.color,
                  } as React.CSSProperties
                }
              >
                <div className="hobby-card">
                  <span className="hobby-glyph" aria-hidden="true" />
                  <h3>{h}</h3>
                  <div className={`hobby-aura hobby-aura-${key}`} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="hint" style={{ textAlign: "center" }}>
        Hover the sphere to spin the hobbies out.
      </p>
    </section>
  );
}
