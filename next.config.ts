import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt", "*.ngrok-free.app", "*.ngrok.io"],
  images: {
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
