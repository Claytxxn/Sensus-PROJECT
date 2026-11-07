import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto nesta pasta (evita o Next usar lockfiles de pastas acima)
  turbopack: { root: __dirname },
};

export default nextConfig;
