import React, { useRef, useState } from 'react'


interface Point {
    x: number;
    y: number;
  }




export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [endPoint, setEndPoint] = useState<Point | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
      document.querySelector("#sigma")!.dispatchEvent(new Event(event.type, event));

    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
          drawLine();
        }
        document.querySelector("#sigma")!.dispatchEvent(new Event(event.type, event));
      };
    

      const drawLine = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'hotpink';
        // Draw the line
        if (startPoint && isDrawing && endPoint) {
          
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.stroke();
        }
      };



    return (
        <>
        <canvas className='border-4 border-red-900  ' ref={canvasRef} width={800} height={600} onClick={handleCanvasClick} onMouseMove={handleMouseMove}  ></canvas>
        </>
    )
}