import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  instrumentationHook: true,
  output: 'export'
};

export default nextConfig;
