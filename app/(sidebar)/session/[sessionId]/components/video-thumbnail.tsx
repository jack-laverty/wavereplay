import React from 'react';
import { VideoMetadata } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Video, Clapperboard, Film } from "lucide-react";

interface VideoThumbnailProps {
  video: VideoMetadata;
  isSelected: boolean;
  onSelect: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, isSelected, onSelect }) => {

  const videoUrl = `/api/videos/${encodeURIComponent(video.title)}`;

  return (
    <Button
      variant={"outline"}
      className={`items-center rounded-xl justify-center p-0 min-w-36 md:w-44 h-24
        ${isSelected ? "border-4 border-current" : ""}
      `}
      onClick={onSelect}
    >
      <div className="relative overflow-hidden w-full h-full rounded-lg">
        <video
          loop
          autoPlay
          muted
          playsInline
          preload="metadata"
          className="object-cover w-full h-full"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Film className="w-12 h-12 border-current drop-shadow-lg" />
          </div>
        )}
      </div>
    </Button>
  );
};

export default VideoThumbnail;
