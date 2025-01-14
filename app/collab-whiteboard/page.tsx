"use client"
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: typeof Socket;

export const Whiteboard = () => {
  const [roomId, setRoomId] = useState("");
  const [connectedRoom, setConnectedRoom] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    socket = io("http://localhost:4000",{
      allowEIO3: true
    });

    // Listen for the whiteboard updates
    socket.on("whiteboard-update", (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && data) {
        const { x, y, type } = data;
        if (type === "start") {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else if (type === "draw") {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    });

    // Listen for the 'ondown' event to handle the starting point for other users
    socket.on("ondown", ({ x, y }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.moveTo(x, y);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit("join-room", roomId);
      setConnectedRoom(roomId);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const { offsetX, offsetY } = e.nativeEvent;
      lastPoint.current = { x: offsetX, y: offsetY }; // Store the start point
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);

      socket.emit('down', roomId, { x: offsetX, y: offsetY });
      socket.emit("whiteboard-update", { roomId, x: offsetX, y: offsetY, type: "start" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || !lastPoint.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      socket.emit("whiteboard-update", { roomId, data: { x: offsetX, y: offsetY, type: "draw" } });
      lastPoint.current = { x: offsetX, y: offsetY }; // Update the last point as the new position
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    lastPoint.current = null; // Reset the last point when drawing ends
  };

  return (
    <div>
      {!connectedRoom ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <p>Connected to Room: {connectedRoom}</p>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: "1px solid black" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      )}
    </div>
  );
};

export default Whiteboard;
