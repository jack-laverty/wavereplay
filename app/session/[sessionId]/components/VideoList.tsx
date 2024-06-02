'use client';

import React, { useState, useEffect } from 'react';
import VideoThumbnail from './VideoThumbnail';
import { Video } from '@/lib/types';

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // select the first video in the list on page load
  useEffect(() => {
    if (videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(prevSelectedVideo => (prevSelectedVideo = video));
  };

  return (
    <div className="flex flex-row overflow-x-auto p-4 space-x-4 bg-white scroll-smooth">
      {videos.map((video, index) => (
        <VideoThumbnail
          key={index}
          video={video}
          isSelected={selectedVideo === video}
          onSelect={() => handleSelectVideo(video)}
        />
      ))}
    </div>
  );
};

export default VideoList;
