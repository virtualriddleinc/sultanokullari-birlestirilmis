/** @type {import('next-sitemap').IConfig} */
const { execSync } = require("child_process");

function getAdditionalPaths() {
  try {
    const output = execSync("npx tsx src/scripts/get-sitemap-paths.ts", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
      timeout: 15_000,
    });
    const paths = JSON.parse(output.trim() || "[]");
    return Array.isArray(paths) ? paths : [];
  } catch (error) {
    console.warn(
      "[next-sitemap] CMS slug'ları alınamadı, yalnızca statik route'lar kullanılacak:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

module.exports = {
  siteUrl: process.env.SITE_URL || "https://sultanokullari.com.tr",
  generateRobotsTxt: false,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin", "/admin/*", "/api/*", "/graphql", "/graphql-playground"],
  additionalPaths: async () => getAdditionalPaths(),
};
