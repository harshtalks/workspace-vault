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
};
