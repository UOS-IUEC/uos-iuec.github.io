import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages는 정적 파일만 서빙한다. 빌드 결과가 out/ 에 떨어진다.
  // 서버 런타임이 필요한 기능을 쓰지 않는다는 §5 제약이 여기에 걸려 있다.
  output: "export",

  images: {
    // 정적 export에서는 Next의 이미지 최적화 서버가 없다.
    // 이미지는 커밋 전에 직접 리사이즈한다 (CLAUDE.md §7).
    unoptimized: true,
  },

  // 정적 호스팅에서 /about 같은 주소가 /about/index.html 로 해석되도록 한다.
  trailingSlash: true,
};

export default nextConfig;
