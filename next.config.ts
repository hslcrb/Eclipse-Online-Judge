import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CheerpJ 3.0 ES Module을 동적 import할 수 있도록 외부 패키지 허용
  experimental: {
    // Turbopack/Next.js에서 외부 URL import를 허용
    externalDir: true,
  },
};

export default nextConfig;
