'use client';

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import '@livekit/components-styles';
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  roomId: string;
  studentName: string;
}

export const MediaRoom = ({
  roomId,
  studentName
}: MediaRoomProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!studentName) return;

    (async () => {
      try {
        const response = await fetch(`/api/token?room=${roomId}&studentName=${studentName}`);
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [studentName, roomId]);

  if (token === '') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading......
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKITWS_URL}
      video={true}
      audio={true}
      token={token}
      connect={true}
    
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
