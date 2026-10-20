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
