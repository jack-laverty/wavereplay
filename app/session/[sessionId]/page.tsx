
import React from 'react';
import SessionHeader from "./components/session-header";
import VideoContainer from './components/video-container';
import { Session, VideoMetadata } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'
import CommentsSection from './components/comments-section';


async function getSession(id: string): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single(); // Expect a single row

  if (error) {
      console.error('Error fetching session:', error);
      return null;
  }

  return data;
}

async function getClips(id: string): Promise<VideoMetadata[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('session', id); // we expect multiple
    
  if (error) {
      console.error('Error fetching clips:', error);
      return [];
  }

  return data;
}

export default async function SessionPage({ params }: { params: { sessionId: string } }) {

  const clips = await getClips(params.sessionId);
  const session = await getSession(params.sessionId);

  if (!session) {
    return <div>No session data available</div>;
  }

  return (
    <div className="session-page pt-4">
      <SessionHeader session={session} />
      <div className="py-4">
        
        {clips.length === 0 ? (
          <div>No clips assigned to this session</div>
        ) : (
          <VideoContainer clips={clips} session={session} />
        )}

      </div>
    </div>
  );
};