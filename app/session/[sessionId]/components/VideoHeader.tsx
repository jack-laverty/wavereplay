import React from 'react';
import { Session } from '@/lib/types';


const VideoHeader: React.FC<{ session: Session }> = ({ session }) => {

  return (
    <div className="video-header flex items-center p-4 bg-slate-900 text-white rounded-t-xl">
      <img src="/chickenjoe.jpg" alt="Profile Image" className="w-14 h-14 rounded-full border-4 border-white" />
      <div className="flex flex-col pl-5 space-y-1">
        <div className="flex space-x-2">
          <div className="font-bold text-base">{session.surfer}</div>
          {/* <div className="text-base">{session.surfer_social}</div> */}
          <div className="text-base">@chickenjoe</div>
        </div>
        {/* <time className="text-sm">{session.date} - {video.time}</time> */}
        <time className="text-sm">{session.date} - {session.time}</time>
      </div>
    </div>
  );
};

export default VideoHeader;