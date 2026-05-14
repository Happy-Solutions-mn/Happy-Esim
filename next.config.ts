import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    experimental: {
        openNextExperimentalFeatures: true,
    },
    // 使用 output: 'standalone' 可以避免很多打包问题
    output: 'standalone',
    // webpack 配置
    webpack: (config, { isServer, nextRuntime }) => {
        // 只在服务端且不是边缘运行时，将 crypto 设为外部依赖
        if (isServer && nextRuntime !== 'edge') {
            config.externals = [...(config.externals || []), 'crypto'];
        }
        
        // 修复 node: 协议的问题
        config.resolve.alias = {
            ...config.resolve.alias,
            'node:crypto': 'crypto',
        };
        
        return config;
    },
};

export default nextConfig;