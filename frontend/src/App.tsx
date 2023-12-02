import { useState, useRef } from "react";
import "./App.css";
// import Canvas from './components/Canvas'
import { SigmaGraph } from "./components/SigmaGraph";

interface Point {
  x: number;
  y: number;
}

const drawLine = (ctx: CanvasRenderingContext2D, canvas: { width: number; height: number; }, startPoint : Point, isDrawing :boolean, endPoint : Point ) => {
  // const canvas = canvasRef.current;
  // if (!canvas) return;

  // const ctx = canvas.getContext("2d");
  // if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hotpink";
  // Draw the line
  if (startPoint && isDrawing && endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }
};



function App() {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("click");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedPoint: Point = { x, y };

    if (!startPoint) {
      // Set the starting point on the first click
      setStartPoint(clickedPoint);
      setIsDrawing(true);
    } else {
      // Set the ending point continuously as the cursor moves
      // setEndPoint(clickedPoint);
      setIsDrawing(false);

      setStartPoint(null);
      setEndPoint(null);
    }

  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const currentPoint: Point = { x, y };

    if (isDrawing) {
      // Set the ending point continuously as the cursor moves after the first click
      setEndPoint(currentPoint);

      // Draw the line dynamically
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawLine(ctx, canvas, startPoint!, isDrawing, currentPoint);
    }
  };



  return (
    <div>
      <div className="flex">
        <div
          className="relative"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute" id="sigma">
            <SigmaGraph />
          </div>
          {visible && (
            <div className="absolute  pointer-events-none ">
              <canvas
                className="border-4 border-red-900  "
                ref={canvasRef}
                width={800}
                height={600}
              ></canvas>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="inline-block rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
        onClick={() => setVisible(!visible)}
      >
        Toggle
      </button>
    </div>
  );
}

export default App;
