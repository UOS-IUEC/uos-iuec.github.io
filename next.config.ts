import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 배포처가 미정이라 정적 export 호환성을 유지한다 (CLAUDE.md §5, #3).
    // 이미지는 커밋 전에 직접 리사이즈한다 (CLAUDE.md §7).
    unoptimized: true,
  },
};

export default nextConfig;
