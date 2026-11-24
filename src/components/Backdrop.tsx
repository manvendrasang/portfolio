"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Variant } from "./Scene";
import { QUALITY_EVENT, demote, readQuality, resolveTier, type Tier } from "@/lib/quality";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Mode = "pending" | Tier;

/**
 * Decides how much 3D to run.
 *  - static: reduced-motion preference, no WebGL, or the visitor chose "Off".
 *  - lite: small screen, modest hardware, or the visitor chose "Lite".
 *  - full: everything on.
 * The visitor's choice (footer control) overrides the hardware guess, but
 * never the reduced-motion preference.
 */
export default function Backdrop({ variant }: { variant: Variant }) {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(resolveTier());
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener(QUALITY_EVENT, decide);
    return () => {
      mq.removeEventListener("change", decide);
      window.removeEventListener(QUALITY_EVENT, decide);
    };
  }, []);

  if (mode === "pending" || mode === "static") {
    return <div className="backdrop-fallback" aria-hidden="true" />;
  }
  return (
    <div className="backdrop" aria-hidden="true">
      <Scene
        key={`${variant}-${mode}`}
        variant={variant}
        lite={mode === "lite"}
        onSlow={() => readQuality() === "auto" && demote(mode === "lite" ? "lite" : "full")}
      />
    </div>
  );
}
