/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/phonics-material",
  assetPrefix: "/phonics-material/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/phonics-material"
  },
  output: "export",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
