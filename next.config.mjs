import { env } from './src/env.mjs';

await import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    config.resolve.alias.canvas = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: `${env.BUCKET_NAME}.s3.amazonaws.com`,
      },
      {
        protocol: 'https',
        hostname: `${env.BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`,
      },
      {
        hostname:  `${env.NEXT_PUBLIC_CLOUDFLARE_URL.replace("https://", "")}`
      },
      {
        hostname: 'pub-09e89629ccf746aa9f157a82e10f7592.r2.dev',
      },
      {
        hostname: 'pub-191ee85b3a3548119e77bc1e1d5d2a54.r2.dev',
      }, 
      {
        hostname: 'maps.googleapis.com'
      }
    ],
  },
};

export default nextConfig;
