// File: next.config.mjs
import { fileURLToPath } from 'url';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(fileURLToPath(import.meta.url), './src');
    return config;
  },
};

export default nextConfig;
