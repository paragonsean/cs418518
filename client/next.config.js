// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevent rendering in iframes
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';", // Adds extra layer of protection
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

