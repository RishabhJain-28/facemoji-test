import { useEffect, useMemo, useRef } from "react";
import "./App.css";
import { RenderCanvas } from "./RenderCanvas";
import {
  Avatar,
  AvatarFactory,
  AvatarView,
  CameraWrapper,
  FaceTracker,
  FaceTrackerResult,
  FaceTrackerResultDeserializer,
  FaceTrackerResultSerializer,
  Future,
  Nullable,
  TrackerResultAvatarController,
  Try,
} from "@0xalter/alter-core";
import { Capture } from "./Capture";
function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [ready, setReady] = useState(false);
  // const [avatar, setAvatar] = useState<any[]>([null, null, null]);
  // useEffect(() => {}, []);

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
      // setReady(true);
    })();
    // if (!canvasRef.current) return;

    // const avatar = createAvatar(canvasRef.current);
    // setAvatar(avatar);
  }, []);

  const n = 5;
  const d = useMemo(() => new Array(n).fill(n).map((e, i) => i), []);

  return (
    <div>
      <div>
        <div className="message" id="fpsMessage">
          loading...
        </div>
        <div className="message" id="trackingMessage"></div>
        <svg id="spinner" className="spinner" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          ></circle>
        </svg>
      </div>
      {/* <div className="mt-[200px] flex flex-wrap">
        {d.map((_, i) => (
          <RenderCanvas videoRef={videoRef} key={i} />
        ))}
      </div> */}
      <Capture />
      {/* <div className="mt-[200px] flex flex-wrap">
        {d.map((_, i) => (
          <RenderCanvas videoRef={videoRef} key={i} />
        ))}
      </div> */}
    </div>
  );
}

export default App;
