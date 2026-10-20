"use client";

import { useEffect, useState } from "react";
import { QUALITY_EVENT, readQuality, saveQuality, type Quality } from "@/lib/quality";

const options: { value: Quality; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "full", label: "Full" },
  { value: "lite", label: "Light" },
  { value: "off", label: "Off" },
];

export default function QualityControl() {
  const [q, setQ] = useState<Quality>("auto");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setQ(readQuality());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setQ(readQuality());
      setReduced(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener(QUALITY_EVENT, sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener(QUALITY_EVENT, sync);
    };
  }, []);

  return (
    <div className="quality">
      <label htmlFor="quality-select">3D background</label>
      <select
        id="quality-select"
        value={q}
        onChange={(e) => saveQuality(e.target.value as Quality)}
        disabled={reduced}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {reduced && <span className="meta"> Off because your device asks for reduced motion.</span>}
    </div>
  );
}
