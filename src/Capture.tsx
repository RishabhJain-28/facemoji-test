import {
  Avatar,
  AvatarFactory,
  AvatarView,
  CameraWrapper,
  FaceTracker,
  FaceTrackerResultSerializer,
  Future,
  Try,
} from "@0xalter/alter-core";
import React, { useEffect, useRef, useState } from "react";
import avatarMap from "./AvatarStore";
import CreateAvatar from "./createAvatar";
import DeserializationAvatarController from "./DeserializationAvatarController";
interface CaptureProps {}

export const Capture: React.FC<CaptureProps> = ({}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    //get video stream
    (async () => {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setReady(true);
    })();
    // if (!canvasRef.current) return;

    // const avatar = createAvatar(canvasRef.current);
    // setAvatar(avatar);
  }, []);
  // Base avatar management (API initialization, resource loading, presets switching, fps message)
  useEffect(() => {
    if (!ready) return;
    if (!ref.current || !videoRef.current) return;
    console.log("yey");
    const cameraWrapper = new CameraWrapper(videoRef.current);

    const [avatarFuture, avatarView, avatarFactory] = CreateAvatar.createAvatar(
      ref.current,
      0
    );

    const avatarPromise = new Promise<{ avatar: Avatar; index: number }>(
      (resolve) => {
        avatarFuture
          .promise()
          .then((avatar: Avatar) => resolve({ avatar, index: 0 }));
      }
    );
    const cameraTrackerFuture = FaceTracker.createVideoTracker(
      avatarFactory.bundledFileSystem
    );

    avatarMap.set(0, {
      avatarFuture,
      avatarView,
      avatarFactory,
      avatarPromise: avatarPromise,
      avatar: null,
    });

    (async () => {
      const [{ avatar, index }, faceTracker] = await Promise.all([
        avatarPromise,
        cameraTrackerFuture.promise(),
      ]);

      avatarView.avatarController = new DeserializationAvatarController(
        avatar,
        0
      );

      const serializer = FaceTrackerResultSerializer.create();
      dispatchEvent(
        new CustomEvent("serializationFormat", {
          detail: serializer.serializationFormat,
        })
      );
      cameraWrapper.start().logError("Error starting camera");
      cameraWrapper.addOnFrameListener((cameraTexture) => {
        const trackResult = faceTracker.track(cameraTexture);
        if (trackResult) {
          // Send serialized tracking result over WebRTC or WebSockets
          // This demo example simulates that with custom browser events
          // console.log('trackResult', trackResult)

          dispatchEvent(
            new CustomEvent("serializedData", {
              detail: serializer.serialize(trackResult),
            })
          );
          // _trackResult = trackResult
        }
      });
    })();
  }, [ready]);

  return (
    <>
      <video ref={videoRef} id="videoSource" className="h-[100px]"></video>

      <div id="canvas-wrapper" className="relative">
        <canvas ref={ref} id="canvas${i}" className="w-[150px] h-[150px]" />
      </div>
    </>
  );
};
