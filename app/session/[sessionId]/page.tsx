
import React from 'react';
import SessionHeader from "./components/SessionHeader";
import VideoHeader from './components/VideoHeader';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import { Session, Video } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'

const videos: Video[] = [
  {
    id: 1,
    title: 'Video Title 1',
    videoUrl: '',
    timestamp: '8:00AM'
  },
  {
    id: 2,
    title: 'Video Title 2',
    videoUrl: '',
    timestamp: '8:30AM'
  }
];

async function getSession(id: string): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', id)
    .single(); // Expect a single row

  if (error) {
      console.error('Error fetching session:', error);
      return null;
  }

  return data;
}

export default async function SessionPage({ params }: { params: { sessionId: string } }) {

  const session = await getSession(params.sessionId);
  
  if (!session) {
    return <div>No session data available</div>;
  }
  
  return (
    <div className='session-page'>
      <SessionHeader session={session}/>
      <div className="flex flex-col justify-between py-4 bg-gray-100">
        <div className="md:mx-auto bg-white md:p-6 rounded-xl">
          <div className="flex flex-col">
            <VideoHeader session={session} />
            <VideoPlayer videoId={'surfing/2024-05-15_20-03-49-landscape.mp4'} />
          </div>
          <VideoList videos={videos}/>
        </div>
      </div>
    </div>
  );
};