'use client';

import { useState, useEffect } from 'react'
import VideoHeader from './video-header';
import VideoPlayer from './video-player';
import VideoList from './video-list';
import { ScrollArea } from "@/components/ui/scroll-area"
// import CommentsSection from './comments-section';
import { Session, VideoMetadata } from '@/lib/types'
import CommentsSection from './comments-section';

interface VideoContainerProps {
  clips: VideoMetadata[];
  session: Session;
}

export default function VideoContainer({ clips, session }: VideoContainerProps) {

  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const [comments, addComment] = useState([]);

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
    <div className="flex flex-col h-[1100px] justify-between md:mx-auto md:p-6 rounded-xl">
      <div className="flex gap-4 flex-1 overflow-hidden">

        <div className="flex flex-col bg-white rounded-xl">
          <VideoHeader session={session} />
          <VideoPlayer title={selectedVideo ? selectedVideo.title : ""} />
        </div>

        <CommentsSection />

      </div>

      <VideoList
        videos={clips}
        selectedVideo={selectedVideo}
        onSelectVideo={handleSelectVideo}
      />
    </div>


  );
}