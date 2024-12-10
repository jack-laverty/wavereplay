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

    <ScrollArea className="bg-background rounded-b-lg whitespace-nowrap">
      <div className="p-2 space-x-2">
        {videos.map((video, index) => (
          <VideoThumbnail
            key={index}
            video={video}
            isSelected={selectedVideo === video}
            onSelect={() => onSelectVideo(video)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

  );
};

export default VideoList;
