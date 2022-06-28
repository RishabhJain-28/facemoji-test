import {
  CameraWrapper,
  FaceTracker,
  FaceTrackerResultSerializer,
} from "@0xalter/alter-core";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { DeserializationAvatarController } from "./Facemoji";
import { createAvatar } from "./utils";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [avatar, setAvatar] = useState<any[]>([null, null, null]);
  useEffect(() => {}, []);

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
    if (!canvasRef.current) return;

    const avatar = createAvatar(canvasRef.current);
    setAvatar(avatar);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const [avatarFuture, avatarView, avatarFactory] = avatar;
    if (avatarView == null) return;
    const cameraWrapper = new CameraWrapper(videoRef.current);
    const cameraTrackerFuture = FaceTracker.createVideoTracker(
      avatarFactory.bundledFileSystem
    );

    Promise.all([avatarFuture.promise(), cameraTrackerFuture.promise()]).then(
      ([avatar, faceTracker]) => {
        // Set deserialization controller as avatar animator
        // The instance has to be created before first message is sent (serialization format),
        // otherwise the message will not be recieved and deserialization won't work properly
        // This very simple demo logic should be replaced with proper network protocol behavior
        avatarView.avatarController = new DeserializationAvatarController(
          avatar
        );

        // Serializer will provide serialization format and allow to serialize tracking result data
        const serializer = FaceTrackerResultSerializer.create();
        console.log("serializer", serializer);
        // First send the serialization format that is necessary for creation of the deserializer instance
        // Send serialization format over WebRTC or WebSockets
        // This demo example simulates that with custom browser events
        dispatchEvent(
          new CustomEvent("serializationFormat", {
            detail: serializer.serializationFormat,
          })
        );

        // Start camera recording or log an error if it fails
        cameraWrapper.start().logError("Error starting camera");
        // For each camera frame evaluate face tracking result through face tracker
        // Because the tracking result is not applied directly to avatar
        // TrackerAvatarController doesn't have to be used, face tracker instance is sufficient
        cameraWrapper.addOnFrameListener((cameraTexture) => {
          const trackResult = faceTracker.track(cameraTexture);
          if (trackResult) {
            // Send serialized tracking result over WebRTC or WebSockets
            // This demo example simulates that with custom browser events
            dispatchEvent(
              new CustomEvent("serializedData", {
                detail: serializer.serialize(trackResult),
              })
            );
          }
        });
      }
    );
  }, [ready, avatar]);

  return (
    <div>
      <div className="message" id="fpsMessage">
        loading...
      </div>

      <video ref={videoRef} className="w-[100px] h-[100px]" />
      <div className="m-10 p-2 bg-amber-500 border-2">
        <canvas className="w-[1000px] h-[1000px]" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
