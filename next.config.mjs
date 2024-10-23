/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url); // Crea una versión compatible de `require`

const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                crypto: require.resolve('crypto-browserify'), // Usa la versión creada de `require`
            };
        }
        return config;
    },
};

export default nextConfig;
