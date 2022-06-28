import { useMemo } from "react";
import "./App.css";
import { Capture } from "./Components/Capture";
import { Temp } from "./Components/Temp";
import { SAMPLES } from "./module/Facemoji/AvatarStore";
function App() {
  const d = useMemo(
    () => new Array(SAMPLES).fill(SAMPLES).map((e, i) => i),
    []
  );

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
      <Capture />
      <div className="mt-[200px] flex flex-wrap">
        {d.map((_, i) => (
          <Temp key={i} index={i} />
        ))}
      </div>

      {/* <RenderCanvasTest /> */}
    </div>
  );
}

export default App;
