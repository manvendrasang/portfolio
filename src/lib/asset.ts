/** Prefix for files in /public so links work under a GitHub Pages sub-path. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
