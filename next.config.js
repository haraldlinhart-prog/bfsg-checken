/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Blogartikel (suchmaschinen.pro) liegen als public/blog/<slug>/index.html, ihre kanonische URL endet auf "/".
  // Ohne diese Option leitet Next sie per 308 auf die Variante ohne "/" um. App-Seiten leitet middleware.ts um.
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
