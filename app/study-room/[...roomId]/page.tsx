"use client"
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MediaRoom } from '@/components/avcall/media-room';

let socket: typeof Socket;

const StudyRoom = () => {
    const params = useParams();
    const roomId = params.roomId?.[0];
    const { data: session, status } = useSession();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

    const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        // Initialize the socket connection
        console.log('Initializing socket connection...');
        socket = io('http://localhost:4000', {
            allowEIO3: true,
        });

        // Handle updates from other users
        socket.on('whiteboard-update', (data) => {
            console.log('Received whiteboard update:', data);  // Log received data
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && data) {
                const { x, y, type } = data;
                console.log(`Processing data on canvas: ${x}, ${y}, ${type}`);  // Log canvas actions
                if (type === 'start') {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                } else if (type === 'draw') {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }

                // Update coordinates on the canvas
                setCoordinates({ x, y });
            }
        });

        return () => {
            console.log('Disconnecting socket...');
            socket.disconnect();
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        console.log('Mouse down event triggered');
        isDrawing.current = true;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            const { offsetX, offsetY } = e.nativeEvent;
            lastPoint.current = { x: offsetX, y: offsetY };
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);

            // Emit the starting point to other users
            console.log(`Emitting start event: x: ${offsetX}, y: ${offsetY}`);
            socket.emit('whiteboard-update', { roomId, data: { x: offsetX, y: offsetY, type: 'start' } });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing.current || !lastPoint.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            const { offsetX, offsetY } = e.nativeEvent;
            console.log(`Mouse move: x: ${offsetX}, y: ${offsetY}`);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();

            // Emit the drawing data to other users
            console.log(`Emitting draw event: x: ${offsetX}, y: ${offsetY}`);
            socket.emit('whiteboard-update', {
                roomId,
                data: { x: offsetX, y: offsetY, type: 'draw' },
            });

            lastPoint.current = { x: offsetX, y: offsetY };
        }
    };

    const handleMouseUp = () => {
        console.log('Mouse up event triggered');
        isDrawing.current = false;
        lastPoint.current = null;
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
            {/* Media Room */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <MediaRoom roomId={roomId as string} studentName={session?.user.username as string} />
            </div>

            {/* Whiteboard */}
            <div className="mt-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold text-center mb-4">Collaborative Whiteboard</h2>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="border-2 border-gray-300 rounded-md shadow-lg"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
                {coordinates && (
                    <div className="mt-4 text-center text-xl">
                        <p>Current Coordinates: X: {coordinates.x}, Y: {coordinates.y}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyRoom;
