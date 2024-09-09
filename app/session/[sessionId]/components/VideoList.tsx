'use client';

import React from 'react';
import VideoThumbnail from './VideoThumbnail';
import { Video } from '@/lib/types';

interface VideoListProps {
  videos: Video[];
  selectedVideo: Video | null;
  onSelectVideo: (video: Video) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, selectedVideo, onSelectVideo }) => {
  return (
    <div className="flex flex-row overflow-x-auto p-4 space-x-4 bg-white scroll-smooth">
      {videos.map((video, index) => (
        <VideoThumbnail
          key={index}
          video={video}
          isSelected={selectedVideo === video}
          onSelect={() => onSelectVideo(video)}
        />
      ))}
    </div>
  );
};

export default VideoList;