/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["103.87.78.74"],
  },
  env: {
    basePath: "http://127.0.0.1:3000",
    dbUser: "postgres",
    dbHost: "localhost",
    dbName: "project",
    dbPassword: "postgres",
    dbPort: "5432",
  },
};

module.exports = nextConfig;
