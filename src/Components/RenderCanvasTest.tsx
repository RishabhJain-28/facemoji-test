import React, { useEffect, useRef } from "react";
import { SAMPLES } from "../module/Facemoji/AvatarStore";

interface RenderCanvasTestProps {
  // videoRef: React.RefObject<HTMLVideoElement>;
}

export const RenderCanvasTest: React.FC<RenderCanvasTestProps> = ({}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const p = new Promise((resolves) => {
      const avatarPromises = [];

      for (let i = 1; i < SAMPLES; i++) {
        const canvas = document.getElementById(
          `canvas${i}`
        ) as HTMLCanvasElement;

        const [avatarFuture, avatarView, avatarFactory] = createAvatar(
          canvas,
          i
        );
        const avatarP = new Promise<{ avatar: Avatar; index: number }>(
          (resolve) => {
            avatarFuture
              .promise()
              .then((avatar) => resolve({ avatar, index: i }));
          }
        );
        avatarPromises.push(avatarP);
        avatarMap.set(i, {
          avatarFuture,
          avatarView,
          avatarFactory,
          avatar: null,
          avatarPromise: avatarP,
        });
      }

      Promise.all(avatarPromises).then((avatarArr) => {
        avatarArr.forEach((avatarVal) => {
          const avatarMapVal = avatarMap.get(avatarVal.index);
          if (avatarMapVal)
            avatarMap.set(avatarVal.index, {
              ...avatarMapVal,
              avatar: avatarVal.avatar,
            });
        });

        resolves(null);
      });
    });
  }, []);

  return (
    <div id="canvas-wrapper" className="relative">
      <canvas ref={ref} id="canvas${i}" className="w-[150px] h-[150px]" />
    </div>
  );
};
