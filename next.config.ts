import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "flagcdn.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true, 
    },
    typescript: {
        ignoreBuildErrors: true, 
    },
};

export default nextConfig;
