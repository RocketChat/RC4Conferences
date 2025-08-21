import path from 'path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  basePath: '/community',
  images: {
    domains: [
      'global-uploads.webflow.com',
      'avatars.githubusercontent.com',
      'open.rocket.chat',
      'media-exp1.licdn.com',
    ],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default config;
