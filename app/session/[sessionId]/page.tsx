
import React from 'react';
import SessionHeader from "./components/SessionHeader";
import { Video, Session } from '@/lib/types'
import VideoList from './components/VideoList';
import VideoHeader from './components/VideoHeader';
import VideoPlayer from './components/VideoPlayer';
import VideoPlayerControls from './components/VideoPlayerControls';
import { createClient } from '@/lib/supabase/server'

const videos: Video[] = [
  {
    id: 1,
    title: 'Video Title 1',
    thumbnailUrl: '/thumbnails/video1.jpg',
    videoUrl: '',
    timestamp: '8:00AM'
  },
  {
    id: 2,
    title: 'Video Title 2',
    thumbnailUrl: '/thumbnails/video2.jpg',
    videoUrl: '',
    timestamp: '8:30AM'
  }
];

const supabase = createClient();

async function getSession(id: string): Promise<Session | null> {
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
            <VideoPlayer videoId={'Intermediate/2024-05-15_20-00-00-landscape.mp4'} />
            <VideoPlayerControls />
          </div>
          <VideoList videos={videos}/>
        </div>
      </div>
    </div>
  );
};