import {
  Avatar,
  CameraWrapper,
  FaceTracker,
  FaceTrackerResultSerializer,
} from "@0xalter/alter-core";
import React, { useEffect, useRef, useState } from "react";
import CreateAvatar from "../module/Facemoji/createAvatar";
import DeserializationAvatarController from "../module/Facemoji/DeserializationAvatarController";
interface CaptureProps {}

export const Capture: React.FC<CaptureProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current || !videoRef.current) return;
    const cameraWrapper = new CameraWrapper(videoRef.current);

    const [avatarFuture, avatarView, avatarFactory] = CreateAvatar.createAvatar(
      canvasRef.current,
      0
    );

    const cameraTrackerFuture = FaceTracker.createVideoTracker(
      avatarFactory.bundledFileSystem
    );

    (async () => {
      const [avatar, faceTracker] = await Promise.all([
        avatarFuture.promise(),
        cameraTrackerFuture.promise(),
      ]);

      avatarView.avatarController = new DeserializationAvatarController(
        avatar,
        0
      );

      const serializer = FaceTrackerResultSerializer.create();
      // dispatchEvent(
      //   new CustomEvent("serializationFormat", {
      //     detail: serializer.serializationFormat,
      //   })
      // );
      cameraWrapper.start().logError("Error starting camera");
      cameraWrapper.addOnFrameListener((cameraTexture) => {
        const trackResult = faceTracker.track(cameraTexture);
        if (trackResult) {
          setFaceDetected(trackResult.hasFace());
          // trackingMessageElement.innerHTML = trackerResult.hasFace() === false ? 'No face detected' : ''
          dispatchEvent(
            new CustomEvent("serializedData", {
              detail: serializer.serialize(trackResult),
            })
          );
        }
      });
    })();
  }, [ready]);

  return (
    <>
      <video ref={videoRef} id="videoSource" className="h-[100px]"></video>
      {faceDetected ? null : <h1 className="text-red-600">No face detected</h1>}
      <div id="canvas-wrapper" className="relative">
        <canvas
          ref={canvasRef}
          id="canvas${i}"
          className="w-[150px] h-[150px]"
        />
      </div>
    </>
  );
};
