"use client";

import React, { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

interface HeroShaderProps {
  colors?: string[];
  speed?: number;
  distortion?: number;
  swirl?: number;
  veilOpacity?: string;
  offsetX?: number;
}

const luminaColors = [
  "#0891B2", // Primary
  "#22D3EE", // Secondary
  "#06B6D4", // Accent
  "#164E63", // Deep
  "#ECFEFF", // BG Light
];

export const HeroShader = ({
  colors = luminaColors,
  speed = 0.4,
  distortion = 1.2,
  swirl = 0.8,
  veilOpacity = "bg-white/40",
  offsetX = 0,
}: HeroShaderProps) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <MeshGradient
        width={dimensions.width}
        height={dimensions.height}
        colors={colors}
        distortion={distortion}
        swirl={swirl}
        grainMixer={0.1}
        grainOverlay={0.05}
        speed={speed}
        offsetX={offsetX}
      />
      {/* Overlay for readability */}
      <div className={`absolute inset-0 pointer-events-none backdrop-blur-[20px] ${veilOpacity}`} />
    </div>
  );
};
