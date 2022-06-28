import React, { useRef } from "react";

interface RenderCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const RenderCanvas: React.FC<RenderCanvasProps> = ({ videoRef }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  return (
    <div id="canvas-wrapper" className="relative">
      <canvas ref={ref} id="canvas${i}" className="w-[150px] h-[150px]" />
    </div>
  );
};
