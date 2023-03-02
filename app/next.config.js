const path = require('path');

module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'global-uploads.webflow.com',
      'avatars.githubusercontent.com',
      'open.rocket.chat',
      'media-exp1.licdn.com',
      '192.168.1.4',
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
