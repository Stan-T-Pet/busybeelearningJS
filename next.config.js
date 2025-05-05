import webpackLib from "next/dist/compiled/webpack/webpack-lib.js";
const { IgnorePlugin } = webpackLib;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
      };

      // Tell Webpack to ignore the module used by @mapbox/node-pre-gyp on the client.
      config.resolve.alias["@mapbox/node-pre-gyp/lib/util/nw-pre-gyp"] = false;

      // Optionally, also add an IgnorePlugin rule targeting index.html from that folder.
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^index\.html$/,
          contextRegExp: /@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
