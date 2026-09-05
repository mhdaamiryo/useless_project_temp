/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers', 'onnxruntime-node', 'jimp'],
  },
  webpack: (config) => {
    // Do NOT alias sharp to false — we need it for server-side image cropping
    return config;
  }
}

module.exports = nextConfig

