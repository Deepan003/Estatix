// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Already allowed
        port: '',
        pathname: '/**',
      },
      // --- Add any other trusted hostnames here ---
      // Example for Pexels:
      // {
      //   protocol: 'https',
      //   hostname: 'images.pexels.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;