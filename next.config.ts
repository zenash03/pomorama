import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pomorama",
  output: "export",
  reactStrictMode: true,
  // async headers() {
  //   return [
  //     {
  //       source: '/favicon.ico',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: process.env.NODE_ENV === 'development' 
  //             ? 'no-cache, no-store, must-revalidate' 
  //             : 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ]
  // },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.ico',
      },
    ]
  },
};

export default nextConfig;
