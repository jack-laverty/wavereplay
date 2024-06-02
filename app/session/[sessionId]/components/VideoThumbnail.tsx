import React from 'react';
import { Video } from '@/lib/types';

interface VideoThumbnailProps {
  video: Video;
  isSelected: boolean;
  onSelect: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, isSelected, onSelect }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center px-2 pb-2 rounded-lg cursor-pointer ${isSelected ? 'bg-slate-900 text-white' : 'bg-white text-black'}`} 
      onClick={onSelect}
    >
      <div className="flex items-center justify-center">
        <p className="p-2 text-sm font-semibold">{video.timestamp}</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-3 h-3 w-3">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd"></path>
        </svg>
        <p className="p-2 text-xs">{video.timestamp}</p>
      </div>
      <div>
        <div className="relative overflow-hidden h-20 w-36 md:h-24 md:w-44">
          <video loop={true} playsInline={true} preload="metadata" className="object-cover w-full h-full">
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
