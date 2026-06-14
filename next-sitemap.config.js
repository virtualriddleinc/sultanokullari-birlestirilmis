/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://sultanokullari.com.tr",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
};
