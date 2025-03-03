import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"], //  Allow external server dependencies
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(process.cwd(), "src/components"), //  Use `process.cwd()` instead of `__dirname`
    };
    config.resolve.symlinks = false; //  Prevent symlink issues
    return config;
  },
};

export default nextConfig;
