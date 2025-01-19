'use client';

import React from 'react';
import VideoThumbnail from './video-thumbnail';
import { VideoMetadata } from '@/lib/types';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface VideoListProps {
  videos: VideoMetadata[];
  selectedVideo: VideoMetadata | null;
  onSelectVideo: (video: VideoMetadata) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, selectedVideo, onSelectVideo }) => {
  return (

    <ScrollArea className="bg-background rounded-lg">
      <div className="p-4 gap-2 flex flex-col">
        {videos.map((video, index) => (
          <VideoThumbnail
            key={index}
            video={video}
            isSelected={selectedVideo === video}
            onSelect={() => onSelectVideo(video)}
          />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>

  );
};

export default VideoList;
