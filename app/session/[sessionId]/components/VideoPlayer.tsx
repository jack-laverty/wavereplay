'use client';

import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
 
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const encodedVideoId = encodeURIComponent(videoId);
      videoRef.current.src = `/api/videos/${encodedVideoId}`;
    }
  }, [videoId]);

  return (
    <video ref={videoRef} width="1280" height="720">
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;