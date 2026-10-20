// Static export so the same build deploys to Vercel or GitHub Pages.
// For GitHub Pages project sites (username.github.io/repo), build with:
//   NEXT_PUBLIC_BASE_PATH=/repo-name npm run build
// For Vercel or a username.github.io root repo, leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  reactStrictMode: true,
};

export default nextConfig;
