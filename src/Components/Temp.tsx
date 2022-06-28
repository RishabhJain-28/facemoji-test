import { Avatar } from "@0xalter/alter-core";
import React, { useEffect, useRef } from "react";
import AvatarMap from "../module/Facemoji/AvatarStore";
import CreateAvatar from "../module/Facemoji/createAvatar";
import DeserializationAvatarController from "../module/Facemoji/DeserializationAvatarController";
interface TempProps {
  index: number;
}

export const Temp: React.FC<TempProps> = ({ index }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const [avatarFuture, avatarView, avatarFactory] = CreateAvatar.createAvatar(
      canvasRef.current,
      index
    );

    const avatarPromise = new Promise<{ avatar: Avatar; index: number }>(
      (resolve) => {
        avatarFuture
          .promise()
          .then((avatar: Avatar) => resolve({ avatar, index: 0 }));
      }
    );

    AvatarMap.set(index, {
      avatarFuture,
      avatarView,
      avatarFactory,
      avatarPromise: avatarPromise,
      avatar: null,
    });

    (async () => {
      const { avatar, index } = await avatarPromise;

      avatarView.avatarController = new DeserializationAvatarController(
        avatar,
        index
      );
    })();
  }, []);

  return (
    <>
      <div id="canvas-wrapper" className="relative">
        <canvas
          ref={canvasRef}
          id="canvas${i}"
          className="w-[350px] h-[350px]"
        />
      </div>
    </>
  );
};
