import { useState, useRef } from "react";
import "./App.css";

import { SigmaGraph } from "./components/SigmaGraph";
import GlobalGraph from "./components/GlobalGraph";

import AddPlayerDialog from "./components/AddPlayerDialog"; 
import AddTeamDialog from "./components/AddTeamDialog";
import AddArenaDialog from "./components/AddArenaDialog";
import AddGameDialog from "./components/AddGameDialog";
interface Point {
  x: number;
  y: number;
}

const drawLine = (ctx: CanvasRenderingContext2D, canvas: { width: number; height: number; }, startPoint : Point, isDrawing :boolean, endPoint : Point ) => {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hotpink";
  if (startPoint && isDrawing && endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }
};



function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedPoint: Point = { x, y };

    if (!startPoint) {
      setStartPoint(clickedPoint);
      setIsDrawing(true);
    } else {

      setIsDrawing(false);

      setStartPoint(null);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    }

  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const currentPoint: Point = { x, y };

    if (isDrawing) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawLine(ctx, canvas, startPoint!, isDrawing, currentPoint);
    }
  };



  return (
    <div onContextMenu={(e) => {
      e.preventDefault(); // prevent the default behaviour when right clicked
    }}>
      <div >
        <AddPlayerDialog/>  
        <AddTeamDialog/>
        <AddArenaDialog/>
        <AddGameDialog/>
      </div>
      
       
    <div >
      </div>
      <div>
        <div className="flex">
          <div
            className="relative"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
          >
            <div className="absolute" id="sigma">
              <GlobalGraph >
                <SigmaGraph />
              </GlobalGraph>
            </div>
              <div className="absolute  pointer-events-none ">
                <canvas
                  className="border-4 border-red-900  "
                  ref={canvasRef}
                  width={800}
                  height={600}
                ></canvas>
              </div>
          </div>
        </div>
      
        {/* <ContextMenu  /> */}
      </div>
      
    </div>
  );
}

export default App;
