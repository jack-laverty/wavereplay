import React from 'react';
import { VideoMetadata } from '@/lib/types';
import { Button } from "@/components/ui/button";

interface VideoThumbnailProps {
  video: VideoMetadata;
  isSelected: boolean;
  onSelect: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, isSelected, onSelect }) => {

  return (
    <Button
      variant={"outline"}
      className={`flex items-center justify-center rounded-lg p-0 w-36 md:w-44 h-24
        ${isSelected ? "border-2 border-black" : ""}
      `}
      onClick={onSelect}
    >
      <div className="relative overflow-hidden w-full h-full">
        {/* <video
          loop
          playsInline
          preload="metadata"
          className="object-cover w-full h-full"
        >
          <source src={""} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      </div>
    </Button>
  );
};

export default VideoThumbnail;
