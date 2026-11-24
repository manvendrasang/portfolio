export type Quality = "auto" | "full" | "lite" | "off";

const KEY = "park-quality";
export const QUALITY_EVENT = "park:quality";

export function readQuality(): Quality {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "auto" || v === "full" || v === "lite" || v === "off") return v;
  } catch {
    /* storage can be blocked; fall back to auto */
  }
  return "auto";
}

export function saveQuality(q: Quality) {
  try {
    window.localStorage.setItem(KEY, q);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(QUALITY_EVENT));
}

export type Tier = "full" | "lite" | "static";

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Hardware guess used when the visitor leaves the control on Auto. */
export function autoTier(): "full" | "lite" {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const weak =
    window.innerWidth < 760 ||
    (navigator.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) < 4 ||
    nav.connection?.saveData === true;
  return weak ? "lite" : "full";
}

/**
 * Set when the page measures that it cannot hold its frame budget. It only applies while the visitor
 * has left the control on Auto (an explicit choice is respected), and it lasts for the visit.
 */
let demoted: Tier | null = null;

export function demote(from: "full" | "lite") {
  demoted = from === "full" ? "lite" : "static";
  window.dispatchEvent(new Event(QUALITY_EVENT));
}

/** One answer to "how much effect work should this visitor get?", shared by the 3D scene and the glass refraction. */
export function resolveTier(): Tier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const q = readQuality();
  if (q === "off" || !webglAvailable()) return "static";
  if (q !== "auto") return q;
  const auto = autoTier();
  return demoted === "static" || (demoted === "lite" && auto === "full") ? demoted : auto;
}
