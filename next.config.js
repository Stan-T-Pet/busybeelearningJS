import webpack from "next/dist/compiled/webpack/webpack-lib.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
      };

      config.resolve.alias["@mapbox/node-pre-gyp/lib/util/nw-pre-gyp"] = false;

      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^index\.html$/,
          contextRegExp: /@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;