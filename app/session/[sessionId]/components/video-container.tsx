'use client';

import { useState, useEffect } from 'react'
import VideoHeader from './video-header';
import VideoPlayer from './video-player';
import VideoList from './video-list';
import { Comment, Session, VideoMetadata } from '@/lib/types'
import CommentsSection from '@/components/ui/comments-section';

interface VideoContainerProps {
  clips: VideoMetadata[];
  session: Session;
}


export default function VideoContainer({ clips, session }: VideoContainerProps) {
  
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Select the first video in the list on initial render
  useEffect(() => {
    if (clips.length > 0 && !selectedVideo) {
      setSelectedVideo(clips[0]);
    }
  }, [clips, selectedVideo]);
  
  const handleSelectVideo = (video: VideoMetadata) => {
    setSelectedVideo(video);
  };
  
  return (
    <div className="flex flex-col justify-between md:mx-auto md:p-6 rounded-xl">
      <div className="flex gap-4 flex-1 overflow-hidden">

        <div className="flex flex-col bg-white rounded-xl">
          <VideoHeader session={session} />
          <VideoPlayer title={selectedVideo ? selectedVideo.title : ""} />
        </div>

        <CommentsSection 
          className="rounded-xl"
          comments={comments}
          setComments={setComments}
        />

      </div>

      <VideoList
        videos={clips}
        selectedVideo={selectedVideo}
        onSelectVideo={handleSelectVideo}
      />
    </div>
  );
}
