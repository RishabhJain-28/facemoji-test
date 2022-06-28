import { Avatar } from "@0xalter/alter-core";
import React, { useEffect, useMemo, useRef } from "react";
import AvatarMap, { SAMPLES } from "../module/Facemoji/AvatarStore";
import CreateAvatar from "../module/Facemoji/createAvatar";
import DeserializationAvatarController from "../module/Facemoji/DeserializationAvatarController";

interface RenderCanvasTestProps {
  // videoRef: React.RefObject<HTMLVideoElement>;
}

export const RenderCanvasTest: React.FC<RenderCanvasTestProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const d = useMemo(
    () => new Array(SAMPLES).fill(SAMPLES).map((e, i) => i),
    []
  );
  // useEffect(() => {

  //   const p = new Promise((resolves) => {

  //     const avatarPromises = [];

  //     for (let i = 1; i < SAMPLES; i++) {
  //       const canvas = document.getElementById(`canvas${i}`) as HTMLCanvasElement

  //       if(!canvasRef.current)return;
  //       const [avatarFuture, avatarView, avatarFactory] = CreateAvatar.createAvatar(
  //         canvasRef.current,
  //         i
  //       );

  //       const avatarP = new Promise<{ avatar: Avatar; index: number }>(
  //         (resolve) => {
  //           avatarFuture
  //             .promise()
  //             .then((avatar) => resolve({ avatar, index: i }));
  //         }
  //       );
  //       avatarPromises.push(avatarP);
  //       AvatarMap.set(i, {
  //         avatarFuture,
  //         avatarView,
  //         avatarFactory,
  //         avatar: null,
  //         avatarPromise: avatarP,
  //       });
  //     }

  //     Promise.all(avatarPromises).then((avatarArr) => {
  //       avatarArr.forEach((avatarVal) => {
  //         const avatarMapVal = AvatarMap.get(avatarVal.index);
  //         if (avatarMapVal)
  //           AvatarMap.set(avatarVal.index, {
  //             ...avatarMapVal,
  //             avatar: avatarVal.avatar,
  //           });
  //       });

  //       resolves(null);
  //     });
  //   }).then(()=>{
  //     for (let i = 0; i < SAMPLES; i++) {
  //       const avatarView = AvatarMap.get(i)?.avatarView
  //       const avatar = AvatarMap.get(i)?.avatar
  //       if (avatar && avatarView) avatarView.avatarController = new DeserializationAvatarController(avatar, i)
  //   }
  // });

  // }, []);

  return (
    <div>
      {d.map((e, i) => {
        return (
          <div id="canvas-wrapper" className="relative">
            {/* <canvas ref={canvasRef.current[i]} id="canvas${i}" className="w-[150px] h-[150px]" /> */}
          </div>
        );
      })}
    </div>
  );
};
