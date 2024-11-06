'use client';
import { useState, useEffect } from 'react'
import VideoHeader from './VideoHeader';
import VideoPlayer from './VideoPlayer';
import VideoList from './VideoList';
import { Session, VideoMetadata } from '@/lib/types'

interface VideoWrapperProps {
  clips: VideoMetadata[];
  session: Session;
}

export default function VideoWrapper({ clips, session }: VideoWrapperProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null)

  // Select the first video in the list on initial render
  useEffect(() => {
    if (clips.length > 0 && !selectedVideo) {
      setSelectedVideo(clips[0]);
    }
  }, [clips, selectedVideo]);

  const handleSelectVideo = (video: VideoMetadata) => {
    setSelectedVideo(video);
    console.log("Selected VideoMetadata: ", video);
  };

  return (
    <div className="flex flex-col justify-between py-4 bg-gray-100">
      <div className="md:mx-auto bg-white md:p-6 rounded-xl">
        <div className="flex flex-col">
          <VideoHeader session={session} />
          <VideoPlayer title={selectedVideo ? selectedVideo.title : ""} />
        </div>
        <VideoList 
          videos={clips} 
          selectedVideo={selectedVideo}
          onSelectVideo={handleSelectVideo}
        />
      </div>
    </div>
  );
}