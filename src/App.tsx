import { useEffect, useRef } from "react";
import { addPosition, deleteId, getId, getPositions } from "./utils/utils";

const id = getId();

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let oldX = window.screenX;
    let oldY = window.screenY;

    const interval = setInterval(() => {
      if (oldX != window.screenX || oldY != window.screenY) {
        oldX = window.screenX;
        oldY = window.screenY;
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;

        addPosition({
          id,
          screenX: oldX,
          screenY: oldY,
          x: midX,
          y: midY,
        });
        displayPositions();
      }
    }, 100);

    const drawCircles = () => {
      const smallCircle = 30;
      const largeCircle = 100;

      const midX = canvas.width / 2;
      const midY = canvas.height / 2;

      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.arc(midX, midY, smallCircle, 0, Math.PI * 2, false);

      ctx.moveTo(midX + largeCircle, midY);
      ctx.arc(midX, midY, largeCircle, 0, Math.PI * 2, true);
      ctx.stroke();
    };

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const midX = canvas.width / 2;
      const midY = canvas.height / 2;

      addPosition({
        id,
        screenX: oldX,
        screenY: oldY,
        x: midX,
        y: midY,
      });
      displayPositions();
    };

    const drawLine = (
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    };

    const displayPositions = () => {
      const positions = getPositions();
      const ownPosition = positions[id];
      ctx.reset();
      drawCircles();
      for (const key in positions) {
        if (id == positions[key].id) continue;
        const { screenX, screenY, x, y } = positions[key];
        const resolvedPosition = { x: screenX + x, y: y + screenY };
        const resolvedOwnPosition = {
          x: ownPosition.x + ownPosition.screenX,
          y: ownPosition.y + ownPosition.screenY,
        };
        const distX = Math.abs(resolvedOwnPosition.x - resolvedPosition.x);
        const distY = Math.abs(resolvedOwnPosition.y - resolvedPosition.y);
        const destX =
          resolvedOwnPosition.x > resolvedPosition.x
            ? ownPosition.x - distX
            : ownPosition.x + distX;
        const destY =
          resolvedOwnPosition.y > resolvedPosition.y
            ? ownPosition.y - distY
            : ownPosition.y + distY;
        drawLine(ownPosition.x, ownPosition.y, destX, destY);
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    window.addEventListener("storage", displayPositions);
    window.addEventListener("beforeunload", () => {
      deleteId(id);
    });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearInterval(interval);
      window.removeEventListener("storage", displayPositions);
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
