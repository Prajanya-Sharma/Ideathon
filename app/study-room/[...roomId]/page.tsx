'use client'
import { MediaRoom } from '@/components/avcall/media-room';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const StudyRoom = () => {
    const params = useParams();
    const roomId = params.roomId?.[0];
    const {data:session,status}=useSession();
    
    if(status === 'loading'){
        return <p>Loading...</p>;
    }

  return (
    <div>
        <MediaRoom
            roomId={roomId as string}
            studentName={session?.user.username as string}
        />
    </div>
  )
}

export default StudyRoom;
