const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async redirects() {
    return [
      {
        source: "/overview",
        destination: "/workspaces/overview",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (process.env.NODE_ENV !== "production") {
        config.plugins = [...config.plugins];
      } else {
        config.plugins = [...config.plugins, new PrismaPlugin()];
      }
    }

    return config;
  },
};
